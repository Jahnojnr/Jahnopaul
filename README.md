# Jahno Paul

Editorial personal portfolio built with Next.js App Router, TypeScript, and Tailwind CSS.

This repository is being built in phases. The public foundation is in place: design system, shared layout, homepage, project case studies, remaining public routes, sitemap, and robots. Next: verify a Vercel deployment, then add Supabase and the admin dashboard. Sample content in `src/lib/data` is illustrative until it is replaced with verified records.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` when backend services are introduced. Do not commit secrets. `SUPABASE_SERVICE_ROLE_KEY` is server-only.

## Content

Public pages currently read typed sample data from `src/lib/data`. That data will be replaced by Supabase after the schema and RLS policies are in place.
