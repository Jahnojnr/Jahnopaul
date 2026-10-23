"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-h-10 items-center justify-center px-4 text-sm uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-accent text-paper hover:bg-accent-hover",
        variant === "secondary" &&
          "border border-charcoal/20 text-charcoal hover:border-accent hover:text-accent",
        variant === "danger" && "border border-accent/40 text-accent hover:bg-accent-soft",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
