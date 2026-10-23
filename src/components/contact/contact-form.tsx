"use client";

import { useId, useState } from "react";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; errors?: Record<string, string> };

const fieldClass =
  "mt-2 min-h-11 w-full border border-line bg-paper px-3 focus:border-accent focus:outline-none";

export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState(initialValues);
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (state.status === "error") {
      setState({ status: "idle" });
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !result.ok) {
        setState({
          status: "error",
          message: result.message ?? "The message could not be sent.",
          errors: result.errors,
        });
        return;
      }

      setValues(initialValues);
      setState({
        status: "success",
        message: result.message ?? "Thank you — your message has been received.",
      });
    } catch {
      setState({
        status: "error",
        message: "The network request failed. Please check your connection and try again.",
      });
    }
  }

  const errors = state.status === "error" ? state.errors : undefined;

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      {state.status === "success" ? (
        <p
          role="status"
          className="border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent"
        >
          {state.message}
        </p>
      ) : null}

      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">Name</span>
          <input
            name="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            aria-invalid={Boolean(errors?.name)}
            className={fieldClass}
          />
          {errors?.name ? <span className="mt-1 block text-sm text-accent">{errors.name}</span> : null}
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.16em] text-muted">Email</span>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            required
            maxLength={200}
            aria-invalid={Boolean(errors?.email)}
            className={fieldClass}
          />
          {errors?.email ? <span className="mt-1 block text-sm text-accent">{errors.email}</span> : null}
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">Subject</span>
        <input
          name="subject"
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          required
          minLength={3}
          maxLength={160}
          aria-invalid={Boolean(errors?.subject)}
          className={fieldClass}
        />
        {errors?.subject ? <span className="mt-1 block text-sm text-accent">{errors.subject}</span> : null}
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">Message</span>
        <textarea
          name="message"
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          required
          minLength={20}
          maxLength={4000}
          rows={8}
          aria-describedby={`${formId}-message-help`}
          aria-invalid={Boolean(errors?.message)}
          className="mt-2 w-full border border-line bg-paper px-3 py-3 focus:border-accent focus:outline-none"
        />
        <span id={`${formId}-message-help`} className="mt-1 block text-sm text-muted">
          Between 20 and 4000 characters.
        </span>
        {errors?.message ? <span className="mt-1 block text-sm text-accent">{errors.message}</span> : null}
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="inline-flex min-h-11 items-center bg-accent px-5 text-sm uppercase tracking-[0.08em] text-paper transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {state.status === "submitting" ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-muted">
          Your message is stored so it can be answered. Nothing is added to a mailing list.
        </p>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="border border-accent/30 bg-paper px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
