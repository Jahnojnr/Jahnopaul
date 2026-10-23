# Jahno Paul — personal portfolio platform

An editorial personal portfolio with a public website and a private, single-administrator content dashboard.

The public site is currently rendered from typed sample content in `src/lib/data`. The database, Row Level Security, authentication, and the admin dashboard are implemented; moving the public pages onto the database is the next milestone.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 App Router (Turbopack, Cache Components) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database and auth | Supabase (PostgreSQL, Auth, Storage) |
| Validation | Zod |
| Email | Resend HTTP API (optional) |
| Hosting | Vercel |

Fonts are self-hosted (`public/fonts`) so the production build never depends on a live Google Fonts request.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and fill in what you need. The site runs without any credentials: public pages use sample content, and `/admin` explains what is missing.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (`https://<ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key — safe in the browser. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is accepted as an alias |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key; server-only, used by the contact route. `SUPABASE_SECRET_KEY` is accepted as an alias. Never expose it |
| `ADMIN_EMAILS` | Comma-separated allowlist of administrator emails (bootstrap access) |
| `ADMIN_PREVIEW_MODE` | Development-only read-only dashboard preview |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact notifications |
| `CONTACT_RATE_LIMIT_SALT` | Salt for contact rate-limit keys |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL used in metadata, sitemap, and auth redirects |

## Supabase setup

### Where the credentials come from

All three values belong to a Supabase project you create; they are not part of
this repository.

1. Sign in at [supabase.com/dashboard](https://supabase.com/dashboard) and
   **New project**. Choose a name, a database password (store it somewhere
   safe), and a region close to you. Free tier is sufficient.
2. Open the project. Click **Connect** at the top of the project page, or go to
   **Settings → API Keys**. Copy:
   - **Project URL** — looks like `https://abcdefghijklmno.supabase.co`
   - **Publishable key** — `sb_publishable_…` on a new project, or the legacy
     **anon** key (`eyJ…`) on an older one
   - **Secret key** — `sb_secret_…`, or the legacy **service_role** key. It sits
     behind a reveal control, and it must never reach the browser.
3. Paste them into `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx   # or the anon eyJ… key
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx            # or the service_role key
   ADMIN_EMAILS=you@example.com
   ```

   Supabase is deprecating the `anon` / `service_role` names during 2026, so
   both spellings are accepted — fill in whichever pair your project shows.

### Apply the database, then create the administrator

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the migrations in order — either with the Supabase CLI (`supabase db push`) or by pasting each file from `supabase/migrations/` into the SQL editor in filename order:
   - `20261023120000_init_schema.sql`
   - `20261023120100_rls_policies.sql`
   - `20261023120200_storage.sql`
3. Optionally run `supabase/seed.sql` for local or preview data. It inserts illustrative content; replace it with verifiable records before treating the site as a professional record.
4. Create the administrator in **Authentication → Users → Add user** (email and
   password; tick *Auto Confirm User* so no confirmation email is needed), then
   authorise that address in either of two ways:
   - set `ADMIN_EMAILS` to that address, or
   - insert a row into `public.admin_users`:

     ```sql
     insert into public.admin_users (user_id, email)
     select id, email from auth.users where email = 'you@example.com';
     ```

     The email allowlist is the bootstrap path; the table is the durable record.
5. Copy the project URL, the publishable key, and the service-role key into `.env.local`.

### Reviewing the dashboard without a database

Start the development server and open `/admin/login`:

```bash
npm run dev
```

Choose **Open read-only preview**. The preview uses sample content, is always
unavailable in production builds, turns itself off once Supabase is configured,
and refuses every mutation. Set `ADMIN_PREVIEW_MODE=false` to hide it.

Inline environment variables such as `ADMIN_PREVIEW_MODE=true npm run dev` work
in bash but not in PowerShell or cmd. Put values in `.env.local` instead — it is
gitignored and read by `next dev` on every platform.

## Routes

### Public

`/` · `/about` · `/projects` · `/projects/[slug]` · `/writing` · `/writing/[slug]` · `/experience` · `/skills` · `/services` · `/contact` · `/education` · `/achievements` · `/resume` · `/uses` · `/now` · `/privacy` · custom 404

### Administration

`/admin/login` · `/admin` · `/admin/projects` (+ new, edit) · `/admin/writing` (+ new, edit) · `/admin/experience` · `/admin/skills` · `/admin/services` · `/admin/education` · `/admin/achievements` · `/admin/media` · `/admin/inquiries` · `/admin/settings`

## Architecture

```
src/
├── app/
│   ├── (public)/          public routes and layout
│   ├── admin/
│   │   ├── login/         sign-in (outside the protected layout)
│   │   └── (dashboard)/   authenticated shell and CRUD routes
│   ├── api/contact/       validated, rate-limited contact endpoint
│   ├── sitemap.ts robots.ts not-found.tsx
├── components/
│   ├── admin/             dashboard UI (forms, tables, navigation)
│   ├── public components  layout, home, projects, writing, contact
├── lib/
│   ├── admin/             dashboard config (collections, preview)
│   ├── data/              typed sample content
│   ├── security/          rate limiting
│   ├── seo/               metadata helpers
│   ├── supabase/          server, admin (service role), env
│   └── validation/        Zod schemas and form parsing
├── server/                server-only data access, auth, email, actions
├── types/                 content and database row types
└── proxy.ts               Supabase session refresh for /admin
supabase/
├── migrations/            schema, RLS, storage
└── seed.sql
```

Rules the code follows:

- Public pages are Server Components; client components exist only for interaction (filters, forms, menus).
- `src/server/**` and `src/lib/supabase/**` are server-only. The service-role client is imported only by the contact route.
- Every Server Action re-checks the administrator session before doing anything. RLS is the second line of defence.
- Draft and archived records are excluded by application queries **and** by RLS policies.

## Security notes

- RLS is enabled on every table. Anonymous visitors can read published content and public settings only.
- Inquiries have no insert grant for anonymous visitors. The contact route writes them with the service-role key after Zod validation, a honeypot check, and rate limiting.
- The rate limiter is in-memory and therefore per instance. Replace `src/lib/security/rate-limit.ts` with a shared store (for example Upstash Redis) if traffic grows.
- Set `ADMIN_EMAILS` to one address. A multi-user role system is intentionally out of scope.
- Enable MFA on the Supabase account and on Vercel.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and out of `NEXT_PUBLIC_*` variables.

## Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add the production environment variables (never commit them).
4. Set `NEXT_PUBLIC_SITE_URL` to the deployed `vercel.app` URL.
5. Apply the migrations to the production database and create the administrator.
6. Smoke-test: published pages, an unpublished draft (must 404), `/admin` without a session (must redirect), a contact submission, and the mobile layout.

## Current status

See `PROJECT-STATUS.md` for the milestone log, what is verified, and what comes next.
