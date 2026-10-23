import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { SubmitButton } from "@/components/admin/submit-button";
import { isAdminPreviewAvailable } from "@/lib/admin/preview";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getAdminSession } from "@/server/auth";
import { startPreviewAction } from "@/server/actions/auth";

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
          {configured ? (
            <LoginForm />
          ) : (
            <div className="grid gap-3 text-sm text-ink/80">
              <p className="font-serif text-xl text-charcoal">Supabase is not connected yet.</p>
              <p>
                Add <code className="text-charcoal">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-charcoal">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
                <code className="text-charcoal">.env.local</code>, create the administrator
                account in Supabase Auth, and reload this page.
              </p>
              <p className="text-muted">
                The setup steps are in <code>README.md</code> under “Supabase setup”.
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
