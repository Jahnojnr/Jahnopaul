-- ---------------------------------------------------------------------------
-- GENERATED FILE — do not edit. Regenerate with `npm run sql:bundle`.
--
-- Applies the portfolio schema, Row Level Security policies, and the storage
-- bucket in one pass. Paste this whole file into the Supabase SQL editor and
-- run it once on a fresh project.
--
-- Sources: 20261023120000_init_schema.sql, 20261023120100_rls_policies.sql, 20261023120200_storage.sql
-- ---------------------------------------------------------------------------

-- ===== 20261023120000_init_schema.sql =====

-- Initial schema for the personal portfolio platform.
-- Relational, normalized, UUID-keyed. Public pages read only published records;
-- the administrator dashboard is the only writer.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enumerated states
-- ---------------------------------------------------------------------------

create type public.content_status as enum ('draft', 'published', 'archived');
create type public.inquiry_status as enum ('new', 'read', 'replied', 'archived');

-- ---------------------------------------------------------------------------
-- Shared trigger functions
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- A record only acquires a publication date when it is first published.
-- It keeps that date across later edits and unpublishing.
create or replace function public.set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Administrator allowlist
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Supabase Auth users allowed to use the administrator dashboard. Managed by a database administrator, not by the dashboard.';

-- Security-definer helper: evaluates the caller's administrator membership
-- without requiring a select policy of its own on admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

comment on function public.is_admin() is
  'True when the current Supabase Auth user is listed in admin_users.';

-- ---------------------------------------------------------------------------
-- Profile (single public identity row)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) > 0),
  headline text not null check (char_length(trim(headline)) > 0),
  bio text not null default '',
  -- Paragraphs separated by a blank line. Rendered through a constrained,
  -- plain-text renderer, never as raw HTML.
  long_bio text not null default '',
  location text,
  avatar_path text,
  resume_path text,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on column public.profiles.long_bio is
  'Plain-text paragraphs separated by a blank line.';

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Projects and classification
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary text not null default '',
  problem text not null default '',
  solution text not null default '',
  role text not null default '',
  -- Case-study body: plain-text paragraphs separated by a blank line.
  content text not null default '',
  -- Supporting bullet points shown as outcomes.
  outcomes text[] not null default '{}',
  cover_image_path text,
  cover_label text not null default '',
  live_url text,
  repository_url text,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_published_at_required
    check (status <> 'published' or published_at is not null)
);

create index projects_status_published_at_idx
  on public.projects (status, published_at desc);
create index projects_featured_sort_order_idx
  on public.projects (featured, sort_order);
create index projects_slug_idx on public.projects (slug);

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger projects_set_published_at
before insert or update on public.projects
for each row execute function public.set_published_at();

create table public.project_categories (
  project_id uuid not null references public.projects (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (project_id, category_id)
);

create index project_categories_category_id_idx
  on public.project_categories (category_id);

create table public.project_technologies (
  project_id uuid not null references public.projects (id) on delete cascade,
  technology_id uuid not null references public.technologies (id) on delete cascade,
  primary key (project_id, technology_id)
);

create index project_technologies_technology_id_idx
  on public.project_technologies (technology_id);

-- ---------------------------------------------------------------------------
-- Writing
-- ---------------------------------------------------------------------------

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text not null default '',
  -- Article body: plain-text paragraphs separated by a blank line.
  body text not null default '',
  cover_image_path text,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_published_at_required
    check (status <> 'published' or published_at is not null)
);

create index posts_status_published_at_idx
  on public.posts (status, published_at desc);
create index posts_slug_idx on public.posts (slug);

create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create trigger posts_set_published_at
before insert or update on public.posts
for each row execute function public.set_published_at();

-- ---------------------------------------------------------------------------
-- Career, skills, services, education, achievements
-- ---------------------------------------------------------------------------

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  organization text not null check (char_length(trim(organization)) > 0),
  role text not null check (char_length(trim(role)) > 0),
  description text not null default '',
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_date_order
    check (end_date is null or end_date >= start_date),
  constraint experiences_current_has_no_end
    check (not is_current or end_date is null)
);

