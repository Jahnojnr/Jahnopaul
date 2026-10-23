"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type ConfirmSubmitProps = {
  children: React.ReactNode;
  message: string;
  className?: string;
};

/** Submit button for destructive actions. The confirmation is a last check,
 *  not the protection: every action re-verifies the session on the server. */
export function ConfirmSubmit({ children, message, className }: ConfirmSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className={cn(
        "inline-flex min-h-8 items-center text-sm uppercase tracking-[0.08em] text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-accent hover:decoration-current disabled:opacity-60",
        className,
      )}
    >
      {pending ? "Working…" : children}
    </button>
  );
}
