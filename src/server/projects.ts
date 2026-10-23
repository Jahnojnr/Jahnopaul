import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProjectInput } from "@/lib/validation/content";
import type { CategoryRow, ProjectRow, TechnologyRow } from "@/types/database";
import type { ContentStatus } from "@/types/content";
import {
  previewCategories,
  previewProjects,
  previewTechnologies,
} from "@/server/preview-data";

export type ProjectFilters = {
  status: ContentStatus | "all";
  query: string;
  page: number;
  perPage: number;
};

export type ProjectListResult = {
  rows: ProjectRow[];
  total: number;
  page: number;
  perPage: number;
};

const isPreviewData = () => isAdminPreviewAvailable();

/** Turn a Postgres error into a message an editor can act on. */
export function describeDbError(message: string) {
  if (message.includes("duplicate key") && message.includes("slug")) {
    return "That URL slug is already used by another item. Choose a different one.";
  }

  if (message.includes("row-level security")) {
    return "The database refused this change. Check that your account is listed as an administrator.";
  }

  return "The change could not be saved. Please try again.";
}

export async function listProjects(filters: ProjectFilters): Promise<ProjectListResult> {
  await requireRequestTime();

  const { status, query, page, perPage } = filters;

  if (isPreviewData()) {
    const filtered = previewProjects
      .filter((project) => status === "all" || project.status === status)
      .filter((project) => {
        if (!query) return true;
        const haystack = `${project.title} ${project.slug} ${project.summary}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
      .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));

    return {
      rows: filtered.slice((page - 1) * perPage, page * perPage),
      total: filtered.length,
      page,
      perPage,
    };
  }

  if (!isSupabaseConfigured()) {
    return { rows: [], total: 0, page, perPage };
  }

  const supabase = await createSupabaseServerClient();
  let request = supabase.from("projects").select("*", { count: "exact" });

  if (status !== "all") {
    request = request.eq("status", status);
  }

  if (query) {
    const escaped = query.replace(/[%,()]/g, " ");
    request = request.or(`title.ilike.%${escaped}%,slug.ilike.%${escaped}%`);
  }

  const from = (page - 1) * perPage;
  const { data, count, error } = await request
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    throw new Error(`Could not load projects: ${error.message}`);
  }

  return {
    rows: (data ?? []) as ProjectRow[],
    total: count ?? 0,
    page,
    perPage,
  };
}

export type ProjectDetail = {
  project: ProjectRow;
  categoryIds: string[];
  technologyIds: string[];
};

export async function getProject(id: string): Promise<ProjectDetail | null> {
  await requireRequestTime();

  if (isPreviewData()) {
    const project = previewProjects.find((row) => row.id === id);
    if (!project) return null;

    return {
      project,
      categoryIds: [],
      technologyIds: [],
    };
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load the project: ${error.message}`);
  }

  if (!project) return null;

  const [{ data: categoryLinks }, { data: technologyLinks }] = await Promise.all([
    supabase.from("project_categories").select("category_id").eq("project_id", id),
    supabase.from("project_technologies").select("technology_id").eq("project_id", id),
  ]);

  return {
    project: project as ProjectRow,
    categoryIds: (categoryLinks ?? []).map((row) => row.category_id as string),
    technologyIds: (technologyLinks ?? []).map((row) => row.technology_id as string),
  };
}

export type ProjectTaxonomy = {
  categories: CategoryRow[];
  technologies: TechnologyRow[];
};

export async function getProjectTaxonomy(): Promise<ProjectTaxonomy> {
  await requireRequestTime();

  if (isPreviewData()) {
    return { categories: previewCategories, technologies: previewTechnologies };
  }

  if (!isSupabaseConfigured()) return { categories: [], technologies: [] };

  const supabase = await createSupabaseServerClient();
  const [{ data: categories }, { data: technologies }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name"),
    supabase.from("technologies").select("id, name, slug").order("name"),
  ]);

  return {
    categories: (categories ?? []) as CategoryRow[],
    technologies: (technologies ?? []) as TechnologyRow[],
  };
}

function projectColumns(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    problem: input.problem,
    solution: input.solution,
    role: input.role,
    content: input.content,
    outcomes: input.outcomes,
    cover_image_path: input.coverImagePath,
    cover_label: input.coverLabel,
    live_url: input.liveUrl,
    repository_url: input.repositoryUrl,
    status: input.status,
    featured: input.featured,
    sort_order: input.sortOrder,
  };
}

async function replaceLinks(projectId: string, input: ProjectInput) {
  const supabase = await createSupabaseServerClient();

  await supabase.from("project_categories").delete().eq("project_id", projectId);
  await supabase.from("project_technologies").delete().eq("project_id", projectId);

  if (input.categoryIds.length > 0) {
    await supabase.from("project_categories").insert(
      input.categoryIds.map((categoryId) => ({
        project_id: projectId,
        category_id: categoryId,
      })),
    );
  }

  if (input.technologyIds.length > 0) {
    await supabase.from("project_technologies").insert(
      input.technologyIds.map((technologyId) => ({
        project_id: projectId,
        technology_id: technologyId,
      })),
    );
  }
}

export async function createProject(input: ProjectInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(projectColumns(input))
    .select("id")
    .single();

  if (error) {
    return { ok: false as const, message: describeDbError(error.message) };
  }

  await replaceLinks(data.id as string, input);

  return { ok: true as const, id: data.id as string };
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update(projectColumns(input))
    .eq("id", id);

  if (error) {
    return { ok: false as const, message: describeDbError(error.message) };
  }

  await replaceLinks(id, input);

  return { ok: true as const, id };
}

export async function setProjectStatus(id: string, status: ContentStatus) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", id);

  return error ? { ok: false as const, message: describeDbError(error.message) } : { ok: true as const };
}

export async function setProjectFeatured(id: string, featured: boolean) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id);

  return error ? { ok: false as const, message: describeDbError(error.message) } : { ok: true as const };
}

export async function deleteProject(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  return error ? { ok: false as const, message: describeDbError(error.message) } : { ok: true as const };
}
