"use client";

import { useState } from "react";

const defaultSnippet = `<script src="http://localhost:3000/widget.js" data-chatbot-id="YOUR_CHATBOT_ID" async></script>`;

export default function DemoSite() {
  const [snippet, setSnippet] = useState(defaultSnippet);
  const [installed, setInstalled] = useState(false);
  const [error, setError] = useState("");

  function installWidget() {
    setError("");
    const source = snippet.match(/src=["']([^"']+widget\.js)["']/i)?.[1];
    const chatbotId = snippet.match(/data-chatbot-id=["']([^"']+)["']/i)?.[1];
    if (!source || !chatbotId || chatbotId === "YOUR_CHATBOT_ID") {
      setError("Paste the complete snippet copied from the Embed page.");
      return;
    }

    document.querySelectorAll("[data-helpy-widget]").forEach((element) => element.remove());
    const script = document.createElement("script");
    script.src = source;
    script.async = true;
    script.setAttribute("data-chatbot-id", chatbotId);
    script.setAttribute("data-helpy-widget", "script");
    document.body.appendChild(script);
    setInstalled(true);
  }

  return <main className="min-h-screen bg-[#f5f1e9] text-[#242326]"><header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6"><strong className="text-xl">Acme &amp; Co.</strong><nav className="hidden gap-6 text-sm text-[#6b6560] sm:flex"><span>Shop</span><span>Our story</span><span>Support</span></nav><span className="rounded-full bg-[#242326] px-4 py-2 text-xs font-bold text-white">Widget demo</span></header><section className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:pt-24"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#5b4bff]">Embeddable widget preview</p><h1 className="mt-5 max-w-2xl text-6xl font-semibold leading-[.95] tracking-[-.07em] sm:text-8xl">Your assistant, on any website.</h1><p className="mt-7 max-w-md text-lg leading-8 text-[#6b6560]">This demo site lets you install your Helpy widget without editing HTML files. Paste the snippet from the Embed page below.</p><div className="mt-12 max-w-2xl rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e2dcd2] sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#5b4bff]">Live installation</p><h2 className="mt-2 text-xl font-bold">Connect your assistant</h2></div><span className="rounded-full bg-[#f0ecff] px-2.5 py-1 text-[10px] font-bold text-[#5b4bff]">LOCAL DEMO</span></div><label className="mt-5 block text-sm font-semibold">Embed snippet<textarea value={snippet} onChange={(event) => { setSnippet(event.target.value); setInstalled(false); }} className="mt-2 min-h-24 w-full resize-y rounded-xl bg-[#faf8f5] px-3.5 py-3 font-mono text-xs leading-6 outline-none ring-1 ring-[#e2dcd2] focus:ring-2 focus:ring-[#5b4bff]" /></label><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"><button onClick={installWidget} className="inline-flex h-11 items-center justify-center rounded-xl bg-[#5b4bff] px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#493be0]">{installed ? "Widget installed ✓" : "Install widget →"}</button><p className="text-xs text-[#6b6560]">Copy it from `/app/embed`, then paste it here.</p></div>{error ? <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p> : null}{installed ? <p className="mt-3 text-xs font-semibold text-emerald-700">The widget is live in the bottom-right corner of this page.</p> : null}</div><div className="mt-20 grid gap-4 sm:grid-cols-3"><div className="h-64 rounded-2xl bg-[#d8c7b3]" /><div className="h-64 rounded-2xl bg-[#c5d1c2]" /><div className="h-64 rounded-2xl bg-[#d0c4db]" /></div></section></main>;
}
