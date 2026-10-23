"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { formString } from "@/lib/validation/common";
import type { InquiryStatus } from "@/types/database";
import { deleteInquiry, updateInquiryStatus } from "@/server/inquiries";
import { guardAction, withMessage } from "@/server/actions/helpers";

const statuses: InquiryStatus[] = ["new", "read", "replied", "archived"];

export async function updateInquiryStatusAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/inquiries", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");
  const status = formString(formData, "status") as InquiryStatus;

  if (!id || !statuses.includes(status)) {
    redirect(withMessage("/admin/inquiries", "error", "The inquiry update was not valid."));
  }

  const result = await updateInquiryStatus(id, status);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");

  if (!result.ok) {
    redirect(withMessage("/admin/inquiries", "error", result.message));
  }

  redirect(withMessage("/admin/inquiries", "saved", `Inquiry marked ${status}.`));
}

export async function deleteInquiryAction(formData: FormData) {
  const denied = await guardAction();
  if (denied) redirect(withMessage("/admin/inquiries", "error", denied.message ?? "Not authorised."));

  const id = formString(formData, "id");

  if (!id) {
    redirect(withMessage("/admin/inquiries", "error", "The inquiry was not found."));
  }

  const result = await deleteInquiry(id);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");

  if (!result.ok) {
    redirect(withMessage("/admin/inquiries", "error", result.message));
  }

  redirect(withMessage("/admin/inquiries", "saved", "Inquiry deleted."));
}
