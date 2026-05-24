# AGENTS.md

This file provides guidance to agentic coding assistants working in this repository.

## Overview

A personal **portfolio + blog CMS**. TanStack Start handles both frontend and backend (SSR pages, server functions, API routes), deployed to **Cloudflare Workers** via Nitro, with **Cloudflare D1 + Drizzle ORM** for storage. The blog has a cookie-gated admin area for authoring/editing posts and uploading images to R2.

## Commands

```bash
npm run dev          # Vite dev server on port 3000
npm run build        # Vite production build (Nitro → Cloudflare module)
npm run start        # vite preview
npm run lint         # ESLint (flat config, eslint.config.mjs)
npm run format       # Prettier write

npm run db:generate  # Generate migrations
npm run db:migrate   # Apply D1 migrations locally
npm run db:migrate:prod # Apply D1 migrations to the remote Cloudflare database
npm run db:studio    # List local D1 tables
npm run db:introspect # List remote D1 tables
npm run db:verify    # Count rows in the remote Post table
npm run db:verify:local # Count rows in the local Post table
```

No test framework is configured. Verify changes manually with `npm run dev`.

## Architecture

**Stack:** TanStack Start (file-based routing via `@tanstack/react-router`), React 19, Vite 8, Tailwind v4, Drizzle ORM on Cloudflare D1, deployed as a Cloudflare Worker module through Nitro.

### Routing (`src/routes/`)

File-based routes compiled into `src/routeTree.gen.ts` (generated — never edit by hand; it's gitignored from lint). Route entry is `src/router.tsx`; the document shell is `src/routes/__root.tsx`. Dotted filenames map to path segments: `blogs.$slug.tsx` → `/blogs/:slug`, `admin.edit.$id.tsx` → `/admin/edit/:id`. Bracketed literal dots like `sitemap[.]xml.ts` produce `/sitemap.xml`.

Two kinds of route files:

- **Page routes** use `createFileRoute(...)({ loader, head, component })`. Data is fetched in `loader` (calling a server fn) and read in the component via `Route.useLoaderData()`. `head` sets meta/links per route.
- **API / non-HTML routes** (`api.upload.ts`, `sitemap[.]xml.ts`, `*-image.ts`, `robots[.]txt.ts`) use `createFileRoute(...)({ server: { handlers: { GET/POST: async ({ request }) => Response } } })` and return a raw `Response`.

### Server functions (the core data-access pattern)

Server-only logic lives in `src/lib/*.ts` as `createServerFn({ method })` definitions (see `src/lib/blogs.ts`). Conventions:

- Validate input with `.inputValidator(...)`, implement in `.handler(async ({ data }) => ...)`.
- Server fns can be called from loaders (SSR) or client code; they always run on the server.
- After a successful mutation, `throw redirect({ to: "..." })` from `@tanstack/react-router`.

### Auth (admin-only mutations)

Cookie-based, key gated by the `ADMIN_KEY` env var. Split across two files by execution context:

- `src/lib/admin-auth.server.ts` — server-only helpers using `@tanstack/react-start/server` (`getCookie`/`setCookie`/`getRequest`). `verifyAdminFromRequestUrl()` accepts `?key=` and sets the `admin-key` cookie; `requireAdmin()` redirects to `/` if unauthorized; `requireAdminForMutation()` throws `Unauthorized`.
- `src/lib/admin-auth.ts` — exports `ensureAdmin`, a thin server fn wrapper.

Every admin server fn / API handler **dynamically imports** the `.server` helper inside the handler (e.g. `const { requireAdmin } = await import("@/lib/admin-auth.server")`) so server-only code never leaks into client bundles. Follow this pattern for any new admin-gated work.

### Database (`src/db/`)

`src/db/index.ts` exports a singleton `db` using Drizzle's D1 driver and the Cloudflare Worker `DB` binding. The binding is configured in `vite.config.ts` under Nitro's generated Wrangler config. `src/db/schema.ts` defines the `posts` table mapped to the SQLite table name `Post`. IDs are uuidv7 strings generated in app code, not by the DB.

Use Drizzle's SQLite core for schema changes:

- `sqliteTable` from `drizzle-orm/sqlite-core`
- `text(...)` for strings
- `integer(..., { mode: "boolean" })` for booleans
- `integer(..., { mode: "timestamp" })` for dates

After changing schema, run `npm run db:generate`, then apply locally with `npm run db:migrate` and remotely with `npm run db:migrate:prod`.

The production D1 database is `portfolio-db`, bound as `DB`. Local dev also uses the remote D1 database because `wrangler.jsonc` sets the D1 binding's `remote` flag to `true`.

### Other libs

- `src/lib/r2.ts` — uploads to Cloudflare R2 via the S3 SDK (used by `api.upload.ts`).
- `src/lib/fonts.ts` — local Google Sans (from `src/fonts/`) + Instrument Serif font objects exposing `.variable` / `.className`.
- `src/config.ts` — **all site content** (personal details, socials, OSS contributions, work experience, builds, books). Edit here to change displayed content.
- `src/components/app-image.tsx` / `app-link.tsx` — replacements for `next/image` and `next/link`; use these instead of Next equivalents.

## Conventions

- **Path aliases:** `@/*` and `#/*` both map to `src/*`. Use `@/` in imports (e.g. `@/lib/utils`, `@/components/ui`). No relative imports from parent dirs.
- **Prettier** (`.prettierrc`): no semicolons, double quotes, trailing commas, arrow parens avoided, 2-space, print width 120, LF.
- **Components:** Shadcn UI ("new-york" style) in `src/components/ui`; merge classes with `cn()` from `@/lib/utils`. PascalCase component = default export = filename.
- **Custom Tailwind colors:** `rich-black`, `olive-grey`, `turquoise`, `deep-teal`, `cream`.
- `@typescript-eslint/no-explicit-any` is **off**, but prefer real types.
- Do not add comments unless asked.
