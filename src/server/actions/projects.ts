"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formString, type FormResult } from "@/lib/validation/common";
import { projectInputFromFormData } from "@/lib/validation/content";
import type { ContentStatus } from "@/types/content";
import {
  createProject,
  deleteProject,
  setProjectFeatured,
  setProjectStatus,
  updateProject,
} from "@/server/projects";
import { failureResult, guardAction, withMessage } from "@/server/actions/helpers";

export async function saveProjectAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const denied = await guardAction();
  if (denied) return denied;

  let input;
  try {
    input = projectInputFromFormData(formData);
  } catch (error) {
    return failureResult(error);
  }

  const id = formString(formData, "id");
  const result = id ? await updateProject(id, input) : await createProject(input);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  redirect(withMessage(`/admin/projects/${result.id}/edit`, "saved", id ? "Project updated." : "Project created."));
}

export async function setProjectStatusAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/projects", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");
  const status = formString(formData, "status") as ContentStatus;

  if (!id || !["draft", "published", "archived"].includes(status)) {
    redirect(withMessage("/admin/projects", "error", "The project status was not valid."));
  }

  const result = await setProjectStatus(id, status);

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  if (!result.ok) {
    redirect(withMessage("/admin/projects", "error", result.message));
  }

  redirect(withMessage("/admin/projects", "saved", `Project marked ${status}.`));
}

export async function setProjectFeaturedAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/projects", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");
  const featured = formString(formData, "featured") === "true";

  if (!id) {
    redirect(withMessage("/admin/projects", "error", "The project was not found."));
  }

  const result = await setProjectFeatured(id, featured);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  if (!result.ok) {
    redirect(withMessage("/admin/projects", "error", result.message));
  }

  redirect(
    withMessage(
      "/admin/projects",
      "saved",
      featured ? "Project added to selected work." : "Project removed from selected work.",
    ),
  );
}

export async function deleteProjectAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/projects", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");

  if (!id) {
    redirect(withMessage("/admin/projects", "error", "The project was not found."));
  }

  const result = await deleteProject(id);

  revalidatePath("/admin/projects");
  revalidatePath("/projects");

  if (!result.ok) {
    redirect(withMessage("/admin/projects", "error", result.message));
  }

  redirect(withMessage("/admin/projects", "saved", "Project deleted."));
}
