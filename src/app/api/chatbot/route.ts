import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { getChatbotForUser, updateChatbotSettings } from "@/lib/db/queries";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ chatbot: getChatbotForUser(user.id) });
  } catch (error) {
    console.error("GET /api/chatbot failed", error);
    return NextResponse.json({ error: "Could not load chatbot settings." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { name?: string; welcomeMessage?: string; accentColor?: string; position?: string; backgroundColor?: string; textColor?: string; fontFamily?: string } | null;
  const name = body?.name?.trim() || "Helply Assistant";
  const welcomeMessage = body?.welcomeMessage?.trim() || "Hi! Ask me anything about our company.";
  const accentColor = body?.accentColor || "#5b4bff";
  const backgroundColor = body?.backgroundColor || "#faf8f5";
  const textColor = body?.textColor || "#1c1b1a";
  const fontFamily = body?.fontFamily || "system";
  const position = body?.position === "left" ? "left" : "right";
  if (name.length > 60 || welcomeMessage.length > 240 || !/^#[0-9a-f]{6}$/i.test(accentColor) || !/^#[0-9a-f]{6}$/i.test(backgroundColor) || !/^#[0-9a-f]{6}$/i.test(textColor) || !["system", "serif", "mono"].includes(fontFamily)) return NextResponse.json({ error: "Please check your widget settings." }, { status: 400 });
  return NextResponse.json({ chatbot: updateChatbotSettings(user.id, { name, welcomeMessage, accentColor, position, backgroundColor, textColor, fontFamily }) });
}
