import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Local, read-only preview of the dashboard shell.
 *
 * It exists so the admin interface can be reviewed without touching real data.
 * It is constrained:
 *
 *   - development only (`NODE_ENV !== "production"`),
 *   - never available in a production build,
 *   - read-only: every mutation refuses to run in a preview session.
 *
 * Availability:
 *
 *   - on by default in development when Supabase is not configured,
 *   - off once Supabase is configured, so a real deployment never shows sample
 *     content next to real content,
 *   - `ADMIN_PREVIEW_MODE=true` forces it on in development even when Supabase
 *     is configured, which is useful on a machine that cannot reach Supabase,
 *   - `ADMIN_PREVIEW_MODE=false` forces it off.
 */
export const ADMIN_PREVIEW_COOKIE = "admin_preview";
export const ADMIN_PREVIEW_PARAM = "preview";

export function isAdminPreviewAvailable() {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  const setting = process.env.ADMIN_PREVIEW_MODE?.trim().toLowerCase();

  if (setting === "false" || setting === "0" || setting === "off") {
    return false;
  }

  if (setting === "true" || setting === "1" || setting === "on") {
    return true;
  }

  return !isSupabaseConfigured();
}

export const PREVIEW_READ_ONLY_MESSAGE =
  "This is a read-only preview using sample content. Connect Supabase to save changes.";
