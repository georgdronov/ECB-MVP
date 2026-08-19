"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type ChatMessage = { role: "user" | "assistant"; content: string; sources?: Array<{ title: string; similarity: number }> };
type ChatPlaygroundProps = { chatbotId: string; botName: string; welcomeMessage: string; accentColor?: string; backgroundColor?: string; textColor?: string; fontFamily?: string; compact?: boolean };

const examples = ["What can you help me with?", "What is our return policy?", "How long does delivery take?"];

export function ChatPlayground({ chatbotId, botName, welcomeMessage, accentColor = "#5b4bff", backgroundColor = "#faf8f5", textColor = "#1c1b1a", fontFamily = "system", compact = false }: ChatPlaygroundProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: welcomeMessage }]);
  const [value, setValue] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(rawMessage = value) {
    const message = rawMessage.trim();
    if (!message || loading) return;
    setValue(""); setError(""); setLoading(true);
    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, chatbotId, conversationId, history: nextMessages.slice(-7).map(({ role, content }) => ({ role, content })) }) });
    const result = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) { setError(result.error || "The assistant could not reply."); return; }
    setConversationId(result.conversationId);
    setMessages((current) => [...current, { role: "assistant", content: result.answer, sources: result.sources }]);
    window.dispatchEvent(new CustomEvent("helpy:chat-completed"));
  }

  const font = fontFamily === "serif" ? "Georgia, serif" : fontFamily === "mono" ? "ui-monospace, monospace" : "system-ui, sans-serif";
  const style = { "--chat-accent": accentColor, "--chat-background": backgroundColor, "--chat-text": textColor, fontFamily: font } as React.CSSProperties;

  return <div className={`flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-border ${compact ? "h-full min-h-0" : "min-h-[calc(100vh-8rem)]"}`} style={style}>
    <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-4"><span className="grid size-9 place-items-center rounded-xl bg-[var(--chat-accent)] text-sm font-bold text-white">H</span><div><h1 className="text-sm font-bold text-[var(--chat-text)]">{botName}</h1><p className="flex items-center gap-1.5 text-xs text-muted"><span className="size-1.5 rounded-full bg-success" /> Playground</p></div></div>
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-[var(--chat-background)] px-4 py-6 sm:px-8">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[85%]"}><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-tr-sm bg-[var(--chat-accent)] text-white" : "rounded-tl-sm bg-surface text-[var(--chat-text)] ring-1 ring-border"}`}>{message.content}</div>{message.sources?.length ? <div className="mt-2 flex flex-wrap gap-2">{message.sources.map((source) => <span key={source.title} className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-semibold text-[var(--chat-accent)]">↗ {source.title}</span>)}</div> : null}</div>)}{loading ? <div className="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-tl-sm bg-surface px-4 py-4 ring-1 ring-border"><span className="size-1.5 animate-bounce rounded-full bg-muted" /><span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:-.1s]" /><span className="size-1.5 animate-bounce rounded-full bg-muted [animation-delay:-.2s]" /></div> : null}{error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger" role="alert">{error}</div> : null}{messages.length === 1 && !loading ? <div className="mt-auto grid gap-2 sm:grid-cols-3">{examples.map((example) => <button key={example} onClick={() => void sendMessage(example)} className="rounded-xl bg-surface px-3 py-3 text-left text-xs font-medium text-muted ring-1 ring-border transition-colors hover:bg-accent-soft hover:text-[var(--chat-accent)]">{example}<span className="float-right">↗</span></button>)}</div> : null}</div>
    <form className="shrink-0 border-t border-border bg-surface p-4" onSubmit={(event) => { event.preventDefault(); void sendMessage(); }}><div className="flex items-end gap-2 rounded-xl border border-border bg-surface p-2 transition-[border-color,box-shadow] focus-within:border-[var(--chat-accent)] focus-within:ring-2 focus-within:ring-[var(--chat-accent)]"><textarea value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Ask your assistant a question..." rows={1} className="chat-input-reset max-h-32 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-[var(--chat-text)] placeholder:text-muted" /><Button type="submit" className="size-10 min-h-10 border-0 bg-[var(--chat-accent)] p-0 outline-none hover:brightness-95 focus:border-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0" disabled={!value.trim() || loading} aria-label="Send message">↑</Button></div><p className="mt-2 text-center text-[10px] text-muted">Helpy answers based on your uploaded knowledge.</p></form>
  </div>;
}
