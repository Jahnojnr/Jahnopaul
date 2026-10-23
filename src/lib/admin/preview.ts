import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Local, read-only preview of the dashboard shell.
 *
 * It exists so the admin interface can be reviewed before a Supabase project is
 * connected. It is deliberately constrained:
 *
 *   - development only (`NODE_ENV !== "production"`),
 *   - off as soon as real Supabase credentials are present,
 *   - off when ADMIN_PREVIEW_MODE=false is set explicitly,
 *   - read-only: every mutation refuses to run in a preview session.
 *
 * It is on by default in development without Supabase so that `npm run dev`
 * is enough to review the dashboard on any platform. Setting environment
 * variables inline (`ADMIN_PREVIEW_MODE=true npm run dev`) does not work the
 * same way in PowerShell and cmd, so the default carries that weight instead.
 */
export const ADMIN_PREVIEW_COOKIE = "admin_preview";
export const ADMIN_PREVIEW_PARAM = "preview";

export function isAdminPreviewAvailable() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ADMIN_PREVIEW_MODE !== "false" &&
    !isSupabaseConfigured()
  );
}

export const PREVIEW_READ_ONLY_MESSAGE =
  "This is a read-only preview using sample content. Connect Supabase to save changes.";
