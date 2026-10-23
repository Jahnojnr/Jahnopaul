# Personal Portfolio Platform — Project Status

Inspected from this workspace on 23 October 2026. This is the current-state document for building in Cursor. The agreed specification remains the architecture, routes, schema, security, and phased plan already defined; this file records what exists in the repository versus that plan.

**Where building stopped:** after the public frontend with typed sample content (end of Phase 2). The last code commit is `95a641f` (`update`, 23 Oct 2026). GitHub is connected. Supabase, the admin dashboard, contact delivery, SEO files, tests, and a verified Vercel production URL are not started.

---

## 1. Project info

| Item | Value |
| --- | --- |
| Product | Full-stack personal portfolio for Jahno Paul: public editorial site plus a future single-admin CMS |
| Local folder | `c:\Users\jahno\OneDrive\Documents\Jahnopaul` |
| Package name | `personal-portfolio` `0.1.0` |
| Git | `main`, clean working tree, tracking `origin/main` |
| Remote | [https://github.com/Jahnojnr/Jahnopaul](https://github.com/Jahnojnr/Jahnopaul) |
| Commits | `bb34d6f` Create Next App (22 Oct 2026) → `95a641f` public site implementation (23 Oct 2026) |
| Architecture | Modular monolith (one Next.js app). Public and admin are meant to share this codebase; only the public half exists |
| Content source today | Typed TypeScript modules in `src/lib/data/` (not PostgreSQL) |
| Intended content source | Supabase PostgreSQL + Storage, managed from `/admin` |

### Stack in the repo (installed)

| Layer | Installed |
| --- | --- |
| Framework | Next.js **16.4.2** App Router |
| UI runtime | React **19.3.0** |
| Language | TypeScript 5 |
| Styling | Tailwind CSS **4** (`@tailwindcss/turbopack`) |
| Tooling | ESLint 9, `eslint-config-next`, React Compiler |

### Stack in the spec (not installed yet)

Zod (as an app dependency), shadcn/ui, Motion for React, React Hook Form, `@supabase/supabase-js`, Resend. Zod appears only as a transitive Next.js dependency; do not treat that as project validation.

### Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`

---

## 2. What has been done

Phase 1 (foundation) and Phase 2 (public portfolio on sample data) are substantially implemented. That matches README: *“The current milestone is the public foundation… Supabase, the admin dashboard, and Vercel production wiring come after this frontend is verified.”*

### Foundation

- Next.js App Router + TypeScript project initialized
- Design tokens in `src/app/globals.css`: warm ivory/paper, charcoal text, muted grey, forest-green accent, Newsreader (serif) + Source Sans 3 (body)
- Root layout fonts, default metadata, focus-visible styles
- Public route group `(public)` with header, footer, mobile menu
- Reusable UI: `Container`, `ButtonLink`, `PageIntro`
- Custom `not-found.tsx`
- `.env.example` with the planned variable names (empty placeholders)
- README describes local development and the phased approach

### Public routes (all present)

| Route | Status |
| --- | --- |
| `/` | Editorial homepage: hero, selected work, profile, expertise, experience, writing, contact CTA |
| `/about` | Biography and values |
| `/projects` | Directory with search + category + technology filters |
| `/projects/[slug]` | Case study (problem / solution / role / outcomes) |
| `/writing` | Article list |
| `/writing/[slug]` | Full article |
| `/experience` | Career timeline |
| `/skills` | Grouped skills |
| `/services` | Engagement options |
| `/education` | Education / training |
| `/achievements` | Milestones |
| `/resume` | On-page résumé + browser print |
| `/contact` | Client form (validate + copy; honeypot field) |
| `/uses` | Tools |
| `/now` | Current focus |
| `/privacy` | Privacy copy (forward-looking for admin/contact) |
| Custom 404 | Implemented |

Primary nav: Home, About, Projects, Writing, Services, Contact. Remaining routes live in the footer.

### Content model (frontend only)

`src/types/content.ts` already uses the planned shapes: `draft | published | archived`, slugs, featured/sort order, project categories and technologies as related objects.

Sample data:

- 4 published featured projects (Curriculum Studio, Ledger Brief, Atelier OS, Field Notes for Builders)
- 3 published articles
- Experience, skills, services, education, achievements, uses, now

Public listings already filter to `status === "published"`.

### SEO (partial)

Most public pages set title, description, and a canonical path via `src/lib/seo/metadata.ts`. Open Graph title/description exist. `metadataBase` is still `http://localhost:3000`.

### Git

The GitHub repository exists and `main` is up to date with origin. Sprint item 6 (create repo and push) is done.

---

## 3. Gaps versus the spec (what is not done)

### Phase 1 leftovers

- First Vercel deployment is **not verified** in this workspace (no `vercel.json`, `metadataBase` is localhost, GitHub homepage URL not confirmed)
- `public/fonts`, `public/images`, `public/icons`, `public/documents/resume.pdf` are not set up; only leftover Create Next App SVGs
- shadcn/ui not added (acceptable until admin forms need it)
- Motion not used (optional; spec says use it only where useful)

### Phase 2 leftovers / quality

- Contact does not POST to a Route Handler; it copies a composed email
- Résumé has no hosted PDF
- Project covers are typographic plates (`CoverPlate`), not real images
- Homepage has no page-level `createPageMetadata` (inherits root defaults)
- Some components are unused: `project-directory.tsx`, `project-summary.tsx`, `post-card.tsx`, `section-heading.tsx`
- Sample projects, outcomes, and biography are **illustrative**. Spec: do not invent client work, metrics, or credentials. Replace with verifiable content before treating the site as a professional record
- No social links on contact/about beyond the form

### Phase 3 — Database and admin (not started)

Missing entirely:

- `supabase/migrations/`, `seed.sql`
- Tables: profiles, projects, categories, project_categories, technologies, project_technologies, posts, experiences, education, certifications, achievements, media_assets, contact_inquiries, site_settings
- RLS policies
- `src/lib/supabase/`, `src/server/`
- Any `/admin` route (login, dashboard, CRUD, media, inquiries, navigation, settings)
- Supabase Auth, Storage uploads, draft/publish/unpublish/archive in a dashboard
- Server Actions with authorization

### Phase 4 — Publishing and discovery (not started)

- `src/app/sitemap.ts`, `src/app/robots.ts`
- Structured data
- Resend / `src/app/api/contact/route.ts`
- Server-side Zod validation, rate limiting
- Search/filter backed by the database

### Phase 5 — Quality and launch (not started)

- `tests/`
- Accessibility / performance / security review
- Preview vs production env split
- Backups, MFA, documented maintenance
- Custom domain (explicitly later)

### Folder blueprint still missing

`src/app/admin/`, `src/app/api/`, `src/components/admin/`, `src/components/ui/` (shadcn), `src/lib/supabase/`, `src/lib/validation/`, `src/lib/security/`, `src/server/`, `supabase/`, `tests/`

---

## 4. Where building stopped (resume here)

Work stopped at the **end of the public sample-data frontend**, before the spec’s “only then integrate Supabase” gate, and before a confirmed production URL.

```
Done ──────────────────────────────────────────●────────── Not done
Create Next App
Design tokens + public layout
All public routes + sample data
GitHub push
                                               ▲
                                    YOU ARE HERE
                                               │
                                               ▼
Verify lint / typecheck / production build
Deploy to Vercel (vercel.app)
Then Phase 3: Supabase schema, RLS, admin
Then Phase 4: email, sitemap, discovery
Then Phase 5: harden and launch
```

### First sprint checklist vs repo

| # | Task | Status |
| --- | --- | --- |
| 1 | Initialize Next.js + TS + App Router + Tailwind + ESLint | Done |
| 2 | Design tokens | Done |
| 3 | Shared layout | Done |
| 4 | Homepage | Done (sample content) |
| 5 | Project directory + case study | Done |
| 6 | GitHub repository | Done |
| 7 | Deploy to Vercel | **Not verified — next shipping step** |
| 8 | Integrate Supabase | **Not started — do not start until 7 is confirmed** |

### Immediate next actions (in order)

1. Run `npm run lint`, `npm run typecheck`, and `npm run build` locally and fix anything that fails.
2. Import the GitHub repo into Vercel, set `NEXT_PUBLIC_SITE_URL` to the `vercel.app` URL, deploy, and smoke-test public routes on mobile and desktop.
3. Point `metadataBase` at the deployed URL (or `NEXT_PUBLIC_SITE_URL`).
4. Swap illustrative sample records for real, verifiable profile and project content when you have it.
5. Only then: Supabase project, migrations, RLS, one admin account, then `/admin` CRUD.

Do not generate the admin dashboard and database in one pass. Follow the spec’s order and verify each milestone.

---

## 5. Definition of done (still open)

The platform is not complete. Homepage quality is not the bar. Remaining for “done”:

- All public routes remain working after data moves to Supabase
- Drafts/archived content never public
- Admin routes and mutations enforce server-side auth
- CRUD, media, publishing work
- Contact submissions validated, rate-limited, stored, emailed, admin-only
- Accessibility, SEO files, lint, types, production build, tests
- No privileged keys in the client
- Live `vercel.app` URL tested
- Setup and maintenance documented
