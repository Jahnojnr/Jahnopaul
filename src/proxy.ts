import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_PREVIEW_COOKIE,
  isAdminPreviewAvailable,
} from "@/lib/admin/preview";
import { getSupabaseConfig } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session cookie for admin traffic.
 *
 * This is transport maintenance only. It never grants access: every protected
 * page and every Server Action re-checks the session through the data access
 * layer in `src/server/auth.ts`.
 */
export async function proxy(request: NextRequest) {
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.next();
  }

  // Fast path: with no Supabase auth cookie at all there is nothing to refresh
  // and no session to validate, so send the visitor straight to the sign-in
  // page instead of rendering an admin shell that will redirect anyway. This is
  // a transport shortcut, not the access check: every page and action still
  // verifies the session in src/server/auth.ts.
  const hasAuthCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token"));

  const hasPreviewCookie =
    isAdminPreviewAvailable() && request.cookies.get(ADMIN_PREVIEW_COOKIE)?.value === "1";

  const { pathname } = request.nextUrl;

  if (!hasAuthCookie && !hasPreviewCookie && pathname !== "/admin/login") {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
