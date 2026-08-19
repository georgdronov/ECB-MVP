import { notFound } from "next/navigation";
import { getChatbotByPublicId } from "@/lib/db/queries";
import { ChatPlayground } from "@/components/playground/chat-playground";

export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bot = getChatbotByPublicId(id);
  if (!bot) notFound();
  return <main className="h-screen min-h-0 overflow-hidden bg-transparent p-2"><ChatPlayground compact chatbotId={bot.public_id} botName={bot.name} welcomeMessage={bot.welcome_message} accentColor={bot.accent_color} backgroundColor={bot.background_color} textColor={bot.text_color} fontFamily={bot.font_family} /></main>;
}
