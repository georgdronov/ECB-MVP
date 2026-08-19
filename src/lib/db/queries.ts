import { randomUUID } from "node:crypto";
import { getDatabase } from "@/lib/db";

export function createUser(email: string, passwordHash: string) {
  const database = getDatabase();
  const userId = randomUUID();
  const chatbotId = randomUUID();
  const now = new Date().toISOString();

  const create = database.transaction(() => {
    database.prepare(
      "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
    ).run(userId, email, passwordHash, now);
    database.prepare(
      "INSERT INTO chatbot_settings (id, user_id, public_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ).run(randomUUID(), userId, chatbotId, now, now);
    database.prepare(
      "INSERT INTO subscriptions (id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?)",
    ).run(randomUUID(), userId, now, now);
    database.prepare("INSERT INTO onboarding_progress (user_id) VALUES (?)").run(userId);
  });

  create();
  return { userId, chatbotId };
}

export function findUserByEmail(email: string) {
  return getDatabase()
    .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
    .get(email) as { id: string; email: string; password_hash: string } | undefined;
}

export function findUserById(id: string) {
  return getDatabase().prepare("SELECT id, email FROM users WHERE id = ?").get(id) as
    | { id: string; email: string }
    | undefined;
}

export function getWorkspaceSummary(userId: string) {
  const database = getDatabase();
  const bot = database.prepare("SELECT name, public_id FROM chatbot_settings WHERE user_id = ?").get(userId) as { name: string; public_id: string } | undefined;
  const subscription = database.prepare("SELECT plan FROM subscriptions WHERE user_id = ?").get(userId) as { plan: "free" | "pro" } | undefined;
  const documentCount = database.prepare("SELECT COUNT(*) as count FROM documents WHERE user_id = ?").get(userId) as { count: number };
  const month = new Date().toISOString().slice(0, 7);
  const usage = database.prepare("SELECT messages_count FROM monthly_usage WHERE user_id = ? AND month = ?").get(userId, month) as { messages_count: number } | undefined;
  const onboarding = database.prepare("SELECT first_chat_completed, embed_copied FROM onboarding_progress WHERE user_id = ?").get(userId) as { first_chat_completed: number; embed_copied: number } | undefined;

  return {
    botName: bot?.name || "Helply Assistant",
    publicId: bot?.public_id || "",
    plan: subscription?.plan || "free",
    documentCount: documentCount.count,
    messagesCount: usage?.messages_count || 0,
    firstChatCompleted: Boolean(onboarding?.first_chat_completed),
    embedCopied: Boolean(onboarding?.embed_copied),
  };
}

export function listDocuments(userId: string) {
  return getDatabase().prepare("SELECT id, title, source_type, file_size, status, error_message, created_at, updated_at FROM documents WHERE user_id = ? ORDER BY created_at DESC").all(userId) as Array<{ id: string; title: string; source_type: string; file_size: number; status: string; error_message: string | null; created_at: string; updated_at: string }>;
}

export function createDocument(userId: string, title: string, sourceType: string, fileSize: number, chunks: string[]) {
  const database = getDatabase();
  const documentId = crypto.randomUUID();
  const insert = database.transaction(() => {
    database.prepare("INSERT INTO documents (id, user_id, title, source_type, file_size, status) VALUES (?, ?, ?, ?, ?, 'processing')").run(documentId, userId, title, sourceType, fileSize);
    const chunkStatement = database.prepare("INSERT INTO document_chunks (id, document_id, user_id, content, chunk_index) VALUES (?, ?, ?, ?, ?)");
    chunks.forEach((content, index) => chunkStatement.run(crypto.randomUUID(), documentId, userId, content, index));
  });
  insert();
  return documentId;
}

export function completeDocumentIndex(documentId: string, userId: string, embeddings: number[][]) {
  const database = getDatabase();
  const update = database.transaction(() => {
    const chunks = database.prepare("SELECT id FROM document_chunks WHERE document_id = ? AND user_id = ? ORDER BY chunk_index").all(documentId, userId) as Array<{ id: string }>;
    const statement = database.prepare("UPDATE document_chunks SET embedding = ? WHERE id = ?");
    chunks.forEach((chunk, index) => statement.run(JSON.stringify(embeddings[index]), chunk.id));
    database.prepare("UPDATE documents SET status = 'ready', error_message = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?").run(documentId, userId);
  });
  update();
}

export function failDocumentIndex(documentId: string, userId: string, errorMessage: string) {
  getDatabase().prepare("UPDATE documents SET status = 'failed', error_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?").run(errorMessage, documentId, userId);
}

type SearchChunk = { id: string; document_id: string; title: string; content: string; embedding: string };

function cosineSimilarity(left: number[], right: number[]) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] ** 2;
    rightMagnitude += (right[index] || 0) ** 2;
  }
  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude) || 1);
}

