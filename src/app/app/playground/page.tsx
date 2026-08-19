import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/user";
import { getChatbotForUser } from "@/lib/db/queries";
import { ChatPlayground } from "@/components/playground/chat-playground";

export default async function PlaygroundPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const bot = getChatbotForUser(user.id);
  if (!bot) return null;
  return <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12"><div className="mb-5"><p className="text-sm text-muted">Test your assistant before you share it</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Playground</h1></div><ChatPlayground chatbotId={bot.public_id} botName={bot.name} welcomeMessage={bot.welcome_message} accentColor={bot.accent_color} backgroundColor={bot.background_color} textColor={bot.text_color} fontFamily={bot.font_family} /></div>;
}
