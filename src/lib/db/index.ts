import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { schema } from "@/lib/db/schema";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "helply.sqlite");

declare global {
  var helpyDatabase: Database.Database | undefined;
}

function ensureChatbotSettingsColumns(database: Database.Database) {
  const columns = new Set((database.prepare("PRAGMA table_info(chatbot_settings)").all() as Array<{ name: string }>).map((column) => column.name));
  // Add settings introduced after the initial local database was created.
  for (const [name, definition] of [
    ["background_color", "TEXT NOT NULL DEFAULT '#faf8f5'"],
    ["text_color", "TEXT NOT NULL DEFAULT '#1c1b1a'"],
    ["font_family", "TEXT NOT NULL DEFAULT 'system'"],
  ]) {
    if (!columns.has(name)) database.exec(`ALTER TABLE chatbot_settings ADD COLUMN ${name} ${definition}`);
  }
}

function createDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.exec(schema);
  ensureChatbotSettingsColumns(database);
  return database;
}

export function getDatabase() {
  if (!globalThis.helpyDatabase) {
    globalThis.helpyDatabase = createDatabase();
  }
  ensureChatbotSettingsColumns(globalThis.helpyDatabase);
  globalThis.helpyDatabase.exec("CREATE TABLE IF NOT EXISTS onboarding_progress (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, first_chat_completed INTEGER NOT NULL DEFAULT 0, embed_copied INTEGER NOT NULL DEFAULT 0)");
  return globalThis.helpyDatabase;
}

export function closeDatabaseForTests() {
  globalThis.helpyDatabase?.close();
  globalThis.helpyDatabase = undefined;
}