export function searchChunks(userId: string, queryEmbedding: number[], limit = 5) {
  const chunks = getDatabase().prepare("SELECT c.id, c.document_id, d.title, c.content, c.embedding FROM document_chunks c JOIN documents d ON d.id = c.document_id WHERE c.user_id = ? AND d.status = 'ready' AND c.embedding IS NOT NULL").all(userId) as SearchChunk[];
  return chunks.map((chunk) => ({ ...chunk, similarity: cosineSimilarity(queryEmbedding, JSON.parse(chunk.embedding)) })).sort((a, b) => b.similarity - a.similarity).slice(0, limit);
}

export function createConversation(userId: string, chatbotPublicId: string) {
  const id = crypto.randomUUID();
  getDatabase().prepare("INSERT INTO conversations (id, user_id, chatbot_public_id) VALUES (?, ?, ?)").run(id, userId, chatbotPublicId);
  return id;
}

export function saveMessage(conversationId: string, role: "user" | "assistant", content: string, sources: string[] = []) {
  getDatabase().prepare("INSERT INTO messages (id, conversation_id, role, content, sources) VALUES (?, ?, ?, ?, ?)").run(crypto.randomUUID(), conversationId, role, content, JSON.stringify(sources));
}

export function getChatbotByPublicId(publicId: string) {
  return getDatabase().prepare("SELECT user_id, public_id, name, welcome_message, accent_color, background_color, text_color, font_family FROM chatbot_settings WHERE public_id = ?").get(publicId) as ChatbotSettings | undefined;
}

export function getChatbotForUser(userId: string) {
  return getDatabase().prepare("SELECT user_id, public_id, name, welcome_message, accent_color, background_color, text_color, font_family FROM chatbot_settings WHERE user_id = ?").get(userId) as ChatbotSettings | undefined;
}

type ChatbotSettings = { user_id: string; public_id: string; name: string; welcome_message: string; accent_color: string; background_color: string; text_color: string; font_family: string; position?: string };

export function updateChatbotSettings(userId: string, values: { name: string; welcomeMessage: string; accentColor: string; position: string; backgroundColor: string; textColor: string; fontFamily: string }) {
  getDatabase().prepare("UPDATE chatbot_settings SET name = ?, welcome_message = ?, accent_color = ?, position = ?, background_color = ?, text_color = ?, font_family = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?").run(values.name, values.welcomeMessage, values.accentColor, values.position, values.backgroundColor, values.textColor, values.fontFamily, userId);
  return getChatbotForUser(userId);
}

export function updatePlan(userId: string, plan: "free" | "pro") {
  getDatabase().prepare("UPDATE subscriptions SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?").run(plan, userId);
  return getDatabase().prepare("SELECT plan, status FROM subscriptions WHERE user_id = ?").get(userId) as { plan: "free" | "pro"; status: string };
}

export function getUsage(userId: string) {
  const month = new Date().toISOString().slice(0, 7);
  return getDatabase().prepare("SELECT messages_count FROM monthly_usage WHERE user_id = ? AND month = ?").get(userId, month) as { messages_count: number } | undefined;
}

export function incrementUsage(userId: string) {
  const month = new Date().toISOString().slice(0, 7);
  getDatabase().prepare("INSERT INTO monthly_usage (id, user_id, month, messages_count) VALUES (?, ?, ?, 1) ON CONFLICT(user_id, month) DO UPDATE SET messages_count = messages_count + 1").run(crypto.randomUUID(), userId, month);
}

export function completeOnboarding(userId: string, step: "first_chat_completed" | "embed_copied") {
  getDatabase().prepare(`INSERT INTO onboarding_progress (user_id, ${step}) VALUES (?, 1) ON CONFLICT(user_id) DO UPDATE SET ${step} = 1`).run(userId);
}

export function deleteDocument(userId: string, documentId: string) {
  return getDatabase().prepare("DELETE FROM documents WHERE id = ? AND user_id = ?").run(documentId, userId).changes > 0;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
