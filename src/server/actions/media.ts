"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formString, type FormResult } from "@/lib/validation/common";
import { deleteMedia, listMedia, uploadMedia } from "@/server/media";
import type { MediaAssetRow } from "@/types/database";
import { guardAction, withMessage } from "@/server/actions/helpers";

export async function uploadMediaAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const denied = await guardAction();
  if (denied) return denied;

  const file = formData.get("file");
  const altText = formString(formData, "altText");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a file to upload." };
  }

  const result = await uploadMedia(file, altText);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  revalidatePath("/admin/media");
  redirect(withMessage("/admin/media", "saved", "File uploaded."));
}

export async function deleteMediaAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/media", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");
  const assets = await listMedia();
  const asset = assets.find((item): item is MediaAssetRow => item.id === id);

  if (!asset) {
    redirect(withMessage("/admin/media", "error", "The file was not found."));
  }

  const result = await deleteMedia(asset);
  revalidatePath("/admin/media");

  if (!result.ok) {
    redirect(withMessage("/admin/media", "error", result.message));
  }

  redirect(withMessage("/admin/media", "saved", "File deleted."));
}
