import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Local, read-only preview of the dashboard shell.
 *
 * It exists so the admin interface can be reviewed before a Supabase project is
 * connected. It is deliberately constrained:
 *
 *   - development only (`NODE_ENV !== "production"`),
 *   - explicitly enabled with ADMIN_PREVIEW_MODE=true,
 *   - disabled as soon as real Supabase credentials are present,
 *   - read-only: every mutation refuses to run in a preview session.
 */
export const ADMIN_PREVIEW_COOKIE = "admin_preview";
export const ADMIN_PREVIEW_PARAM = "preview";

export function isAdminPreviewAvailable() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW_MODE === "true" &&
    !isSupabaseConfigured()
  );
}

export const PREVIEW_READ_ONLY_MESSAGE =
  "This is a read-only preview using sample content. Connect Supabase to save changes.";
