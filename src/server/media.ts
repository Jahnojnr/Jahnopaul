import "server-only";

import { requireRequestTime } from "@/server/request";

import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/validation/common";
import type { MediaAssetRow } from "@/types/database";

const BUCKET = "media";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
] as const;

export async function listMedia(): Promise<MediaAssetRow[]> {
  await requireRequestTime();

  if (isAdminPreviewAvailable() || !isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load media: ${error.message}`);
  }

  return (data ?? []) as MediaAssetRow[];
}

export type UploadResult =
  | { ok: true; asset: MediaAssetRow }
  | { ok: false; message: string };

export async function uploadMedia(
  file: File,
  altText: string,
  folder = "library",
): Promise<UploadResult> {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
    return {
      ok: false,
      message: "Upload a JPEG, PNG, WebP, AVIF, or PDF file.",
    };
  }

  if (file.size === 0) {
    return { ok: false, message: "That file is empty." };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Keep uploads under 5 MB." };
  }

  if (altText.trim().length === 0) {
    return {
      ok: false,
      message: "Add alt text that describes the image for someone who cannot see it.",
    };
  }

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : undefined;
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "asset";
  const path = `${folder}/${Date.now()}-${base}${extension ? `.${extension}` : ""}`;

  const supabase = await createSupabaseServerClient();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { ok: false, message: `The upload failed: ${uploadError.message}` };
  }

  const { data, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      storage_path: path,
      alt_text: altText.trim(),
      mime_type: file.type,
      file_size: file.size,
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, message: "The file uploaded, but its record could not be saved." };
  }

  return { ok: true, asset: data as MediaAssetRow };
}

export async function deleteMedia(asset: MediaAssetRow) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(BUCKET).remove([asset.storage_path]);

  if (error) {
    return { ok: false as const, message: "The file could not be removed from storage." };
  }

  const { error: deleteError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", asset.id);

  return deleteError
    ? { ok: false as const, message: "The file record could not be removed." }
    : { ok: true as const };
}

/** Public URL for a file in the public `media` bucket. */
export function publicMediaUrl(storagePath: string) {
  const config = getSupabaseConfig();
  if (!config) return null;
  return `${config.url}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
