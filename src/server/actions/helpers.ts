import "server-only";

import { ZodError } from "zod";
import type { FormResult } from "@/lib/validation/common";
import { fieldErrors } from "@/lib/validation/common";
import { requireAdminForAction } from "@/server/auth";

/**
 * Every Server Action starts here. The guard runs on the server for each call,
 * so a stale tab or a hand-crafted request cannot mutate content.
 */
export async function guardAction(): Promise<FormResult | null> {
  try {
    await requireAdminForAction();
    return null;
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "You are not authorised to perform this action.",
    };
  }
}

export function failureResult(error: unknown): FormResult {
  if (error instanceof ZodError) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      errors: fieldErrors(error),
    };
  }

  return {
    status: "error",
    message:
      error instanceof Error ? error.message : "Something went wrong. Please try again.",
  };
}

/** Redirect with a human-readable message in the query string. */
export function withMessage(path: string, key: "saved" | "error", message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(message)}`;
}
