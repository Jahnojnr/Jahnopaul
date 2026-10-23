"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { formNumber, formString, linesToArray, type FormResult } from "@/lib/validation/common";
import { deleteSkillGroup, saveSkillGroup } from "@/server/collections";
import { failureResult, guardAction, withMessage } from "@/server/actions/helpers";

const skillGroupSchema = z.object({
  name: z.string().trim().min(1, "A group name is required.").max(80),
  sortOrder: z.number().int().min(0).max(999),
  skills: z.array(z.string().trim().min(1).max(80)).max(30),
});

export async function saveSkillGroupAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const denied = await guardAction();
  if (denied) return denied;

  let values;
  try {
    values = skillGroupSchema.parse({
      name: formString(formData, "name"),
      sortOrder: formNumber(formData, "sortOrder"),
      skills: linesToArray(formString(formData, "skills"), 30),
    });
  } catch (error) {
    return failureResult(error);
  }

  const id = formString(formData, "id");
  const result = await saveSkillGroup({ ...values, id: id || undefined });

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  revalidatePath("/admin/skills");
  redirect(withMessage("/admin/skills", "saved", id ? "Skill group updated." : "Skill group created."));
}

export async function deleteSkillGroupAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/skills", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");

  if (!id) {
    redirect(withMessage("/admin/skills", "error", "The skill group was not found."));
  }

  const result = await deleteSkillGroup(id);
  revalidatePath("/admin/skills");

  if (!result.ok) {
    redirect(withMessage("/admin/skills", "error", result.message));
  }

  redirect(withMessage("/admin/skills", "saved", "Skill group deleted."));
}
