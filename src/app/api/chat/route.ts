import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { createChatCompletion, createEmbeddings } from "@/lib/ai/openrouter";
import { completeOnboarding, createConversation, getChatbotByPublicId, getChatbotForUser, getWorkspaceSummary, incrementUsage, saveMessage, searchChunks } from "@/lib/db/queries";
import { isRateLimited } from "@/lib/security/rate-limit";

type ChatBody = { message?: string; conversationId?: string; chatbotId?: string; history?: Array<{ role: "user" | "assistant"; content: string }> };

export async function POST(request: Request) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(address)) return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
  const body = await request.json().catch(() => null) as ChatBody | null;
  const message = body?.message?.trim() || "";
  if (!message || message.length > 2000) return NextResponse.json({ error: "Message must be between 1 and 2,000 characters." }, { status: 400 });

  const user = await getCurrentUser();
  const target = body?.chatbotId ? getChatbotByPublicId(body.chatbotId) : user ? getChatbotForUser(user.id) : null;
  if (!target) return NextResponse.json({ error: "Chatbot not found." }, { status: 404 });
  if (user && target.user_id !== user.id && !body?.chatbotId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const owner = user || { id: target.user_id };
  const summary = getWorkspaceSummary(owner.id);
  const messageLimit = summary.plan === "pro" ? 2000 : 50;
  if (summary.messagesCount >= messageLimit) return NextResponse.json({ error: "This assistant has reached its monthly message limit. Upgrade the plan to keep chatting." }, { status: 403 });

  try {
    const [queryEmbedding] = await createEmbeddings([message]);
    const matches = searchChunks(target.user_id, queryEmbedding, 6);
    const context = matches.map((match, index) => `[Source ${index + 1}: ${match.title}]\n${match.content}`).join("\n\n");
    const sources = [...new Map(matches.map((match) => [match.title, { title: match.title, similarity: Math.round(match.similarity * 100) }])).values()];
    const answer = await createChatCompletion([
      { role: "system", content: `You are ${target.name}, a precise company knowledge assistant. Answer only using the provided context. If the context does not contain the answer, say you don't have enough information and suggest contacting the team. Never invent policies, prices, or facts. Keep answers concise.\n\nCONTEXT:\n${context || "No knowledge sources are available yet."}` },
      ...(body?.history || []).slice(-6),
      { role: "user", content: message },
    ]);
    const conversationId = body?.conversationId || createConversation(user?.id || target.user_id, target.public_id);
    saveMessage(conversationId, "user", message);
    saveMessage(conversationId, "assistant", answer, sources.map((source) => source.title));
    incrementUsage(owner.id);
    completeOnboarding(owner.id, "first_chat_completed");
    return NextResponse.json({ answer, conversationId, sources });
  } catch {
    return NextResponse.json({ error: "The assistant is temporarily unavailable. Please check the AI configuration and try again." }, { status: 502 });
  }
}
