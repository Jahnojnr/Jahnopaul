"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import { inputClass } from "@/components/admin/ui";
import { idleFormResult } from "@/lib/validation/common";
import { uploadMediaAction } from "@/server/actions/media";

export function MediaUploadForm() {
  const [state, formAction] = useActionState(uploadMediaAction, idleFormResult);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="file" className="text-xs uppercase tracking-[0.16em] text-muted">
          File
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
          required
          className="text-sm text-charcoal file:mr-3 file:border file:border-charcoal/20 file:bg-white file:px-3 file:py-2 file:text-sm"
        />
        <p className="text-sm text-muted">JPEG, PNG, WebP, AVIF, or PDF. Up to 5 MB.</p>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="altText" className="text-xs uppercase tracking-[0.16em] text-muted">
          Alt text
        </label>
        <input
          id="altText"
          name="altText"
          required
          maxLength={300}
          placeholder="Describe what the image shows."
          className={inputClass}
        />
        <p className="text-sm text-muted">
          Required. It is read aloud by screen readers and shown if the image fails to load.
        </p>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <div>
        <SubmitButton pendingLabel="Uploading…">Upload file</SubmitButton>
      </div>
    </form>
  );
}
