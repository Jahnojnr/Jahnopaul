"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCollection } from "@/lib/admin/collections";
import { formString, type FormResult } from "@/lib/validation/common";
import { collectionValuesFromFormData } from "@/lib/validation/collections";
import {
  createCollectionRow,
  deleteCollectionRow,
  updateCollectionRow,
} from "@/server/collections";
import { failureResult, guardAction, withMessage } from "@/server/actions/helpers";

export async function saveCollectionAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const denied = await guardAction();
  if (denied) return denied;

  const definition = getCollection(formString(formData, "table"));

  if (!definition) {
    return { status: "error", message: "Unknown content type." };
  }

  let values: Record<string, unknown>;

  try {
    values = collectionValuesFromFormData(definition.table, formData) as Record<string, unknown>;
  } catch (error) {
    return failureResult(error);
  }

  // A current role cannot also carry an end date.
  if (definition.table === "experiences" && values.is_current === true) {
    values.end_date = null;
  }

  const id = formString(formData, "id");
  const result = id
    ? await updateCollectionRow(definition.table, id, values)
    : await createCollectionRow(definition.table, values);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  const savedId = "id" in result ? result.id : id;
  const basePath = `/admin/${definition.slug}`;

  revalidatePath(basePath);
  revalidatePath("/admin");

  redirect(withMessage(`${basePath}/${savedId}/edit`, "saved", id ? "Record updated." : "Record created."));
}

export async function deleteCollectionAction(formData: FormData) {
  const denied = await guardAction();
  const definition = getCollection(formString(formData, "table"));

  if (!definition) {
    redirect(withMessage("/admin", "error", "Unknown content type."));
  }

  const basePath = `/admin/${definition.slug}`;
  const id = formString(formData, "id");

  if (denied) redirect(withMessage(basePath, "error", denied.message ?? "Not authorised."));

  if (!id) {
    redirect(withMessage(basePath, "error", "The record was not found."));
  }

  const result = await deleteCollectionRow(definition.table, id);
  revalidatePath(basePath);

  if (!result.ok) {
    redirect(withMessage(basePath, "error", result.message));
  }

  redirect(withMessage(basePath, "saved", "Record deleted."));
}
