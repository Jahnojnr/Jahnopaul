"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, inputClass, textareaClass } from "@/components/admin/ui";
import { UnsavedGuard } from "@/components/admin/unsaved-guard";
import { idleFormResult } from "@/lib/validation/common";
import { saveProfileSettingsAction } from "@/server/actions/settings";

const formId = "settings-form";

export type SettingsFormValues = {
  fullName: string;
  headline: string;
  bio: string;
  longBio: string;
  location: string;
  avatarPath: string;
  resumePath: string;
  githubUrl: string;
  defaultDescription: string;
};

export function SettingsForm({ values }: { values: SettingsFormValues }) {
  const [state, formAction] = useActionState(saveProfileSettingsAction, idleFormResult);
  const errors = state.status === "error" ? state.errors : undefined;

  return (
    <form id={formId} action={formAction} className="grid gap-6">
      {state.status === "error" ? (
        <p role="alert" className="border border-accent/40 bg-white px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" error={errors?.fullName}>
          <input id="fullName" name="fullName" defaultValue={values.fullName} required className={inputClass} />
        </Field>

        <Field label="Headline" htmlFor="headline" error={errors?.headline}>
          <input id="headline" name="headline" defaultValue={values.headline} required className={inputClass} />
        </Field>
      </div>

      <Field label="Short bio" htmlFor="bio" hint="One or two sentences used in listings." error={errors?.bio}>
        <textarea id="bio" name="bio" defaultValue={values.bio} rows={3} className={textareaClass} />
      </Field>

      <Field
        label="Biography"
        htmlFor="longBio"
        hint="Plain text. Separate paragraphs with a blank line."
        error={errors?.longBio}
      >
        <textarea id="longBio" name="longBio" defaultValue={values.longBio} rows={9} className={textareaClass} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Location" htmlFor="location" error={errors?.location}>
          <input id="location" name="location" defaultValue={values.location} className={inputClass} />
        </Field>

        <Field label="GitHub URL" htmlFor="githubUrl" error={errors?.githubUrl}>
          <input id="githubUrl" name="githubUrl" type="url" defaultValue={values.githubUrl} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Avatar storage path"
          htmlFor="avatarPath"
          hint="Optional. Upload in Media, then paste the path."
          error={errors?.avatarPath}
        >
          <input id="avatarPath" name="avatarPath" defaultValue={values.avatarPath} className={inputClass} />
        </Field>

        <Field
          label="Résumé path"
          htmlFor="resumePath"
          hint="Optional. The PDF served from /resume."
          error={errors?.resumePath}
        >
          <input id="resumePath" name="resumePath" defaultValue={values.resumePath} className={inputClass} />
        </Field>
      </div>

      <Field
        label="Default SEO description"
        htmlFor="defaultDescription"
        hint="Used for search results where a page has no description of its own."
        error={errors?.defaultDescription}
      >
        <textarea
          id="defaultDescription"
          name="defaultDescription"
          defaultValue={values.defaultDescription}
          rows={3}
          maxLength={300}
          className={textareaClass}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <SubmitButton pendingLabel="Saving settings…">Save settings</SubmitButton>
        <UnsavedGuard formId={formId} message="These settings have unsaved changes." />
      </div>
    </form>
  );
}
