"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formString, type FormResult } from "@/lib/validation/common";
import { profileSettingsSchema } from "@/lib/validation/settings";
import { updateProfileSettings } from "@/server/settings";
import { failureResult, guardAction, withMessage } from "@/server/actions/helpers";

export async function saveProfileSettingsAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const denied = await guardAction();
  if (denied) return denied;

  let values;
  try {
    values = profileSettingsSchema.parse({
      fullName: formString(formData, "fullName"),
      headline: formString(formData, "headline"),
      bio: formString(formData, "bio"),
      longBio: formString(formData, "longBio"),
      location: formString(formData, "location"),
      avatarPath: formString(formData, "avatarPath"),
      resumePath: formString(formData, "resumePath"),
      githubUrl: formString(formData, "githubUrl"),
      defaultDescription: formString(formData, "defaultDescription"),
    });
  } catch (error) {
    return failureResult(error);
  }

  const result = await updateProfileSettings(values);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/about");
  revalidatePath("/");

  redirect(withMessage("/admin/settings", "saved", "Site profile saved."));
}
