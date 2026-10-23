"use server";

import { redirect } from "next/navigation";
import { formString, type FormResult } from "@/lib/validation/common";
import { signInWithPassword, signOutAdmin, startPreviewSession } from "@/server/auth";

export async function signInAction(
  _previous: FormResult,
  formData: FormData,
): Promise<FormResult> {
  const email = formString(formData, "email").trim();
  const password = formString(formData, "password");

  if (!email || !password) {
    return { status: "error", message: "Enter your email address and password." };
  }

  const result = await signInWithPassword(email, password);

  if (!result.ok) {
    return { status: "error", message: result.message };
  }

  redirect("/admin");
}

export async function startPreviewAction() {
  const result = await startPreviewSession();

  if (!result.ok) {
    redirect("/admin/login?error=preview");
  }

  redirect("/admin");
}

export async function signOutAction() {
  await signOutAdmin();
  redirect("/admin/login");
}
