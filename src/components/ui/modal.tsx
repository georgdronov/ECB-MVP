"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 cursor-default bg-foreground/30 backdrop-blur-sm" onClick={onClose} aria-label="Close modal" />
      <div className={cn("relative z-10 w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl ring-1 ring-border")}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="grid size-8 place-items-center rounded-full text-lg leading-none text-muted transition-all duration-200 ease-out hover:bg-surface-muted hover:text-foreground active:scale-95" onClick={onClose} aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
