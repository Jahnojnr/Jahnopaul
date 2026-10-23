"use client";

import { useActionState } from "react";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { SubmitButton } from "@/components/admin/submit-button";
import { Field, inputClass, textareaClass } from "@/components/admin/ui";
import { idleFormResult } from "@/lib/validation/common";
import {
  deleteSkillGroupAction,
  saveSkillGroupAction,
} from "@/server/actions/skills";

type SkillGroupEditorProps = {
  group?: {
    id: string;
    name: string;
    sort_order: number;
    skills: string[];
  };
};

export function SkillGroupEditor({ group }: SkillGroupEditorProps) {
  const [state, formAction] = useActionState(saveSkillGroupAction, idleFormResult);
  const prefix = group?.id ?? "new";
  const errors = state.status === "error" ? state.errors : undefined;

  return (
    <div className="grid gap-3">
      <form action={formAction} className="grid gap-4 md:grid-cols-[1fr_7rem_2fr_auto] md:items-start">
        <input type="hidden" name="id" value={group?.id ?? ""} />

        <Field label="Group" htmlFor={`${prefix}-name`} error={errors?.name}>
          <input
            id={`${prefix}-name`}
            name="name"
            defaultValue={group?.name ?? ""}
            required
            maxLength={80}
            className={inputClass}
          />
        </Field>

        <Field label="Order" htmlFor={`${prefix}-order`} error={errors?.sortOrder}>
          <input
            id={`${prefix}-order`}
            name="sortOrder"
            type="number"
            min={0}
            max={999}
            defaultValue={group?.sort_order ?? 0}
            className={inputClass}
          />
        </Field>

        <Field
          label="Skills"
          htmlFor={`${prefix}-skills`}
          hint="One skill per line."
          error={errors?.skills}
        >
          <textarea
            id={`${prefix}-skills`}
            name="skills"
            rows={4}
            defaultValue={(group?.skills ?? []).join("\n")}
            className={textareaClass}
          />
        </Field>

        <div className="flex items-center gap-3 pt-6">
          <SubmitButton variant="secondary" pendingLabel="Saving…">
            {group ? "Save" : "Add group"}
          </SubmitButton>
        </div>
      </form>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      ) : null}

      {group ? (
        <form action={deleteSkillGroupAction}>
          <input type="hidden" name="id" value={group.id} />
          <ConfirmSubmit
            message={`Delete the “${group.name}” skill group and its skills?`}
          >
            Delete group
          </ConfirmSubmit>
        </form>
      ) : null}
    </div>
  );
}
