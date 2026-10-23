import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseServiceRoleKey } from "@/lib/supabase/env";

/**
 * Privileged client. It bypasses Row Level Security, so it is only used where
 * RLS cannot express the rule:
 *
 *   1. The public contact route, which must insert an inquiry as an anonymous
 *      visitor without granting anonymous insert rights to the table.
 *   2. Loading aggregate counts for the dashboard, which span every status.
 *
 * Never import this module from a Client Component or a file that is part of
 * the browser bundle. The `server-only` import enforces that at build time.
 */
export function createSupabaseAdminClient() {
  const config = getSupabaseConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!config || !serviceRoleKey) {
    throw new Error(
      "Supabase service access is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY on the server.",
    );
  }

  return createClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function hasSupabaseServiceAccess() {
  return Boolean(getSupabaseConfig() && getSupabaseServiceRoleKey());
}
