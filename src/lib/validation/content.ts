import { z } from "zod";
import {
  formArray,
  formBoolean,
  formNumber,
  formString,
  linesToArray,
  normaliseParagraphs,
  optionalTextSchema,
  optionalUrlSchema,
  requiredTextSchema,
  slugSchema,
} from "@/lib/validation/common";

const contentStatusSchema = z.enum(["draft", "published", "archived"]);

export const projectSchema = z.object({
  title: requiredTextSchema(140, "A title"),
  slug: slugSchema,
  summary: z.string().trim().max(400, "Keep the summary under 400 characters."),
  problem: z.string().trim().max(2000, "Keep the problem under 2000 characters."),
  solution: z.string().trim().max(2000, "Keep the solution under 2000 characters."),
  role: z.string().trim().max(160, "Keep the role under 160 characters."),
  content: z.string().max(20000, "Keep the case study under 20000 characters."),
  outcomes: z.array(z.string().trim().min(1).max(300)).max(12),
  coverLabel: z.string().trim().max(60, "Keep the cover label under 60 characters."),
  coverImagePath: optionalTextSchema(300),
  liveUrl: optionalUrlSchema,
  repositoryUrl: optionalUrlSchema,
  status: contentStatusSchema,
  featured: z.boolean(),
  sortOrder: z
    .number()
    .int("Use a whole number.")
    .min(0, "Ordering starts at 0.")
    .max(9999, "Keep the order below 10000."),
  categoryIds: z.array(z.uuid()).max(12),
  technologyIds: z.array(z.uuid()).max(24),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export function projectInputFromFormData(formData: FormData): ProjectInput {
  return projectSchema.parse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    summary: formString(formData, "summary"),
    problem: formString(formData, "problem"),
    solution: formString(formData, "solution"),
    role: formString(formData, "role"),
    content: normaliseParagraphs(formString(formData, "content"), 20000),
    outcomes: linesToArray(formString(formData, "outcomes"), 12),
    coverLabel: formString(formData, "coverLabel"),
    coverImagePath: formString(formData, "coverImagePath"),
    liveUrl: formString(formData, "liveUrl"),
    repositoryUrl: formString(formData, "repositoryUrl"),
    status: formString(formData, "status"),
    featured: formBoolean(formData, "featured"),
    sortOrder: formNumber(formData, "sortOrder"),
    categoryIds: formArray(formData, "categoryIds"),
    technologyIds: formArray(formData, "technologyIds"),
  });
}

export const postSchema = z.object({
  title: requiredTextSchema(160, "A title"),
  slug: slugSchema,
  excerpt: z.string().trim().max(400, "Keep the excerpt under 400 characters."),
  body: z
    .string()
    .trim()
    .min(1, "Write the article body.")
    .max(40000, "Keep the article under 40000 characters."),
  coverImagePath: optionalTextSchema(300),
  status: contentStatusSchema,
  featured: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;

export function postInputFromFormData(formData: FormData): PostInput {
  return postSchema.parse({
    title: formString(formData, "title"),
    slug: formString(formData, "slug"),
    excerpt: formString(formData, "excerpt"),
    body: normaliseParagraphs(formString(formData, "body"), 40000),
    coverImagePath: formString(formData, "coverImagePath"),
    status: formString(formData, "status"),
    featured: formBoolean(formData, "featured"),
  });
}
