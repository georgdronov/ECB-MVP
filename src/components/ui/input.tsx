import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-11 w-full rounded-xl bg-surface px-3.5 text-sm text-foreground ring-1 ring-border transition-all duration-200 ease-out placeholder:text-muted/70 hover:ring-accent/60 focus:ring-2 focus:ring-accent focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
