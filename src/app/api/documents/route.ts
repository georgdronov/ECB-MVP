import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { cleanText, chunkText, extractText, getExtension } from "@/lib/documents/extract";
import { createDocument, getWorkspaceSummary, listDocuments } from "@/lib/db/queries";
import { completeDocumentIndex, failDocumentIndex } from "@/lib/db/queries";
import { createEmbeddings } from "@/lib/ai/openrouter";

const maxFileSize = 15 * 1024 * 1024;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ documents: listDocuments(user.id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const summary = getWorkspaceSummary(user.id);
  const documentLimit = summary.plan === "pro" ? 50 : 3;
  if (summary.documentCount >= documentLimit) return NextResponse.json({ error: `Your ${summary.plan} plan allows ${documentLimit} knowledge sources. Upgrade your plan to add more.` }, { status: 403 });
  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") || "").trim();
  const textContent = String(formData.get("content") || "").trim();

  if (textContent) {
    if (!title) return NextResponse.json({ error: "Add a title for this knowledge." }, { status: 400 });
    const chunks = chunkText(cleanText(textContent));
    if (!chunks.length) return NextResponse.json({ error: "Knowledge content cannot be empty." }, { status: 400 });
    const documentId = createDocument(user.id, title, "text", Buffer.byteLength(textContent), chunks);
    const indexing = await indexDocument(documentId, user.id, chunks);
    if (!indexing.ok) return NextResponse.json({ error: indexing.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file or add text knowledge." }, { status: 400 });
  if (file.size > maxFileSize) return NextResponse.json({ error: "This file is too large. The maximum is 15 MB." }, { status: 400 });
  const extension = getExtension(file.name);
  if (!extension) return NextResponse.json({ error: "Supported formats: PDF, DOCX, TXT, and MD." }, { status: 400 });

  try {
    const text = cleanText(await extractText(Buffer.from(await file.arrayBuffer()), extension));
    const chunks = chunkText(text);
    if (!chunks.length) return NextResponse.json({ error: "We could not find readable text in this file." }, { status: 400 });
    const documentId = createDocument(user.id, file.name, extension, file.size, chunks);
    const indexing = await indexDocument(documentId, user.id, chunks);
    if (!indexing.ok) return NextResponse.json({ error: indexing.error }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not read this file. Please try another document." }, { status: 400 });
  }
}

async function indexDocument(documentId: string, userId: string, chunks: string[]) {
  try {
    const embeddings = await createEmbeddings(chunks);
    if (embeddings.length !== chunks.length) throw new Error("Embedding count did not match document chunks.");
    completeDocumentIndex(documentId, userId, embeddings);
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Indexing failed.";
    failDocumentIndex(documentId, userId, message);
    return { ok: false as const, error: "We could not index this knowledge source. Check your OpenRouter configuration and try again." };
  }
}
