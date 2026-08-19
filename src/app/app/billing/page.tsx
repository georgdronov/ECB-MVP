"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const plans = [
  { id: "free" as const, name: "Starter", price: "$0", description: "For exploring what your knowledge can do.", features: ["3 knowledge sources", "50 messages / month", "5 MB per file", "Embeddable widget"] },
  { id: "pro" as const, name: "Growth", price: "$29", description: "For teams ready to make support effortless.", features: ["50 knowledge sources", "2,000 messages / month", "15 MB per file", "Remove Helpy branding", "Custom widget styling"] },
];

export default function BillingPage() {
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [ready, setReady] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<"free" | "pro" | null>(null);
  const [message, setMessage] = useState("");
  const [messageKey, setMessageKey] = useState(0);

  useEffect(() => {
    fetch("/api/billing").then((response) => response.json()).then((result) => setPlan(result.billing?.plan || "free")).finally(() => setReady(true));
  }, []);

  async function changePlan(nextPlan: "free" | "pro") {
    if (nextPlan === plan || loadingPlan) return;
    setLoadingPlan(nextPlan);
    setMessage("");
    const response = await fetch("/api/billing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: nextPlan }) });
    if (response.ok) {
      setPlan(nextPlan);
      setMessage(nextPlan === "pro" ? "Your workspace is now on Growth. Enjoy the extra room." : "Your workspace is back on Starter.");
      setMessageKey((key) => key + 1);
    } else {
      setMessage("We could not update your plan. Please try again.");
      setMessageKey((key) => key + 1);
    }
    setLoadingPlan(null);
  }

  return <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12"><p className="text-sm text-muted">Plans that grow with your knowledge</p><div><h1 className="mt-1 text-3xl font-bold tracking-tight">Billing</h1><div className="mt-3 inline-flex h-7 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-success ring-1 ring-emerald-100"><span className="size-1.5 rounded-full bg-success" />{ready ? `${plan} plan active` : "Loading plan…"}</div></div><div className="mt-5 h-12">{message ? <p key={messageKey} className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-success animate-soft-in">{message}</p> : null}</div><div className="mt-3 grid gap-4 md:grid-cols-2">{!ready ? <><PlanSkeleton /><PlanSkeleton featured /></> : plans.map((item) => { const isCurrent = item.id === plan; const isLoading = item.id === loadingPlan; return <Card key={item.id} className={`min-h-[426px] transition-all duration-300 ease-out ${isCurrent ? "ring-2 ring-accent shadow-md" : "ring-1 ring-border hover:shadow-md"}`}><CardHeader><div className="flex items-center justify-between"><h2 className="text-lg font-bold">{item.name}</h2>{item.id === "pro" ? <Badge>Popular</Badge> : null}</div><p className="mt-2 text-sm text-muted">{item.description}</p><p className="mt-6 text-4xl font-bold">{item.price}<span className="text-sm font-normal text-muted"> / month</span></p></CardHeader><CardContent><Button className="w-full" variant={isCurrent ? "secondary" : "primary"} disabled={isCurrent} loading={isLoading} onClick={() => void changePlan(item.id)}>{isCurrent ? "Current plan" : `Switch to ${item.name}`}</Button><ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm">{item.features.map((feature) => <li key={feature} className="flex gap-2"><span className="text-accent">✓</span><span>{feature}</span></li>)}</ul></CardContent></Card>; })}</div><p className="mt-6 text-center text-xs text-muted">Demo billing only. No payment details are collected.</p></div>;
}

function PlanSkeleton({ featured = false }: { featured?: boolean }) {
  return <div className={`min-h-[426px] animate-pulse rounded-2xl bg-surface p-6 ring-1 ring-border ${featured ? "ring-2 ring-accent/30" : ""}`}><div className="h-5 w-24 rounded bg-surface-muted" /><div className="mt-5 h-4 w-64 max-w-full rounded bg-surface-muted" /><div className="mt-8 h-10 w-36 rounded bg-surface-muted" /><div className="mt-8 h-11 w-full rounded-xl bg-surface-muted" /><div className="mt-7 border-t border-border pt-6"><div className="space-y-4"><div className="h-4 w-48 rounded bg-surface-muted" /><div className="h-4 w-52 rounded bg-surface-muted" /><div className="h-4 w-40 rounded bg-surface-muted" /><div className="h-4 w-44 rounded bg-surface-muted" /></div></div></div>;
}
