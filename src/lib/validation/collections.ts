import { z } from "zod";
import {
  formBoolean,
  formNumber,
  formString,
  linesToArray,
} from "@/lib/validation/common";
import {
  collections,
  type CollectionTable,
} from "@/lib/admin/collections";

const text = (max: number, label: string, required = false) => {
  const base = z.string().trim().max(max, `Keep ${label.toLowerCase()} under ${max} characters.`);
  return required ? base.min(1, `${label} is required.`) : base;
};

const orderSchema = z
  .number()
  .int("Use a whole number.")
  .min(0, "Ordering starts at 0.")
  .max(9999, "Keep the order below 10000.");

const optionalDate = z
  .string()
  .trim()
  .refine((value) => value.length === 0 || /^\d{4}-\d{2}-\d{2}$/.test(value), "Use a valid date.")
  .transform((value) => (value.length === 0 ? null : value));

export const collectionSchemas = {
  experiences: z.object({
    organization: text(160, "Organisation", true),
    role: text(160, "Role", true),
    description: text(2000, "Responsibilities"),
    start_date: optionalDate,
    end_date: optionalDate,
    is_current: z.boolean(),
    sort_order: orderSchema,
  }),
  services: z.object({
    title: text(160, "Title", true),
    summary: text(400, "Summary"),
    details: z.array(z.string().trim().min(1).max(200)).max(12),
    sort_order: orderSchema,
  }),
  education: z.object({
    institution: text(160, "Institution", true),
    credential: text(200, "Credential", true),
    period: text(80, "Period"),
    description: text(1500, "Description"),
    sort_order: orderSchema,
  }),
  achievements: z.object({
    title: text(160, "Title", true),
    year: text(20, "Year"),
    description: text(1500, "Description"),
    sort_order: orderSchema,
  }),
} satisfies Record<CollectionTable, z.ZodType>;

export function collectionValuesFromFormData(table: CollectionTable, formData: FormData) {
  const definition = collections[table];
  const raw: Record<string, unknown> = {};

  for (const field of definition.fields) {
    switch (field.type) {
      case "checkbox":
        raw[field.name] = formBoolean(formData, field.name);
        break;
      case "number":
        raw[field.name] = formNumber(formData, field.name);
        break;
      case "lines":
        raw[field.name] = linesToArray(formString(formData, field.name), 12);
        break;
      case "date":
      case "text":
      case "textarea":
      default:
        raw[field.name] = formString(formData, field.name);
        break;
    }
  }

  return collectionSchemas[table].parse(raw);
}
