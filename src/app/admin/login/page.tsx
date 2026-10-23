import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { SubmitButton } from "@/components/admin/submit-button";
import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAdminSession, getAuthenticatedEmail } from "@/server/auth";
import { signOutAction, startPreviewAction } from "@/server/actions/auth";

export const instant = false;

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  await connection();

  const admin = await getAdminSession();

  if (admin) {
    redirect("/admin");
  }

  const configured = isSupabaseConfigured();
  const signedInEmail = configured ? await getAuthenticatedEmail() : null;
  const preview = isAdminPreviewAvailable();

  return (
    <main className="flex min-h-screen items-center justify-center bg-ivory px-4 py-16">
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Administration</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
          Sign in to manage the site.
        </h1>
        <p className="mt-3 text-muted">
          This dashboard is private. Content, media, and inquiries are only
          visible to the site administrator.
        </p>

        <div className="mt-8 border border-line bg-paper px-6 py-7">
          {signedInEmail ? (
            <div className="mb-6 grid gap-3 border border-accent/40 bg-white px-4 py-3 text-sm">
              <p className="text-charcoal">
                You are signed in as <strong>{signedInEmail}</strong>, but this
                account is not an administrator.
              </p>
              <p className="text-muted">
                Add the address to <code>ADMIN_EMAILS</code> in the environment,
                or insert it into <code>public.admin_users</code>, then reload
                this page.
              </p>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-sm uppercase tracking-[0.08em] text-accent hover:text-accent-hover"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : null}

          {configured ? (
            <LoginForm />
          ) : (
            <div className="grid gap-3 text-sm text-ink/80">
              <p className="font-serif text-xl text-charcoal">Supabase is not connected yet.</p>
              <p>
                These values come from a Supabase project you create, not from
                this repository:
              </p>
              <ol className="ml-4 list-decimal space-y-1">
                <li>
                  Create a project at{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    className="text-accent underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    supabase.com/dashboard
                  </a>
                  .
                </li>
                <li>
                  Open <strong>Settings → API Keys</strong> (or the{" "}
                  <strong>Connect</strong> dialog) and copy the project URL and
                  the publishable key.
                </li>
                <li>
                  Paste them into <code className="text-charcoal">.env.local</code>{" "}
                  as <code className="text-charcoal">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="text-charcoal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
                  then restart the dev server.
                </li>
                <li>
                  Create your sign-in account in{" "}
                  <strong>Authentication → Users</strong> and add that email to{" "}
                  <code className="text-charcoal">ADMIN_EMAILS</code>.
                </li>
              </ol>
              <p className="text-muted">
                A newer project shows a publishable key (
                <code>sb_publishable_…</code>) and a secret key. The older anon
                and service_role keys work too. Full steps are in{" "}
                <code>README.md</code> under “Supabase setup”.
              </p>
            </div>
          )}

          {preview ? (
            <form action={startPreviewAction} className="mt-6 border-t border-line pt-5">
              <p className="text-sm text-muted">
                Local preview: browse the dashboard with sample content. It is
                read-only and never available in production.
              </p>
              <div className="mt-3">
                <SubmitButton variant="secondary" pendingLabel="Opening…">
                  Open read-only preview
                </SubmitButton>
              </div>
            </form>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            ← Back to the site
          </Link>
          <span>Single administrator</span>
        </div>
      </div>
    </main>
  );
}
