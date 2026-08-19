"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const navigation = [
  { href: "/app", label: "Overview", icon: "⌂" },
  { href: "/app/knowledge", label: "Knowledge", icon: "▤" },
  { href: "/app/playground", label: "Playground", icon: "◌" },
  { href: "/app/embed", label: "Embed", icon: "⌘" },
];

export function AppShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCollapsed(window.localStorage.getItem("helpy-sidebar-collapsed") === "true");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("helpy-sidebar-collapsed", String(next));
      return next;
    });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return <div className="min-h-screen bg-background"><header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden"><Link href="/app" className="flex items-center gap-2 font-bold"><span className="grid size-7 place-items-center rounded-lg bg-accent text-xs text-white">H</span>helpy</Link><button className="rounded-lg p-2 text-muted hover:bg-surface-muted" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">☰</button></header><aside className={cn("fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-surface px-3 py-5 transition-[width,transform] duration-300 lg:translate-x-0", collapsed ? "w-20" : "w-64", mobileOpen ? "translate-x-0" : "-translate-x-full")}><div className={cn("flex items-center px-2", collapsed ? "justify-center" : "justify-between")}><Link href="/app" className="flex items-center gap-2.5 text-lg font-bold tracking-tight"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-sm text-white">H</span>{!collapsed ? <span>helpy</span> : null}</Link><button className="rounded-lg p-2 text-muted hover:bg-surface-muted lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation">×</button></div><button className={cn("absolute hidden size-7 items-center justify-center rounded-lg bg-surface-muted text-xs text-muted shadow-sm ring-1 ring-border transition hover:bg-accent-soft hover:text-accent lg:flex", collapsed ? "left-1/2 top-16 -translate-x-1/2" : "right-2 top-20")} onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? "→" : "←"}</button><div className="mt-10 flex-1"><p className={cn("px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted transition-opacity", collapsed && "invisible")}>{!collapsed ? "Workspace" : null}</p><nav className="mt-3 space-y-1">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} title={collapsed ? item.label : undefined} className={cn("flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", collapsed ? "justify-center" : "gap-3", pathname === item.href ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-muted hover:text-foreground")}><span className="grid size-5 place-items-center text-base">{item.icon}</span>{!collapsed ? <span>{item.label}</span> : null}</Link>)}<Link href="/app/billing" onClick={() => setMobileOpen(false)} title={collapsed ? "Billing" : undefined} className={cn("mt-7 flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", collapsed ? "justify-center" : "gap-3", pathname === "/app/billing" ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-muted hover:text-foreground")}><span className="grid size-5 place-items-center text-base">◇</span>{!collapsed ? <span>Billing</span> : null}</Link></nav></div><div className="border-t border-border pt-4"><div className={cn("mb-3 flex items-center px-2", collapsed ? "justify-center" : "gap-3")}><span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">{email[0]?.toUpperCase()}</span>{!collapsed ? <div className="min-w-0"><p className="truncate text-xs font-semibold">{email}</p><p className="text-[10px] text-muted">Free plan</p></div> : null}</div><button onClick={logout} title={collapsed ? "Sign out" : undefined} className={cn("rounded-xl py-2 text-sm font-medium text-muted hover:bg-surface-muted hover:text-foreground", collapsed ? "w-full text-center" : "w-full px-3 text-left")}>{collapsed ? "↪" : "Sign out"}</button></div></aside>{mobileOpen ? <button className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" /> : null}<main className={cn("min-h-screen transition-[padding] duration-300", collapsed ? "lg:pl-20" : "lg:pl-64")}>{children}</main></div>;
}
