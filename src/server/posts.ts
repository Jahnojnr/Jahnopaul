import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PostInput } from "@/lib/validation/content";
import type { ContentStatus } from "@/types/content";
import type { PostRow } from "@/types/database";
import { describeDbError } from "@/server/projects";
import { previewPosts } from "@/server/preview-data";

export type PostFilters = {
  status: ContentStatus | "all";
  query: string;
  page: number;
  perPage: number;
};

export type PostListResult = {
  rows: PostRow[];
  total: number;
  page: number;
  perPage: number;
};

const isPreviewData = () => isAdminPreviewAvailable();

export async function listPosts(filters: PostFilters): Promise<PostListResult> {
  await requireRequestTime();

  const { status, query, page, perPage } = filters;

  if (isPreviewData()) {
    const filtered = previewPosts
      .filter((post) => status === "all" || post.status === status)
      .filter((post) => {
        if (!query) return true;
        return `${post.title} ${post.slug}`.toLowerCase().includes(query.toLowerCase());
      })
      .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));

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
  let request = supabase.from("posts").select("*", { count: "exact" });

  if (status !== "all") {
    request = request.eq("status", status);
  }

  if (query) {
    const escaped = query.replace(/[%,()]/g, " ");
    request = request.or(`title.ilike.%${escaped}%,slug.ilike.%${escaped}%`);
  }

  const from = (page - 1) * perPage;
  const { data, count, error } = await request
    .order("updated_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (error) {
    throw new Error(`Could not load articles: ${error.message}`);
  }

  return {
    rows: (data ?? []) as PostRow[],
    total: count ?? 0,
    page,
    perPage,
  };
}

export async function getPost(id: string): Promise<PostRow | null> {
  await requireRequestTime();

  if (isPreviewData()) {
    return previewPosts.find((post) => post.id === id) ?? null;
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load the article: ${error.message}`);
  }

  return (data as PostRow | null) ?? null;
}

function postColumns(input: PostInput) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    body: input.body,
    cover_image_path: input.coverImagePath,
    status: input.status,
    featured: input.featured,
  };
}

export async function createPost(input: PostInput) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(postColumns(input))
    .select("id")
    .single();

  if (error) {
    return { ok: false as const, message: describeDbError(error.message) };
  }

  return { ok: true as const, id: data.id as string };
}

export async function updatePost(id: string, input: PostInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").update(postColumns(input)).eq("id", id);

  return error ? { ok: false as const, message: describeDbError(error.message) } : { ok: true as const, id };
}

export async function setPostStatus(id: string, status: ContentStatus) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").update({ status }).eq("id", id);

  return error ? { ok: false as const, message: describeDbError(error.message) } : { ok: true as const };
}

export async function deletePost(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  return error ? { ok: false as const, message: describeDbError(error.message) } : { ok: true as const };
}
