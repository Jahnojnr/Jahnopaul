"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import { inputClass } from "@/components/admin/ui";
import { idleFormResult } from "@/lib/validation/common";
import { signInAction } from "@/server/actions/auth";

export function LoginForm() {
  const [state, formAction] = useActionState(signInAction, idleFormResult);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-xs uppercase tracking-[0.16em] text-muted">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="password" className="text-xs uppercase tracking-[0.16em] text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {state.status === "error" ? (
        <p role="alert" className="border border-accent/40 bg-paper px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <div>
        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
      </div>
    </form>
  );
}
