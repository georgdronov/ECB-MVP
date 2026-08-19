"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

type ToastProps = { message: string; onClose: () => void; tone?: "default" | "danger" };

export function Toast({ message, onClose, tone = "default" }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={cn("fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl", tone === "danger" ? "bg-danger" : "bg-foreground")} role="status">
      {message}
    </div>
  );
}
