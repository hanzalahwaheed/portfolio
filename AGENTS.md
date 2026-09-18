# AGENTS.md

This file provides guidance to agentic coding assistants working in this repository.

## Overview

A personal **portfolio + blog CMS**. TanStack Start handles both frontend and backend (SSR pages, server functions, API routes), deployed to **Cloudflare Workers** via Nitro, with **Cloudflare D1 + Drizzle ORM** for storage. The blog has a cookie-gated admin area for authoring/editing posts. Image uploads write local static assets for inclusion in a later deployment.

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
npm run db:pull      # Replace local Post rows with the remote export
```

There is no general test runner. Run `node --import tsx --test scripts/hero-refresh.test.ts` for the focused hero tests. Run lint and build when the change can affect the full app, and use `npm run dev` for the relevant manual path. Local migration work does not authorize remote migration, deployment, or other production release work.

## Architecture

**Stack:** TanStack Start (file-based routing via `@tanstack/react-router`), React 19, Vite 8, Tailwind v4, Drizzle ORM on Cloudflare D1, deployed as a Cloudflare Worker module through Nitro.

### Routing (`src/routes/`)

File-based routes compile into `src/routeTree.gen.ts` (generated and tracked — never edit by hand; ESLint ignores it). Route entry is `src/router.tsx`; the document shell is `src/routes/__root.tsx`. Dotted filenames map to path segments: `blogs.$slug.tsx` → `/blogs/:slug`, `admin.edit.$id.tsx` → `/admin/edit/:id`. Bracketed literal dots like `sitemap[.]xml.ts` produce `/sitemap.xml`.

Two kinds of route files:

- **Page routes** use `createFileRoute(...)({ loader, head, component })`. Data is fetched in `loader` (calling a server fn) and read in the component via `Route.useLoaderData()`. `head` sets meta/links per route.
- **API / non-HTML routes** (`api.upload.ts`, `sitemap[.]xml.ts`, `*-image.ts`, `robots[.]txt.ts`) use `createFileRoute(...)({ server: { handlers: { GET/POST: async ({ request }) => Response } } })` and return a raw `Response`.

### Server functions (the core data-access pattern)

Server-only logic lives in `src/lib/*.ts` as `createServerFn({ method })` definitions (see `src/lib/blogs.ts`). Conventions:

- Validate input with `.inputValidator(...)`, implement in `.handler(async ({ data }) => ...)`.
- Server fns can be called from loaders (SSR) or client code; they always run on the server.
- Blog create and update clear caches then `throw redirect({ to: "/admin" })`; delete returns `{ ok: true }`, and its caller invalidates the router.

### Auth (admin-only mutations)

Cookie-based, key gated by the `ADMIN_KEY` env var. Split across two files by execution context:

- `src/lib/admin-auth.server.ts` — server-only helpers using `@tanstack/react-start/server` (`getCookie`/`setCookie`/`getRequest`). `verifyAdminFromRequestUrl()` accepts `?key=` and sets the `admin-key` cookie; `requireAdmin()` redirects to `/` if unauthorized; `requireAdminForMutation()` throws `Unauthorized`.
- `src/lib/admin-auth.ts` — exports `ensureAdmin`, a thin server fn wrapper.

Every admin server fn / API handler **dynamically imports** the `.server` helper inside the handler (e.g. `const { requireAdmin } = await import("@/lib/admin-auth.server")`) so server-only code never leaks into client bundles. Follow this pattern for any new admin-gated work.

### Database (`src/db/`)

`src/db/index.ts` exports a singleton `db` using Drizzle's D1 driver and the Cloudflare Worker `DB` binding. The binding is configured in the root `wrangler.jsonc`. `src/db/schema.ts` defines the `posts` table mapped to the SQLite table name `Post`. IDs are uuidv7 strings generated in app code, not by the DB.

Use Drizzle's SQLite core for schema changes:

- `sqliteTable` from `drizzle-orm/sqlite-core`
- `text(...)` for strings
- `integer(..., { mode: "boolean" })` for booleans
- `integer(..., { mode: "timestamp" })` for dates

After changing schema, run `npm run db:generate`, then apply locally with `npm run db:migrate`. `npm run db:migrate:prod` changes remote state and belongs to an explicitly authorized production release.

The production D1 database is `portfolio-db`, bound as `DB`. Local dev uses the **local** D1 database in `.wrangler/state`, so `npm run dev` starts without a Cloudflare remote connection. `npm run db:pull` applies local migrations, then deletes and imports local `Post` rows from the remote export; treat it as a local replacement operation.

### Other libs

- `src/routes/api.upload.ts` — validates uploads and writes them to `public/images/blogs` on the local filesystem. It works in local development but cannot write in the deployed Worker's read-only filesystem. `src/lib/r2.ts` is an unused S3-compatible R2 upload helper; do not describe the current route as R2-backed without integrating it.
- `src/lib/cache.ts` — thin wrapper over the Workers Cache API (`caches.default`). It is a no-op in dev, where `caches` does not exist.
- `src/lib/github/` — GitHub Search API client behind `/api/github-latest-contributions`. The Search API allows 10 requests per minute per IP without a token and 30 with one, so set the optional `GITHUB_TOKEN` env var (a PAT that needs public read access only). The route caches each result for an hour in memory and for a day in the Workers cache, and it serves the stale copy — or an empty list, which makes the client fall back to `ossContributions` in `src/config.ts` — when GitHub fails.
- `src/lib/fonts.ts` — class-name objects for `instrumentSerif`, `newsreader`, and `uiSans`; matching font classes are in `src/styles.css`.
- `src/config.ts` — primary static portfolio content (personal details, socials, fallback OSS contributions, work experience, builds, books), not all site content.
- `src/components/app-image.tsx` / `app-link.tsx` — replacements for `next/image` and `next/link`; use these instead of Next equivalents.

### Cache and prepaint invariants

Public blog reads use Workers Cache. Any blog create, update, or delete must invalidate both summary keys and every affected slug key, including the old slug after a rename.

The root document runs `heroInitScript` in the head before hydration and then exposes styles for every hero. Preserve its behavior: select a safe stored index or `0`, always set `data-hero` even if storage fails, and persist the next index when possible. `scripts/hero-refresh.test.ts` covers these cases.

## Conventions

- **Path aliases:** `@/*` and `#/*` both map to `src/*`. Use `@/` in imports (e.g. `@/lib/utils`, `@/components/ui`). No relative imports from parent dirs.
- **Prettier** (`.prettierrc`): no semicolons, double quotes, trailing commas, arrow parens avoided, 2-space, print width 120, LF.
- **Components:** Shadcn UI ("new-york" style) is in `src/components/ui`; merge classes with `cn()` from `@/lib/utils`. Component names are PascalCase, while files are commonly kebab-case; follow each module's established default or named export style.
- **Custom Tailwind colors:** `rich-black`, `olive-grey`, `turquoise`, `deep-teal`, and `cream`; `src/styles.css` also defines paper, brass, faint, and hero tokens.
- `@typescript-eslint/no-explicit-any` is **off**, but prefer real types.
- Do not add comments unless asked.

## Skill routing

Repository skills live in `.agents/skills`; the existing Claude/OpenCode paths link to these canonical copies. Use `.agents/skills/deploy/SKILL.md` for releases. Preserve the Vite/Nitro-to-Workers pipeline when using Cloudflare skills. Use the repository's `vercel-react-best-practices` for React work; its compatibility guidance takes precedence over generic Next.js examples.

For bugs and review, default to one focused `diagnosing-bugs` or `code-review` pass instead of duplicate skill runs. Use a focused `better-*` skill for a specific concern, `better-interface` for a broad UI pass, and `frontend-design` only for intentional redesign. Use `web-design-guidelines` for UI/UX audits. `web-perf` requires its measurement tools: if unavailable, continue meaningful lint, build, and manual checks and do not claim metrics were measured.
