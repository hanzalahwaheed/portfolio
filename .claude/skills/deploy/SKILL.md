---
name: deploy
description: Use when the user wants to ship, deploy, release, or push this portfolio to production (Cloudflare Workers), or says "deploy", "deploy it", "commit and push then deploy", "ship it". Covers committing app changes, pushing to main, building with Vite/Nitro, and deploying with Wrangler.
version: "1.0.0"
---

# Deploy

Ships the portfolio (TanStack Start + Nitro on Cloudflare Workers, D1 + R2) to production.

The full flow is: **commit → push → build → deploy**. Run the steps in order. Only run the steps the user asked for — e.g. "just deploy" skips commit/push.

## 1. Commit (only what belongs in the repo)

Stage tracked changes and any new app source files, but **never** commit local agent tooling:

- Exclude: `.claude/`, `.agents/`, `skills/`, `skills-lock.json`
- Include: everything under `src/`, `public/`, `drizzle/`, config files

```bash
git add -u                          # tracked modifications + deletions
git add src/routes/<new-file>.tsx   # any new app files, explicitly
git status --short                  # confirm tooling dirs stay untracked (??)
```

Write a commit message that honestly describes the change. If the working tree
mixes the requested change with unrelated WIP, say so in the body rather than
mislabeling it. End the message with:

```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

A **React Doctor** pre-commit hook runs and may print "staged regressions" as a
**warning** — the commit still succeeds. Mention the warning to the user and
offer to run `npx react-doctor@latest --staged --fail-on warning` to inspect.
Do not silence or bypass the hook.

## 2. Push

This repo deploys from `main` (personal repo, direct pushes are the norm here):

```bash
git push origin main
```

## 3. Build

```bash
npm run build
```

Vite + Nitro (`cloudflare-module` preset) emit `.output/` plus
`.wrangler/deploy/config.json`. A successful build ends with
"Generated .output/server/wrangler.json".

## 4. Deploy

```bash
npx wrangler deploy
```

Wrangler picks up the generated `.wrangler/deploy/config.json` automatically —
no `main` entry is set in the root `wrangler.jsonc` on purpose. Success prints
the live URL and a Version ID.

- Worker: `hanzalahwaheed-portfolio`
- Live: https://hanzalahwaheed-portfolio.hanzalah-w.workers.dev
- Bindings confirmed at deploy: `env.DB` (portfolio-db, D1), `env.ASSETS`

## Notes

- D1 binding uses `remote: true`, so local dev and prod share the same
  `portfolio-db` database. There is no separate prod DB to migrate during a
  plain deploy. Run `npm run db:migrate:prod` only when schema changed.
- After deploying, report the live URL and the Version ID back to the user.
