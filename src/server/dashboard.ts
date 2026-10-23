import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContactInquiryRow, PostRow, ProjectRow } from "@/types/database";
import { previewPosts, previewProjects } from "@/server/preview-data";

export type DashboardData = {
  projectCounts: Record<"draft" | "published" | "archived", number>;
  postCounts: Record<"draft" | "published" | "archived", number>;
  newInquiries: number;
  recentInquiries: ContactInquiryRow[];
  recentDrafts: Array<{ id: string; title: string; kind: "project" | "article"; updatedAt: string }>;
};

const emptyCounts = () => ({ draft: 0, published: 0, archived: 0 });

function countByStatus(rows: Array<{ status: string }>) {
  const counts = emptyCounts();

  for (const row of rows) {
    if (row.status === "draft" || row.status === "published" || row.status === "archived") {
      counts[row.status] += 1;
    }
  }

  return counts;
}

export async function getDashboardData(): Promise<DashboardData> {
  await requireRequestTime();

  if (isAdminPreviewAvailable()) {
    const projects: ProjectRow[] = previewProjects;
    const posts: PostRow[] = previewPosts;

    return {
      projectCounts: countByStatus(projects),
      postCounts: countByStatus(posts),
      newInquiries: 0,
      recentInquiries: [],
      recentDrafts: [...projects.filter((p) => p.status !== "published"), ...posts.filter((p) => p.status !== "published")]
        .map((row) => ({
          id: row.id,
          title: row.title,
          kind: "summary" in row ? ("project" as const) : ("article" as const),
          updatedAt: row.updated_at,
        }))
        .slice(0, 5),
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      projectCounts: emptyCounts(),
      postCounts: emptyCounts(),
      newInquiries: 0,
      recentInquiries: [],
      recentDrafts: [],
    };
  }

  const supabase = await createSupabaseServerClient();

  const [
    { data: projectRows },
    { data: postRows },
    { data: recentInquiries },
    { count: newInquiryCount },
  ] = await Promise.all([
    supabase.from("projects").select("id, title, status, updated_at").order("updated_at", { ascending: false }),
    supabase.from("posts").select("id, title, status, updated_at").order("updated_at", { ascending: false }),
    supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("contact_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const drafts = [
    ...(projectRows ?? []).map((row) => ({
      id: row.id as string,
      title: row.title as string,
      status: row.status as string,
      updatedAt: row.updated_at as string,
      kind: "project" as const,
    })),
    ...(postRows ?? []).map((row) => ({
      id: row.id as string,
      title: row.title as string,
      status: row.status as string,
      updatedAt: row.updated_at as string,
      kind: "article" as const,
    })),
  ]
    .filter((row) => row.status !== "published")
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 5)
    .map(({ id, title, kind, updatedAt }) => ({ id, title, kind, updatedAt }));

  return {
    projectCounts: countByStatus((projectRows ?? []) as Array<{ status: string }>),
    postCounts: countByStatus((postRows ?? []) as Array<{ status: string }>),
    newInquiries: newInquiryCount ?? 0,
    recentInquiries: (recentInquiries ?? []) as ContactInquiryRow[],
    recentDrafts: drafts,
  };
}
