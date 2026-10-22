"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  company: "",
};

export function ContactForm() {
  const [values, setValues] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopied(false);

    if (values.company.trim().length > 0) {
      setError("Unable to send this submission.");
      return;
    }

    if (
      values.name.trim().length < 2 ||
      !values.email.includes("@") ||
      values.subject.trim().length < 3 ||
      values.message.trim().length < 20
    ) {
      setError(
        "Please include your name, a valid email, a subject, and a message of at least 20 characters.",
      );
      return;
    }

    const composed = [
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Subject: ${values.subject.trim()}`,
      "",
      values.message.trim(),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(composed);
      setError(null);
      setCopied(true);
    } catch {
      setError("Copying was blocked by the browser. Select and copy the composed message below.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <p className="text-sm text-muted">
        Email delivery will be connected in a later phase. This form validates
        your message and copies a composed note you can send directly.
      </p>
      <label className="sr-only" htmlFor="company">
        Company
      </label>
      <input
        id="company"
        name="company"
        value={values.company}
        onChange={(event) => update("company", event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">Name</span>
        <input
          name="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          required
          className="mt-2 min-h-11 w-full border border-line bg-paper px-3"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">Email</span>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          required
          className="mt-2 min-h-11 w-full border border-line bg-paper px-3"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-muted">Subject</span>
        <input
          name="subject"
          value={values.subject}
          onChange={(event) => update("subject", event.target.value)}
          required
          className="mt-2 min-h-11 w-full border border-line bg-paper px-3"
        />
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
          className="mt-2 w-full border border-line bg-paper px-3 py-3"
        />
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 w-fit items-center bg-accent px-5 text-sm uppercase tracking-[0.08em] text-paper hover:bg-accent-hover"
      >
        Compose and copy message
      </button>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      {copied ? (
        <p className="text-sm text-accent">
          Message copied. Paste it into your email client until server-side
          delivery is enabled.
        </p>
      ) : null}
    </form>
  );
}
