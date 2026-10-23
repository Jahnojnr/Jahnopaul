import { z } from "zod";

/** Shared primitives for server-side validation. */

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .trim()
  .min(1, "A URL slug is required.")
  .max(80, "Keep the slug under 80 characters.")
  .regex(
    slugPattern,
    "Use lowercase letters, numbers, and single hyphens only (for example: curriculum-studio).",
  );

/** Turn arbitrary text into a candidate slug. Uniqueness is checked in the database. */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['"“”‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Optional URLs arrive from a form as empty strings. An empty string means
 * "not provided", which is stored as NULL rather than as a broken link.
 */
export const optionalUrlSchema = z
  .union([z.literal(""), z.url("Enter a full URL, including https://.")])
  .transform((value) => (value.length === 0 ? null : value));

export const optionalTextSchema = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .transform((value) => (value.length === 0 ? null : value));

export const requiredTextSchema = (max: number, label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `Keep ${label.toLowerCase()} under ${max} characters.`);

/** Split a textarea where each non-empty line becomes one list item. */
export function linesToArray(value: string, limit = 20) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .slice(0, limit);
}

/** Normalise plain-text paragraphs separated by blank lines. */
export function normaliseParagraphs(value: string, limit = 40000) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, limit);
}

export function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function formString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function formBoolean(formData: FormData, name: string) {
  return formData.get(name) === "on" || formData.get(name) === "true";
}

export function formNumber(formData: FormData, name: string) {
  const value = formString(formData, name).trim();
  return value.length === 0 ? 0 : Number(value);
}

export function formArray(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string");
}

/** Zod issues keyed by field name, ready for the admin forms. */
export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}

export type FormResult = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
};

export const idleFormResult: FormResult = { status: "idle" };
