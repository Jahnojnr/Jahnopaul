import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";
import { profile as sampleProfile } from "@/lib/data/profile";
import { siteConfig } from "@/config/site";

export async function getProfile(): Promise<ProfileRow | null> {
  await requireRequestTime();

  if (isAdminPreviewAvailable()) {
    return {
      id: "preview-profile",
      full_name: sampleProfile.name,
      headline: sampleProfile.headline,
      bio: sampleProfile.bio,
      long_bio: sampleProfile.longerBio.join("\n\n"),
      location: siteConfig.location,
      avatar_path: null,
      resume_path: null,
      social_links: { github: siteConfig.githubUrl },
      updated_at: "2026-10-23T09:00:00.000Z",
    };
  }

  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load the profile: ${error.message}`);
  }

  return (data as ProfileRow | null) ?? null;
}

export async function getPublicSetting<T>(key: string): Promise<T | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  return (data?.value as T | undefined) ?? null;
}

export type ProfileSettingsValues = {
  fullName: string;
  headline: string;
  bio: string;
  longBio: string;
  location: string;
  avatarPath: string;
  resumePath: string;
  githubUrl: string | null;
  defaultDescription: string;
};

export async function updateProfileSettings(values: ProfileSettingsValues) {
  const supabase = await createSupabaseServerClient();
  const existing = await getProfile();

  const row = {
    full_name: values.fullName,
    headline: values.headline,
    bio: values.bio,
    long_bio: values.longBio,
    location: values.location,
    avatar_path: values.avatarPath.length > 0 ? values.avatarPath : null,
    resume_path: values.resumePath.length > 0 ? values.resumePath : null,
    social_links: values.githubUrl ? { github: values.githubUrl } : {},
  };

  if (existing) {
    const { error } = await supabase
      .from("profiles")
      .update(row)
      .eq("id", existing.id);

    if (error) {
      return { ok: false as const, message: "The profile could not be saved." };
    }
  } else {
    const { error } = await supabase.from("profiles").insert(row);

    if (error) {
      return { ok: false as const, message: "The profile could not be created." };
    }
  }

  const { error: settingsError } = await supabase.from("site_settings").upsert(
    {
      key: "seo.default_description",
      value: values.defaultDescription,
      is_public: true,
    },
    { onConflict: "key" },
  );

  if (settingsError) {
    return { ok: false as const, message: "The profile saved, but the SEO default could not be stored." };
  }

  return { ok: true as const };
}
