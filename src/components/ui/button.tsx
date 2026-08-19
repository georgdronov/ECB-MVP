import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-sm hover:bg-accent-hover hover:shadow-md",
  secondary: "bg-surface text-foreground shadow-sm ring-1 ring-border hover:bg-surface-muted hover:shadow-md",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground hover:shadow-sm",
  danger: "bg-danger text-white shadow-sm hover:bg-red-600 hover:shadow-md",
};

export function Button({
  className,
  variant = "primary",
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-label="Loading" />
      ) : null}
      {children}
    </button>
  );
}
