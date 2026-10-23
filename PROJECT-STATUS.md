# Personal Portfolio Platform — Project Status

Inspected and extended in this workspace on 23 October 2026. This records what exists in the repository versus the agreed specification.

**Where building is now:** Phase 3 (database and admin) is implemented and verified in code — schema, RLS, storage, Supabase Auth, the protected dashboard, and CRUD for the main content types. The public site still renders from typed sample content; switching public pages onto the database is the next milestone. A Vercel production deployment and automated tests remain unverified.

---

## 1. Project info

| Item | Value |
| --- | --- |
| Product | Full-stack personal portfolio for Jahno Paul: public editorial site plus a single-admin CMS |
| Package name | `personal-portfolio` `0.1.0` |
| Remote | [https://github.com/Jahnojnr/Jahnopaul](https://github.com/Jahnojr/Jahnopaul) |
| Architecture | Modular monolith (one Next.js app) |
| Content source today | Typed TypeScript modules in `src/lib/data/` for public pages; PostgreSQL for the dashboard |
| Intended content source | Supabase PostgreSQL + Storage, managed from `/admin` |

### Stack installed

| Layer | Installed |
| --- | --- |
| Framework | Next.js **16.4.2** App Router, Turbopack, Cache Components + Partial Prefetching |
| UI runtime | React **19.3.0** |
| Language | TypeScript 5, strict |
| Styling | Tailwind CSS **4** |
| Database and auth | `@supabase/supabase-js` 2.118, `@supabase/ssr` 0.12 |
| Validation | `zod` 4.6 |
| Tooling | ESLint 9, React Compiler, self-hosted fonts via `next/font/local` |

Email delivery calls Resend's HTTP API with `fetch`; no SDK was added.

---

## 2. What is done

### Foundation (Phase 1)

- App Router + TypeScript, design tokens in `src/app/globals.css`
- Public route group `(public)` with header, footer, mobile menu, skip link
- Reusable UI primitives, custom 404, sitemap, robots, per-page metadata
- Fonts self-hosted in `public/fonts` (Newsreader, Source Sans 3) so builds never depend on Google Fonts

### Public portfolio (Phase 2)

All public routes render: home, about, projects (+ directory with search and filters), projects/[slug], writing, writing/[slug], experience, skills, services, education, achievements, résumé (print), contact, uses, now, privacy. Listings filter on `status === "published"`.

### Database and admin (Phase 3) — new

**Schema** (`supabase/migrations/`)

- Enums `content_status` (`draft | published | archived`) and `inquiry_status`
- Tables: `profiles`, `projects`, `categories`, `project_categories`, `technologies`, `project_technologies`, `posts`, `experiences`, `skill_groups`, `skills`, `services`, `education`, `certifications`, `achievements`, `media_assets`, `contact_inquiries`, `site_settings`, `admin_users`
- UUID keys, unique slugs, foreign keys with cascade, indexes on status/slug/publication date, check constraints, `updated_at` triggers, and a trigger that stamps `published_at` on first publication
- Storage bucket `media` with size and MIME limits

**Security**

- RLS enabled on every table
- Anonymous read access limited to published projects and posts, their join rows, public reference content, and `is_public` settings
- Administrator checks via `public.is_admin()` (security definer) plus an email allowlist for bootstrap
- Inquiries: no anonymous insert grant; the contact route writes with the service-role key after validation
- `src/proxy.ts` refreshes the Supabase session for `/admin` traffic; it grants nothing
- Data access layer in `src/server/auth.ts`: `requireAdmin()` for pages, `requireAdminForAction()` for every mutation

**Dashboard** (`/admin`)

- Sign-in, sign-out, protected layout with navigation, preview-mode banner
- Overview: published/draft counts, new inquiries, recent inquiries, unpublished work
- Projects: list with status filter, search, pagination; create, edit, publish, unpublish, feature, delete; slug generation and validation; draft/published/archived states
- Writing: equivalent article CRUD
- Experience, services, education, achievements: list, create, edit, delete with ordering
- Skills: skill groups with ordered skill lists, edited in place
- Media: upload with required alt text, library with previews, delete
- Inquiries: filter by status, read messages, update status, reply by email, delete
- Settings: profile, biography, social link, résumé/avatar paths, default SEO description
- Forms: validation feedback, pending states, unsaved-change warning, destructive-action confirmation, empty states, success and error messages

**Contact**

- `POST /api/contact` with Zod validation, honeypot, salted per-connection rate limiting (5 per 10 minutes), Supabase storage, optional Resend notification
- Public form posts to the endpoint and reports server-side field errors

**Development preview**

- `ADMIN_PREVIEW_MODE=true` gives a read-only dashboard tour using sample content. It is disabled in production, disabled whenever Supabase is configured, and every mutation is refused.

### Verification in this workspace

| Check | Result |
| --- | --- |
| `npm run lint` | Passes |
| `npm run typecheck` | Passes |
| `npm run build` | Passes; 53 routes generated |
| Public routes (dev server) | 200 |
| `/admin` without a session | 307 to `/admin/login` |
| Admin routes with a preview session | 200 |
| Contact API, invalid payload | 422 with field errors |
| Contact API, valid payload, unconfigured channel | 503 with a clear message |

Not verified: anything that needs a live Supabase project — sign-in, RLS behaviour, CRUD persistence, storage uploads, email delivery.

---

## 3. Gaps versus the spec

### Planned next

1. **Move the public site onto Supabase.** Public projects and posts still read sample data. The data access seam (`src/server/projects.ts`, `src/server/posts.ts`) already exists; public readers need cached queries (`use cache` + `cacheTag`) and revalidation after publish.
2. **Profile, experience, skills, services, education, achievements on the public site** currently read `src/lib/data/profile.ts`; the tables exist and the dashboard edits them.
3. **Certifications and navigation** have tables but no dashboard screens yet.
4. **Résumé and project/cover images** need real uploads; covers are still typographic plates.
5. **Replace illustrative sample content** with verifiable project outcomes, employment dates, and biography.
6. **Tests** — no automated test suite yet. Priority: contact validation, `is_admin()`/RLS policy tests, slug validation, publish/unpublish visibility.
7. **Vercel deployment** — not yet verified in this workspace (no `vercel.json`, no confirmed production URL).

### Known limitations

- Rate limiting is in-memory, so it is per instance. A shared store is needed at scale.
- Contact inquiries are written with the service-role key; the route path is the control. Keep the key server-only.
- The dashboard supports one administrator by design.
- `/admin/writing` lists articles; there is no side-by-side preview yet.
- `settings` exposes environment status read-only; navigation and SEO defaults are not yet fully editable.

---

## 4. Definition of done (still open)

- All public routes render from the database, not sample data
- Drafts and archived content are unreachable publicly (application + RLS verified against a live project)
- Admin routes and mutations enforce server-side authorisation (verified in code; needs a live test)
- CRUD, media uploads, and publishing verified end to end
- Contact submissions validated, rate-limited, stored, emailed, admin-only
- Accessibility, performance, and mobile review
- Lint, types, build, and an automated test suite pass
- No privileged keys in the client bundle
- Live `vercel.app` deployment tested
- Backup and maintenance procedure documented
