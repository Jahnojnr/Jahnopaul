/**
 * Definitions for the small content collections the dashboard edits.
 * Shared by the forms (client) and the Server Actions (server), so it contains
 * no server-only imports.
 */

export type CollectionFieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "checkbox"
  | "lines";

export type CollectionField = {
  name: string;
  label: string;
  type: CollectionFieldType;
  required?: boolean;
  hint?: string;
  rows?: number;
  maxLength?: number;
};

export type CollectionTable =
  | "experiences"
  | "services"
  | "education"
  | "achievements";

export type CollectionDefinition = {
  table: CollectionTable;
  slug: string;
  title: string;
  singular: string;
  description: string;
  titleField: string;
  fields: CollectionField[];
};

export const collections: Record<CollectionTable, CollectionDefinition> = {
  experiences: {
    table: "experiences",
    slug: "experience",
    title: "Experience",
    singular: "role",
    description: "Employment, freelance work, leadership, and teaching roles.",
    titleField: "organization",
    fields: [
      { name: "organization", label: "Organisation", type: "text", required: true, maxLength: 160 },
      { name: "role", label: "Role", type: "text", required: true, maxLength: 160 },
      { name: "description", label: "Responsibilities", type: "textarea", rows: 5, maxLength: 2000 },
      { name: "start_date", label: "Start date", type: "date", required: true },
      { name: "end_date", label: "End date", type: "date", hint: "Leave empty for a current role." },
      { name: "is_current", label: "This is a current role", type: "checkbox" },
      { name: "sort_order", label: "Order", type: "number", hint: "Lower numbers appear first." },
    ],
  },
  services: {
    table: "services",
    slug: "services",
    title: "Services",
    singular: "service",
    description: "Capabilities and engagement options described on the public site.",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 160 },
      { name: "summary", label: "Summary", type: "textarea", rows: 3, maxLength: 400 },
      { name: "details", label: "Details", type: "lines", rows: 5, hint: "One item per line." },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  education: {
    table: "education",
    slug: "education",
    title: "Education",
    singular: "record",
    description: "Education, training, and professional programmes.",
    titleField: "institution",
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true, maxLength: 160 },
      { name: "credential", label: "Credential", type: "text", required: true, maxLength: 200 },
      { name: "period", label: "Period", type: "text", maxLength: 80, hint: "For example: 2018 — 2021, or Ongoing." },
      { name: "description", label: "Description", type: "textarea", rows: 4, maxLength: 1500 },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
  achievements: {
    table: "achievements",
    slug: "achievements",
    title: "Achievements",
    singular: "achievement",
    description: "Awards, milestones, and notable contributions.",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 160 },
      { name: "year", label: "Year", type: "text", maxLength: 20 },
      { name: "description", label: "Description", type: "textarea", rows: 4, maxLength: 1500 },
      { name: "sort_order", label: "Order", type: "number" },
    ],
  },
};

export const collectionList = Object.values(collections);

export function getCollection(table: string): CollectionDefinition | null {
  return collections[table as CollectionTable] ?? null;
}
