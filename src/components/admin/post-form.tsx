"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, inputClass, textareaClass } from "@/components/admin/ui";
import { UnsavedGuard } from "@/components/admin/unsaved-guard";
import { idleFormResult, slugify } from "@/lib/validation/common";
import { savePostAction } from "@/server/actions/posts";
import type { PostRow } from "@/types/database";

const formId = "post-form";

export function PostForm({ post }: { post?: PostRow | null }) {
  const [state, formAction] = useActionState(savePostAction, idleFormResult);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));

  const errors = state.status === "error" ? state.errors : undefined;

  return (
    <form id={formId} action={formAction} className="grid gap-6">
      <input type="hidden" name="id" value={post?.id ?? ""} />

      {state.status === "error" ? (
        <p role="alert" className="border border-accent/40 bg-white px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <Field label="Title" htmlFor="title" error={errors?.title}>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          required
          maxLength={160}
          className={inputClass}
        />
      </Field>

      <Field
        label="URL slug"
        htmlFor="slug"
        hint="Saved as /writing/<slug>."
        error={errors?.slug}
      >
        <div className="flex gap-2">
          <input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setSlugTouched(true);
            }}
            required
            maxLength={80}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => {
              setSlug(slugify(title));
              setSlugTouched(false);
            }}
            className="shrink-0 border border-charcoal/20 px-3 text-sm text-charcoal hover:border-accent hover:text-accent"
          >
            From title
          </button>
        </div>
      </Field>

      <Field label="Excerpt" htmlFor="excerpt" hint="Shown in listings and search results." error={errors?.excerpt}>
        <textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={3}
          maxLength={400}
          className={textareaClass}
        />
      </Field>

      <Field
        label="Article body"
        htmlFor="body"
        hint="Plain text. Separate paragraphs with a blank line."
        error={errors?.body}
      >
        <textarea
          id="body"
          name="body"
          defaultValue={post?.body ?? ""}
          rows={18}
          required
          className={textareaClass}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Cover image path" htmlFor="coverImagePath" hint="Optional storage path." error={errors?.coverImagePath}>
          <input
            id="coverImagePath"
            name="coverImagePath"
            defaultValue={post?.cover_image_path ?? ""}
            maxLength={300}
            className={inputClass}
          />
        </Field>

        <Field label="Status" htmlFor="status" error={errors?.status}>
          <select id="status" name="status" defaultValue={post?.status ?? "draft"} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={post?.featured ?? false}
              className="size-4 accent-[var(--accent)]"
            />
            Feature this article
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <SubmitButton pendingLabel="Saving article…">
          {post ? "Save article" : "Create article"}
        </SubmitButton>
        <Link href="/admin/writing" className="text-sm text-muted hover:text-accent">
          Cancel
        </Link>
        {post?.status === "published" ? (
          <Link href={`/writing/${post.slug}`} className="text-sm text-accent hover:text-accent-hover">
            View public page ↗
          </Link>
        ) : null}
        <UnsavedGuard formId={formId} message="This article has unsaved changes." />
      </div>
    </form>
  );
}
