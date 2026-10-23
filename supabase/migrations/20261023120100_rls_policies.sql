-- Row Level Security.
-- Public visitors read published portfolio content and approved public settings.
-- Only the allowlisted administrator may write, and only the administrator may
-- read drafts, archived records, media metadata, or contact inquiries.

alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.technologies enable row level security;
alter table public.projects enable row level security;
alter table public.project_categories enable row level security;
alter table public.project_technologies enable row level security;
alter table public.posts enable row level security;
alter table public.experiences enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skills enable row level security;
alter table public.services enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.achievements enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------------
-- Administrator allowlist: a user may confirm their own membership.
-- ---------------------------------------------------------------------------

create policy "Administrators read their own membership"
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Profile: public identity is readable; only the administrator edits it.
-- ---------------------------------------------------------------------------

create policy "Public can read the profile"
on public.profiles
for select
to anon, authenticated
using (true);

create policy "Administrator manages the profile"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Projects: published only, unless the caller is the administrator.
-- ---------------------------------------------------------------------------

create policy "Public reads published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "Administrator manages projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Classification tables are public reference data.
create policy "Public reads categories"
on public.categories
for select
to anon, authenticated
using (true);

create policy "Administrator manages categories"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads technologies"
on public.technologies
for select
to anon, authenticated
using (true);

create policy "Administrator manages technologies"
on public.technologies
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Join tables: visible only when the related project is published.
create policy "Public reads published project categories"
on public.project_categories
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.projects p
    where p.id = project_id and p.status = 'published'
  )
);

create policy "Administrator manages project categories"
on public.project_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public reads published project technologies"
on public.project_technologies
for select
to anon, authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.projects p
    where p.id = project_id and p.status = 'published'
  )
);

create policy "Administrator manages project technologies"
on public.project_technologies
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Posts
-- ---------------------------------------------------------------------------

create policy "Public reads published posts"
on public.posts
for select
to anon, authenticated
using (status = 'published' or public.is_admin());

create policy "Administrator manages posts"
on public.posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Career, skills, services, education, achievements
-- Public reference content: readable by everyone, writable by the administrator.
-- ---------------------------------------------------------------------------

create policy "Public reads experiences"
on public.experiences for select to anon, authenticated using (true);
create policy "Administrator manages experiences"
on public.experiences for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads skill groups"
on public.skill_groups for select to anon, authenticated using (true);
create policy "Administrator manages skill groups"
on public.skill_groups for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads skills"
on public.skills for select to anon, authenticated using (true);
create policy "Administrator manages skills"
on public.skills for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads services"
on public.services for select to anon, authenticated using (true);
create policy "Administrator manages services"
on public.services for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads education"
on public.education for select to anon, authenticated using (true);
create policy "Administrator manages education"
on public.education for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads certifications"
on public.certifications for select to anon, authenticated using (true);
create policy "Administrator manages certifications"
on public.certifications for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create policy "Public reads achievements"
on public.achievements for select to anon, authenticated using (true);
create policy "Administrator manages achievements"
on public.achievements for all to authenticated
using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Media
-- ---------------------------------------------------------------------------

create policy "Public reads media metadata"
on public.media_assets
for select
to anon, authenticated
using (true);

create policy "Administrator manages media metadata"
on public.media_assets
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Inquiries: private to the administrator.
-- ---------------------------------------------------------------------------

create policy "Administrator reads inquiries"
on public.contact_inquiries
for select
to authenticated
using (public.is_admin());

create policy "Administrator updates inquiries"
on public.contact_inquiries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Administrator deletes inquiries"
on public.contact_inquiries
for delete
to authenticated
using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------

create policy "Public reads public settings"
on public.site_settings
for select
to anon, authenticated
using (is_public or public.is_admin());

create policy "Administrator manages settings"
on public.site_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
