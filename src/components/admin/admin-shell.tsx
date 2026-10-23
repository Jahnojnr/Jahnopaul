import Link from "next/link";
import { AdminNav, type AdminNavItem } from "@/components/admin/admin-nav";
import { siteConfig } from "@/config/site";
import type { AdminUser } from "@/server/auth";
import { signOutAction } from "@/server/actions/auth";

const navigation: AdminNavItem[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/writing", label: "Writing" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div className="flex items-baseline gap-3">
            <Link href="/admin" className="font-serif text-lg text-charcoal">
              {siteConfig.name}.
            </Link>
            <span className="text-xs uppercase tracking-[0.18em] text-muted">
              Content administration
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted hover:text-accent">
              View site ↗
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="min-h-9 text-sm uppercase tracking-[0.08em] text-muted hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {admin.preview ? (
        <div className="border-b border-accent/30 bg-accent-soft">
          <p className="mx-auto max-w-6xl px-4 py-2 text-sm text-accent md:px-8">
            Read-only preview using sample content. Connect Supabase to create,
            edit, and publish records.
          </p>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
        <aside className="md:w-52 md:shrink-0">
          <div className="md:sticky md:top-8">
            <AdminNav items={navigation} />
            <p className="mt-6 hidden border-t border-line pt-4 text-xs text-muted md:block">
              Signed in as
              <br />
              <span className="break-all text-charcoal">{admin.email}</span>
            </p>
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
