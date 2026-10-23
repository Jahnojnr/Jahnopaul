"use client";

import Link from "next/link";
import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, inputClass, textareaClass } from "@/components/admin/ui";
import { UnsavedGuard } from "@/components/admin/unsaved-guard";
import type { CollectionDefinition } from "@/lib/admin/collections";
import { idleFormResult } from "@/lib/validation/common";
import { saveCollectionAction } from "@/server/actions/collections";
import type { CollectionRow } from "@/server/collections";

const formId = "collection-form";

export function CollectionForm({
  definition,
  row,
}: {
  definition: CollectionDefinition;
  row?: CollectionRow | null;
}) {
  const [state, formAction] = useActionState(saveCollectionAction, idleFormResult);
  const errors = state.status === "error" ? state.errors : undefined;
  const record = (row ?? {}) as unknown as Record<string, unknown>;
  const basePath = `/admin/${definition.slug}`;

  return (
    <form id={formId} action={formAction} className="grid gap-5">
      <input type="hidden" name="table" value={definition.table} />
      <input type="hidden" name="id" value={row?.id ?? ""} />

      {state.status === "error" ? (
        <p role="alert" className="border border-accent/40 bg-white px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      {definition.fields.map((field) => {
        const value = record[field.name];
        const id = `${definition.table}-${field.name}`;
        const error = errors?.[field.name];

        if (field.type === "checkbox") {
          return (
            <label key={field.name} className="flex items-center gap-3 text-sm text-charcoal">
              <input
                id={id}
                type="checkbox"
                name={field.name}
                defaultChecked={Boolean(value)}
                className="size-4 accent-[var(--accent)]"
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "textarea" || field.type === "lines") {
          const defaultValue =
            field.type === "lines"
              ? Array.isArray(value)
                ? value.join("\n")
                : ""
              : typeof value === "string"
                ? value
                : "";

          return (
            <Field key={field.name} label={field.label} htmlFor={id} hint={field.hint} error={error}>
              <textarea
                id={id}
                name={field.name}
                defaultValue={defaultValue}
                rows={field.rows ?? 4}
                maxLength={field.maxLength}
                className={textareaClass}
              />
            </Field>
          );
        }

        return (
          <Field key={field.name} label={field.label} htmlFor={id} hint={field.hint} error={error}>
            <input
              id={id}
              name={field.name}
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
              defaultValue={
                field.type === "number"
                  ? String(typeof value === "number" ? value : 0)
                  : typeof value === "string"
                    ? field.type === "date"
                      ? value.slice(0, 10)
                      : value
                    : ""
              }
              maxLength={field.maxLength}
              min={field.type === "number" ? 0 : undefined}
              max={field.type === "number" ? 9999 : undefined}
              required={field.required}
              className={inputClass}
            />
          </Field>
        );
      })}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <SubmitButton pendingLabel="Saving…">
          {row ? "Save changes" : `Create ${definition.singular}`}
        </SubmitButton>
        <Link href={basePath} className="text-sm text-muted hover:text-accent">
          Cancel
        </Link>
        <UnsavedGuard formId={formId} message="This record has unsaved changes." />
      </div>
    </form>
  );
}
