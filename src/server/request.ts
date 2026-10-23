import "server-only";

import { connection } from "next/server";

/**
 * Marks admin reads as request-time work. Without this, a page that happens to
 * render synchronously during the build could be prerendered with stale
 * dashboard data and then served from the CDN.
 */
export async function requireRequestTime() {
  await connection();
}
