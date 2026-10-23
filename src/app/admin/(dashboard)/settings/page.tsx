import { AdminPageHeader, Flash, Panel } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { siteConfig } from "@/config/site";
import { getPublicSetting, getProfile } from "@/server/settings";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const [profile, defaultDescription] = await Promise.all([
    getProfile(),
    getPublicSetting<string>("seo.default_description"),
  ]);

  const socialLinks = (profile?.social_links ?? {}) as Record<string, string>;

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        eyebrow="Settings"
        title="Site profile and defaults."
        description="The public identity used across the site, plus the fallback description for search results."
      />

      <Flash message={saved} />
      <Flash tone="error" message={error} />

      <Panel title="Profile" description="Saved to the database; the public pages read this record.">
        <SettingsForm
          values={{
            fullName: profile?.full_name ?? siteConfig.name,
            headline: profile?.headline ?? siteConfig.headline,
            bio: profile?.bio ?? "",
            longBio: profile?.long_bio ?? "",
            location: profile?.location ?? "",
            avatarPath: profile?.avatar_path ?? "",
            resumePath: profile?.resume_path ?? "",
            githubUrl: socialLinks.github ?? siteConfig.githubUrl,
            defaultDescription:
              defaultDescription ?? siteConfig.description,
          }}
        />
      </Panel>

      <Panel title="Environment" description="Read-only values from the running deployment.">
        <dl className="grid gap-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <dt className="uppercase tracking-[0.12em] text-muted">Site URL</dt>
            <dd className="text-charcoal">{process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
            <dt className="uppercase tracking-[0.12em] text-muted">Supabase</dt>
            <dd className="text-charcoal">
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Connected" : "Not configured"}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <dt className="uppercase tracking-[0.12em] text-muted">Contact email</dt>
            <dd className="text-charcoal">
              {process.env.RESEND_API_KEY ? "Resend configured" : "Not configured"}
            </dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}

export const instant = false;
