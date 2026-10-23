import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_PREVIEW_COOKIE,
  isAdminPreviewAvailable,
} from "@/lib/admin/preview";
import {
  getAdminEmailAllowlist,
  getSupabaseConfig,
  isSupabaseConfigured,
} from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  /** True when the session comes from the local read-only preview, not Supabase Auth. */
  preview: boolean;
};

/**
 * Data Access Layer for administrator identity.
 *
 * Every protected page, Server Action, and server-side data read goes through
 * here. Hiding navigation links is never treated as access control.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  // A local preview session wins in development. It never exists in a
  // production build, and it is read-only, so this cannot bypass real auth.
  if (isAdminPreviewAvailable()) {
    const cookieStore = await cookies();

    if (cookieStore.get(ADMIN_PREVIEW_COOKIE)?.value === "1") {
      return {
        id: "preview",
        email: "preview@local",
        displayName: "Preview session",
        preview: true,
      };
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    const email = user.email.toLowerCase();
    const allowlisted = getAdminEmailAllowlist().includes(email);

    if (!allowlisted) {
      const { data: membership } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!membership) {
        return null;
      }
    }

    return {
      id: user.id,
      email,
      displayName: email,
      preview: false,
    };
  }

  return null;
}

/**
 * The email of whoever is signed in to Supabase Auth, whether or not that
 * account is an administrator. Used to explain a failed authorisation instead
 * of silently bouncing the visitor back to the sign-in form.
 */
export async function getAuthenticatedEmail(): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email?.toLowerCase() ?? null;
}

/** For pages and layouts: redirect unauthenticated visitors to the sign-in page. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

/**
 * For Server Actions: never redirect a mutation, and always re-verify the
 * session on the server. Preview sessions are read-only.
 */
export async function requireAdminForAction(): Promise<AdminUser> {
  const admin = await getAdminSession();

  if (!admin) {
    throw new Error("You are not authorised to perform this action.");
  }

  if (admin.preview) {
    throw new Error(
      "This is a read-only preview using sample content. Connect Supabase to save changes.",
    );
  }

  return admin;
}

export async function signInWithPassword(email: string, password: string) {
  if (!getSupabaseConfig()) {
    return {
      ok: false as const,
      message:
        "Supabase is not configured yet. Add the project URL and publishable key to the environment, or use the local preview.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false as const,
      message: "Those credentials were not accepted. Check the email and password.",
    };
  }

  return { ok: true as const };
}

export async function signOutAdmin() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_PREVIEW_COOKIE);
}

export async function startPreviewSession() {
  if (!isAdminPreviewAvailable()) {
    return { ok: false as const, message: "Preview mode is not available." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_PREVIEW_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4,
  });

  return { ok: true as const };
}