create index experiences_sort_order_idx on public.experiences (sort_order);

create trigger experiences_set_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(trim(name)) > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger skill_groups_set_updated_at
before update on public.skill_groups
for each row execute function public.set_updated_at();

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.skill_groups (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, name)
);

create index skills_group_sort_idx on public.skills (group_id, sort_order);

create trigger skills_set_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  summary text not null default '',
  details text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null check (char_length(trim(institution)) > 0),
  credential text not null check (char_length(trim(credential)) > 0),
  period text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger education_set_updated_at
before update on public.education
for each row execute function public.set_updated_at();

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  issuer text not null default '',
  issued_on date,
  credential_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger certifications_set_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  year text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger achievements_set_updated_at
before update on public.achievements
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Media metadata (files live in Supabase Storage)
-- ---------------------------------------------------------------------------

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null default '',
  mime_type text not null default '',
  file_size bigint not null default 0 check (file_size >= 0),
  created_at timestamptz not null default now()
);

create index media_assets_created_at_idx on public.media_assets (created_at desc);

-- ---------------------------------------------------------------------------
-- Contact inquiries (private)
-- ---------------------------------------------------------------------------

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (position('@' in email) > 1),
  subject text not null check (char_length(trim(subject)) between 3 and 160),
  message text not null check (char_length(trim(message)) between 20 and 4000),
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contact_inquiries_status_created_idx
  on public.contact_inquiries (status, created_at desc);

create trigger contact_inquiries_set_updated_at
before update on public.contact_inquiries
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Site settings (navigation, SEO defaults, contact details)
-- ---------------------------------------------------------------------------

create table public.site_settings (
  key text primary key check (char_length(trim(key)) > 0),
  value jsonb not null,
  -- Only settings explicitly marked public are readable by anonymous visitors.
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Privileges
-- RLS decides row access; grants decide whether a role may attempt the action
-- at all. Anonymous visitors receive read access only.
-- ---------------------------------------------------------------------------

grant select on
  public.profiles,
  public.categories,
  public.technologies,
  public.projects,
  public.project_categories,
  public.project_technologies,
  public.posts,
  public.experiences,
  public.skill_groups,
  public.skills,
  public.services,
  public.education,
  public.certifications,
  public.achievements,
  public.media_assets,
  public.site_settings
to anon, authenticated;

grant insert, update, delete on
  public.profiles,
  public.categories,
  public.technologies,
  public.projects,
  public.project_categories,
  public.project_technologies,
  public.posts,
  public.experiences,
  public.skill_groups,
  public.skills,
  public.services,
  public.education,
  public.certifications,
  public.achievements,
  public.media_assets,
  public.site_settings
to authenticated;

grant select, update, delete on public.contact_inquiries to authenticated;

-- Inquiries are written only by the server-side contact route using the
-- service-role key. No insert privilege is granted to anon/authenticated.
revoke insert on public.contact_inquiries from anon, authenticated;

grant select on public.admin_users to authenticated;

-- ===== 20261023120100_rls_policies.sql =====

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

-- ===== 20261023120200_storage.sql =====

-- Storage bucket for project covers, article covers, profile media, and the
-- résumé PDF. Uploads and deletions are administrator-only; reads are public
-- because every published page needs the assets.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads media objects" on storage.objects;
create policy "Public reads media objects"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

drop policy if exists "Administrator uploads media objects" on storage.objects;
create policy "Administrator uploads media objects"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Administrator updates media objects" on storage.objects;
create policy "Administrator updates media objects"
on storage.objects
for update
to authenticated
using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Administrator deletes media objects" on storage.objects;
create policy "Administrator deletes media objects"
on storage.objects
for delete
to authenticated
using (bucket_id = 'media' and public.is_admin());
