# MPG Event Planner

Next.js + Supabase Cloud website and CMS for MPG Event Planner in Cambodia.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase Cloud PostgreSQL, Auth, Storage, and Row Level Security
- Supabase SSR session handling and Next.js Server Actions
- Google Cloud Translation called server-side with cached results

## Application areas

- Public English, Khmer, and Simplified Chinese site: home, about, services, projects, blog, contact, privacy
- Admin CMS: `/admin`, services, projects, blog, quotations, media, and settings
- Published content is public; drafts, quotations, translation cache, settings, and media writes are admin-only
- Public quotation submissions are validated server-side and protected by RLS and a honeypot/rate guard

## Environment

Copy `.env.example` into the deployment environment and provide:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_CLOUD_CREDENTIALS_JSON
```

Google credentials and any service-role key used by one-time migration scripts are server-only and must never be exposed to the browser or committed.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

The production backend is hosted Supabase Cloud. No local database, Docker Supabase stack, PHP runtime, Composer, or Laravel process is required at runtime.

## Supabase migrations

Migrations live in `supabase/migrations/`. Link this repository to the intended hosted project, review the SQL, then apply it with the Supabase CLI. Do not run `supabase start` for this project.

After the schema exists, generate the typed database definition from the linked project:

```bash
supabase gen types typescript --linked > lib/database.types.ts
```

The one-time legacy importer is `scripts/import-legacy.mjs`. It retains legitimate content and skips obvious test quotations; it requires a temporary server-side service-role key and must be run only against the intended hosted project.

The old Laravel tree is retained temporarily only until the hosted import is completed, verified, and safely removed.
