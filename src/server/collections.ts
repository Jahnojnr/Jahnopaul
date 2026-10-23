import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AchievementRow,
  CertificationRow,
  EducationRow,
  ExperienceRow,
  ServiceRow,
  SkillGroupRow,
  SkillRow,
} from "@/types/database";
import {
  previewAchievements,
  previewEducation,
  previewExperiences,
  previewServices,
  previewSkillGroups,
  previewSkills,
} from "@/server/preview-data";

/**
 * Small content collections share one shape: a sortable list of records edited
 * as a single form. The table name is a closed union, and every value has
 * already passed Zod validation before it reaches these functions.
 */

export type CollectionTable =
  | "experiences"
  | "services"
  | "education"
  | "certifications"
  | "achievements";

export type CollectionRow =
  | ExperienceRow
  | ServiceRow
  | EducationRow
  | CertificationRow
  | AchievementRow;

function previewCollection<T>(table: CollectionTable): T[] {
  switch (table) {
    case "experiences":
      return previewExperiences as unknown as T[];
    case "services":
      return previewServices as unknown as T[];
    case "education":
      return previewEducation as unknown as T[];
    case "achievements":
      return previewAchievements as unknown as T[];
    case "certifications":
    default:
      return [];
  }
}

export async function listCollection<T extends CollectionRow>(
  table: CollectionTable,
): Promise<T[]> {
  await requireRequestTime();

  if (isAdminPreviewAvailable()) {
    return previewCollection<T>(table);
  }

  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Could not load ${table}: ${error.message}`);
  }

  return (data ?? []) as T[];
}

export async function getCollectionRow<T extends CollectionRow>(
  table: CollectionTable,
  id: string,
): Promise<T | null> {
  await requireRequestTime();

  if (isAdminPreviewAvailable()) {
    return previewCollection<T>(table).find((row) => row.id === id) ?? null;
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();

  return (data as T | null) ?? null;
}

export async function createCollectionRow(
  table: CollectionTable,
  values: Record<string, unknown>,
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(table).insert(values).select("id").single();

  if (error) {
    return { ok: false as const, message: "The record could not be created." };
  }

  return { ok: true as const, id: data.id as string };
}

export async function updateCollectionRow(
  table: CollectionTable,
  id: string,
  values: Record<string, unknown>,
) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table).update(values).eq("id", id);

  return error
    ? { ok: false as const, message: "The record could not be saved." }
    : { ok: true as const };
}

export async function deleteCollectionRow(table: CollectionTable, id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  return error
    ? { ok: false as const, message: "The record could not be deleted." }
    : { ok: true as const };
}

// ---------------------------------------------------------------------------
// Skills: groups own an ordered list of skill names.
// ---------------------------------------------------------------------------

export type SkillGroupWithSkills = SkillGroupRow & { skills: SkillRow[] };

export async function listSkillGroups(): Promise<SkillGroupWithSkills[]> {
  await requireRequestTime();

  if (isAdminPreviewAvailable()) {
    return previewSkillGroups.map((group) => ({
      ...group,
      skills: previewSkills.filter((skill) => skill.group_id === group.id),
    }));
  }

  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const [{ data: groups, error }, { data: skills }] = await Promise.all([
    supabase.from("skill_groups").select("*").order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
  ]);

  if (error) {
    throw new Error(`Could not load skill groups: ${error.message}`);
  }

  return ((groups ?? []) as SkillGroupRow[]).map((group) => ({
    ...group,
    skills: ((skills ?? []) as SkillRow[]).filter((skill) => skill.group_id === group.id),
  }));
}

export async function getSkillGroup(id: string) {
  const groups = await listSkillGroups();
  return groups.find((group) => group.id === id) ?? null;
}

export async function saveSkillGroup(values: {
  id?: string;
  name: string;
  sortOrder: number;
  skills: string[];
}) {
  const supabase = await createSupabaseServerClient();

  let groupId = values.id;

  if (groupId) {
    const { error } = await supabase
      .from("skill_groups")
      .update({ name: values.name, sort_order: values.sortOrder })
      .eq("id", groupId);

    if (error) {
      return { ok: false as const, message: "The skill group could not be saved." };
    }
  } else {
    const { data, error } = await supabase
      .from("skill_groups")
      .insert({ name: values.name, sort_order: values.sortOrder })
      .select("id")
      .single();

    if (error) {
      return { ok: false as const, message: "The skill group could not be created." };
    }

    groupId = data.id as string;
  }

  const { error: deleteError } = await supabase
    .from("skills")
    .delete()
    .eq("group_id", groupId);

  if (deleteError) {
    return { ok: false as const, message: "The skill list could not be updated." };
  }

  if (values.skills.length > 0) {
    const { error: insertError } = await supabase.from("skills").insert(
      values.skills.map((name, index) => ({
        group_id: groupId,
        name,
        sort_order: index + 1,
      })),
    );

    if (insertError) {
      return { ok: false as const, message: "The skills could not be saved." };
    }
  }

  return { ok: true as const, id: groupId };
}

export async function deleteSkillGroup(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("skill_groups").delete().eq("id", id);

  return error
    ? { ok: false as const, message: "The skill group could not be deleted." }
    : { ok: true as const };
}
