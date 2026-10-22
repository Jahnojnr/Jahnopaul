# Jahno Paul

Editorial personal portfolio built with Next.js App Router, TypeScript, and Tailwind CSS.

This repository is being built in phases. The current milestone is the public foundation: design system, shared layout, homepage, project case studies, and remaining public routes with typed sample content. Supabase, the admin dashboard, and Vercel production wiring come after this frontend is verified.

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
