/**
 * Supabase configuration.
 *
 * Only the URL and the publishable (anonymous) key are read on the client.
 * The secret (service-role) key is never imported from a module that can be
 * bundled for the browser; `src/lib/supabase/admin.ts` guards it with `server-only`.
 *
 * Supabase is migrating from the long-lived `anon` / `service_role` keys to
 * `sb_publishable_…` / `sb_secret_…` keys, and the older names are deprecated
 * by the end of 2026. Both spellings are accepted here so a project created
 * either side of that change works without edited code.
 */

export type SupabaseConfig = {
  url: string;
  /** Publishable key, or the legacy anon key. Safe in the browser. */
  anonKey: string;
};

function read(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = read(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey =
    read(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    read(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    read(process.env.SUPABASE_PUBLISHABLE_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

/** Secret key, or the legacy service-role key. Bypasses RLS: server only. */
export function getSupabaseServiceRoleKey(): string | null {
  return (
    read(process.env.SUPABASE_SERVICE_ROLE_KEY) ??
    read(process.env.SUPABASE_SECRET_KEY)
  );
}

/**
 * Comma-separated allowlist of administrator email addresses. This is the
 * bootstrap path: it lets a single known address sign in before any row exists
 * in `admin_users`. Members listed in the table are also administrators.
 */
export function getAdminEmailAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}
