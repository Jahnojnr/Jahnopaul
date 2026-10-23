"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, inputClass, textareaClass } from "@/components/admin/ui";
import { UnsavedGuard } from "@/components/admin/unsaved-guard";
import { idleFormResult } from "@/lib/validation/common";
import { slugify } from "@/lib/validation/common";
import { saveProjectAction } from "@/server/actions/projects";
import type { CategoryRow, ProjectRow, TechnologyRow } from "@/types/database";

type ProjectFormProps = {
  project?: ProjectRow | null;
  categories: CategoryRow[];
  technologies: TechnologyRow[];
  selectedCategoryIds: string[];
  selectedTechnologyIds: string[];
};

const formId = "project-form";

export function ProjectForm({
  project,
  categories,
  technologies,
  selectedCategoryIds,
  selectedTechnologyIds,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(saveProjectAction, idleFormResult);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  const errors = state.status === "error" ? state.errors : undefined;

  return (
    <form id={formId} action={formAction} className="grid gap-7">
      <input type="hidden" name="id" value={project?.id ?? ""} />

      {state.status === "error" ? (
        <p role="alert" className="border border-accent/40 bg-white px-4 py-3 text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
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
            maxLength={140}
            className={inputClass}
          />
        </Field>

        <Field
          label="URL slug"
          htmlFor="slug"
          hint="Lowercase letters, numbers, and hyphens. Saved as /projects/<slug>."
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
      </div>

      <Field label="Summary" htmlFor="summary" error={errors?.summary}>
        <textarea
          id="summary"
          name="summary"
          defaultValue={project?.summary ?? ""}
          rows={3}
          maxLength={400}
          className={textareaClass}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Problem" htmlFor="problem" error={errors?.problem}>
          <textarea
            id="problem"
            name="problem"
            defaultValue={project?.problem ?? ""}
            rows={4}
            maxLength={2000}
            className={textareaClass}
          />
        </Field>

        <Field label="Solution" htmlFor="solution" error={errors?.solution}>
          <textarea
            id="solution"
            name="solution"
            defaultValue={project?.solution ?? ""}
            rows={4}
            maxLength={2000}
            className={textareaClass}
          />
        </Field>
      </div>

      <Field label="Role" htmlFor="role" error={errors?.role}>
        <input
          id="role"
          name="role"
          defaultValue={project?.role ?? ""}
          maxLength={160}
          className={inputClass}
        />
      </Field>

      <Field
        label="Case study"
        htmlFor="content"
        hint="Plain text. Separate paragraphs with a blank line."
        error={errors?.content}
      >
        <textarea
          id="content"
          name="content"
          defaultValue={project?.content ?? ""}
          rows={14}
          className={textareaClass}
        />
      </Field>

      <Field
        label="Outcomes"
        htmlFor="outcomes"
        hint="One outcome per line. Describe only what can be evidenced."
        error={errors?.outcomes}
      >
        <textarea
          id="outcomes"
          name="outcomes"
          defaultValue={(project?.outcomes ?? []).join("\n")}
          rows={5}
          className={textareaClass}
        />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Cover label" htmlFor="coverLabel" hint="Short caption used on the cover plate." error={errors?.coverLabel}>
          <input
            id="coverLabel"
            name="coverLabel"
            defaultValue={project?.cover_label ?? ""}
            maxLength={60}
            className={inputClass}
          />
        </Field>

        <Field
          label="Cover image path"
          htmlFor="coverImagePath"
          hint="Optional. Upload in Media, then paste the storage path."
          error={errors?.coverImagePath}
        >
          <input
            id="coverImagePath"
            name="coverImagePath"
            defaultValue={project?.cover_image_path ?? ""}
            maxLength={300}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Live URL" htmlFor="liveUrl" error={errors?.liveUrl}>
          <input
            id="liveUrl"
            name="liveUrl"
            type="url"
            defaultValue={project?.live_url ?? ""}
            placeholder="https://"
            className={inputClass}
          />
        </Field>

        <Field label="Repository URL" htmlFor="repositoryUrl" error={errors?.repositoryUrl}>
          <input
            id="repositoryUrl"
            name="repositoryUrl"
            type="url"
            defaultValue={project?.repository_url ?? ""}
            placeholder="https://"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Status" htmlFor="status" error={errors?.status}>
          <select
            id="status"
            name="status"
            defaultValue={project?.status ?? "draft"}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>

        <Field label="Order" htmlFor="sortOrder" hint="Lower numbers appear first." error={errors?.sortOrder}>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            max={9999}
            defaultValue={project?.sort_order ?? 0}
            className={inputClass}
          />
        </Field>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-3 text-sm text-charcoal">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project?.featured ?? false}
              className="size-4 accent-[var(--accent)]"
            />
            Show in selected work
          </label>
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-xs uppercase tracking-[0.16em] text-muted">Categories</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                name="categoryIds"
                value={category.id}
                defaultChecked={selectedCategoryIds.includes(category.id)}
                className="size-4 accent-[var(--accent)]"
              />
              {category.name}
            </label>
          ))}
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-muted">No categories exist yet. Add them in the database or seed file.</p>
        ) : null}
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="text-xs uppercase tracking-[0.16em] text-muted">Technologies</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {technologies.map((technology) => (
            <label key={technology.id} className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                name="technologyIds"
                value={technology.id}
                defaultChecked={selectedTechnologyIds.includes(technology.id)}
                className="size-4 accent-[var(--accent)]"
              />
              {technology.name}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <SubmitButton pendingLabel="Saving project…">
          {project ? "Save project" : "Create project"}
        </SubmitButton>
        <Link href="/admin/projects" className="text-sm text-muted hover:text-accent">
          Cancel
        </Link>
        {project?.status === "published" ? (
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm text-accent hover:text-accent-hover"
          >
            View public page ↗
          </Link>
        ) : null}
        <UnsavedGuard formId={formId} message="This project has unsaved changes." />
      </div>
    </form>
  );
}
