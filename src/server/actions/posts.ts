"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formString, type FormResult } from "@/lib/validation/common";
import { postInputFromFormData } from "@/lib/validation/content";
import type { ContentStatus } from "@/types/content";
import {
  createPost,
  deletePost,
  setPostStatus,
  updatePost,
} from "@/server/posts";
import { failureResult, guardAction, withMessage } from "@/server/actions/helpers";

export async function savePostAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const denied = await guardAction();
  if (denied) return denied;

  let input;
  try {
    input = postInputFromFormData(formData);
  } catch (error) {
    return failureResult(error);
  }

  const id = formString(formData, "id");
  const result = id ? await updatePost(id, input) : await createPost(input);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/writing");
  revalidatePath("/writing");

  redirect(
    withMessage(`/admin/writing/${result.id}/edit`, "saved", id ? "Article updated." : "Article created."),
  );
}

export async function setPostStatusAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/writing", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");
  const status = formString(formData, "status") as ContentStatus;

  if (!id || !["draft", "published", "archived"].includes(status)) {
    redirect(withMessage("/admin/writing", "error", "The article status was not valid."));
  }

  const result = await setPostStatus(id, status);

  revalidatePath("/admin/writing");
  revalidatePath("/writing");

  if (!result.ok) {
    redirect(withMessage("/admin/writing", "error", result.message));
  }

  redirect(withMessage("/admin/writing", "saved", `Article marked ${status}.`));
}

export async function deletePostAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/writing", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");

  if (!id) {
    redirect(withMessage("/admin/writing", "error", "The article was not found."));
  }

  const result = await deletePost(id);

  revalidatePath("/admin/writing");
  revalidatePath("/writing");

  if (!result.ok) {
    redirect(withMessage("/admin/writing", "error", result.message));
  }

  redirect(withMessage("/admin/writing", "saved", "Article deleted."));
}
