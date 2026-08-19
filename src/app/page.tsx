import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Bring your knowledge",
    description: "Drop in product docs, help articles, or internal playbooks. Helply turns them into a searchable source of truth.",
  },
  {
    number: "02",
    title: "Give it a voice",
    description: "Your assistant answers naturally, stays grounded in your content, and shows exactly where it found the answer.",
  },
  {
    number: "03",
    title: "Meet customers anywhere",
    description: "Add one lightweight snippet to your website and let customers get useful answers without leaving the page.",
  },
];

const plans = [
  { name: "Starter", price: "$0", description: "A simple way to see what your knowledge can do.", features: ["3 knowledge sources", "50 conversations / month", "5 MB per file", "Embeddable chat widget"], cta: "Start for free", highlighted: false },
  { name: "Growth", price: "$29", description: "For teams ready to make support feel effortless.", features: ["50 knowledge sources", "2,000 conversations / month", "15 MB per file", "Remove Helply branding", "Custom widget styling"], cta: "Choose Growth", highlighted: true },
];

function Mark({ className = "size-4" }: { className?: string }) {
  return <span className={`grid shrink-0 place-items-center rounded-[7px] bg-accent text-white ${className}`}><svg viewBox="0 0 24 24" fill="none" className="size-3.5" aria-hidden="true"><path d="m6 12.5 4 4L18.5 8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>;
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight"><Mark className="size-8" /><span>helply</span></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-3 text-sm font-semibold"><Link href="/login" className="hidden text-muted transition-colors hover:text-foreground sm:block">Sign in</Link><Link href="/signup" className="rounded-xl bg-foreground px-4 py-2.5 text-white transition-transform hover:-translate-y-0.5">Get started</Link></div>
      </header>

      <section className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-10 lg:pb-32 lg:pt-28">
        <div className="pointer-events-none absolute -left-40 top-0 -z-10 size-[34rem] rounded-full bg-accent-soft/60 blur-3xl" />
        <div className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-muted ring-1 ring-border"><span className="size-1.5 rounded-full bg-success" /> Your docs, now in conversation</div>
          <h1 className="max-w-xl text-[clamp(3.1rem,7vw,5.8rem)] font-semibold leading-[0.94] tracking-[-0.065em]">Make your knowledge <span className="text-accent">helpful.</span></h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-muted">Turn scattered company docs into an AI assistant your team and customers can actually talk to.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3"><Link href="/signup" className="rounded-xl bg-accent px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent-hover">Build your assistant <span aria-hidden="true">↗</span></Link><a href="#how-it-works" className="rounded-xl px-5 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-muted">See how it works <span aria-hidden="true">↓</span></a></div>
          <p className="mt-6 text-xs font-medium text-muted">No credit card required <span className="mx-2 text-border">•</span> Free forever plan</p>
        </div>

        <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto">
          <div className="absolute -right-8 -top-7 hidden rotate-3 rounded-xl bg-foreground px-4 py-3 text-xs font-semibold text-white shadow-xl sm:block"><span className="mr-2 text-accent-soft">✦</span> Knows your business</div>
          <div className="rounded-[1.65rem] bg-[#242326] p-2.5 shadow-2xl shadow-foreground/20 sm:p-3">
            <div className="overflow-hidden rounded-[1.15rem] bg-[#faf9f7]">
              <div className="flex items-center justify-between border-b border-[#e8e4df] bg-white px-5 py-4"><div className="flex items-center gap-2.5"><Mark className="size-7" /><div><p className="text-xs font-bold text-foreground">Acme assistant</p><p className="text-[10px] text-muted">Usually replies instantly</p></div></div><span className="size-2 rounded-full bg-success ring-4 ring-emerald-50" /></div>
              <div className="space-y-5 px-5 py-7 sm:px-8 sm:py-10"><div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-foreground shadow-sm ring-1 ring-[#eeeae5]">Hi there! I&apos;m your Acme assistant. How can I help you today?</div><div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-sm leading-6 text-white">What&apos;s your return policy?</div><div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-6 text-foreground shadow-sm ring-1 ring-[#eeeae5]"><p>We offer a <strong>30-day return window</strong> for unused items in their original packaging. Start a return from your order page and we&apos;ll take it from there.</p><div className="mt-3 flex items-center gap-1.5 border-t border-[#eeeae5] pt-2.5 text-[10px] font-semibold text-muted"><span className="text-accent">↗</span> Source: Returns &amp; exchanges</div></div></div>
              <div className="border-t border-[#e8e4df] bg-white p-4"><div className="flex items-center justify-between rounded-xl bg-[#f6f3ef] px-4 py-3 text-xs text-muted"><span>Ask a question...</span><span className="grid size-7 place-items-center rounded-lg bg-accent text-white">↑</span></div></div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 rounded-xl bg-white px-4 py-3 shadow-xl ring-1 ring-border sm:-left-8"><p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Answer confidence</p><div className="mt-1.5 flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-accent-soft"><div className="h-full w-[92%] rounded-full bg-accent" /></div><span className="text-xs font-bold">92%</span></div></div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/55" id="how-it-works"><div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mb-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">A better starting point</p><h2 className="max-w-lg text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">From blank page to helpful in minutes.</h2></div><p className="max-w-xs text-sm leading-6 text-muted">No prompt engineering degree required. Bring the good stuff, we&apos;ll handle the busywork.</p></div><div className="grid gap-px overflow-hidden rounded-2xl bg-border ring-1 ring-border md:grid-cols-3">{features.map((feature) => <article key={feature.number} className="bg-background p-7 sm:p-9"><p className="mb-16 font-mono text-xs text-accent">/ {feature.number}</p><h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p></article>)}</div></div></section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-10 lg:py-28"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">Built for trust</p><h2 className="max-w-md text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Answers with receipts, not guesses.</h2><p className="mt-5 max-w-md text-sm leading-7 text-muted">Helply keeps every response close to your source material. When it doesn&apos;t know, it says so. When it does, you can see why.</p><ul className="mt-7 space-y-3 text-sm font-medium"><li className="flex items-center gap-3"><Mark /> Grounded in your own content</li><li className="flex items-center gap-3"><Mark /> Source links on every answer</li><li className="flex items-center gap-3"><Mark /> Private by default</li></ul></div><div className="rounded-2xl bg-foreground p-6 text-white sm:p-8"><div className="mb-7 flex items-center justify-between"><span className="text-sm font-semibold">Knowledge health</span><span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70">LIVE</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white/10 p-4"><p className="text-2xl font-semibold">24</p><p className="mt-1 text-xs text-white/50">Sources indexed</p></div><div className="rounded-xl bg-white/10 p-4"><p className="text-2xl font-semibold">98%</p><p className="mt-1 text-xs text-white/50">Answer accuracy</p></div><div className="col-span-2 rounded-xl bg-accent p-4 sm:col-span-1"><p className="text-2xl font-semibold">1.2s</p><p className="mt-1 text-xs text-white/70">Average response</p></div></div><div className="mt-3 rounded-xl bg-white/10 p-4"><div className="flex items-center justify-between text-xs text-white/60"><span>Knowledge coverage</span><span>Good</span></div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full w-[86%] rounded-full bg-accent-soft" /></div></div></div></section>

      <section className="bg-surface/55" id="pricing"><div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto mb-12 max-w-xl text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">Simple pricing</p><h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Start small. Grow when it helps.</h2><p className="mt-4 text-sm leading-6 text-muted">Everything you need to make your knowledge useful, with room to scale.</p></div><div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">{plans.map((plan) => <article key={plan.name} className={`rounded-2xl p-7 ring-1 ${plan.highlighted ? "bg-foreground text-white ring-foreground" : "bg-background ring-border"}`}><div className="flex items-start justify-between"><div><h3 className="font-semibold">{plan.name}</h3><p className={`mt-2 text-sm ${plan.highlighted ? "text-white/60" : "text-muted"}`}>{plan.description}</p></div>{plan.highlighted ? <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">Popular</span> : null}</div><p className="mt-8 text-4xl font-semibold tracking-tight">{plan.price}<span className={`text-sm font-normal ${plan.highlighted ? "text-white/50" : "text-muted"}`}> / month</span></p><Link href="/signup" className={`mt-7 flex h-11 items-center justify-center rounded-xl text-sm font-bold ${plan.highlighted ? "bg-white text-foreground hover:bg-white/90" : "bg-accent text-white hover:bg-accent-hover"}`}>{plan.cta}</Link><ul className="mt-7 space-y-3 border-t border-current/10 pt-6 text-sm">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2.5"><Mark className={`size-5 ${plan.highlighted ? "bg-white/15 text-white" : ""}`} /><span className={plan.highlighted ? "text-white/75" : "text-muted"}>{feature}</span></li>)}</ul></article>)}</div></div></section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8 lg:px-10 lg:py-28"><div className="relative overflow-hidden rounded-3xl bg-accent px-6 py-16 text-white sm:px-10"><div className="absolute -right-16 -top-20 size-64 rounded-full border-[40px] border-white/10" /><div className="absolute -bottom-32 -left-12 size-72 rounded-full border-[50px] border-white/10" /><p className="relative text-xs font-bold uppercase tracking-[0.2em] text-white/65">Your next helpful hire</p><h2 className="relative mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Your docs have answers. Let&apos;s make them easy to find.</h2><Link href="/signup" className="relative mt-8 inline-flex rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-accent transition-transform hover:-translate-y-0.5">Build your assistant <span className="ml-2">↗</span></Link></div></section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-border px-5 py-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><Link href="/" className="font-bold text-foreground">helply<span className="text-accent">.</span></Link><p>Useful answers, wherever your customers are.</p><p>© 2026 Helply</p></footer>
    </main>
  );
}
