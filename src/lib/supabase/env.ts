/**
 * Supabase configuration.
 *
 * Only the URL and the publishable (anonymous) key are read on the client.
 * The service-role key is never imported from a module that can be bundled for
 * the browser; `src/lib/supabase/admin.ts` guards it with `server-only`.
 */

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function read(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = read(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = read(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

export function getSupabaseServiceRoleKey(): string | null {
  return read(process.env.SUPABASE_SERVICE_ROLE_KEY);
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
