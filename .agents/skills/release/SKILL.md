---
name: release
description: Release this portfolio in one pass — commit, push, and deploy to Cloudflare Workers — when the user says release, ship it, commit push deploy, deploy, or commit and push.
---

# Release: commit, push, deploy

One pass over the working tree: validate, commit, push, deploy. A request for `commit push deploy` (or "ship it") authorizes all three — don't stop to ask between steps. Do only the steps asked for: "commit and push" ends at the push, "deploy" alone starts at the build.

## 1. Commit

- Read `git status --short` and `git diff` first. Uncommitted work is normally all in scope.
- Stage explicit paths (`git add <path> ...`); never `git add -A` or `git add .`. Leave untracked local files alone, such as `.claude/launch.json`, and never revert the user's edits.
- One commit per logical change, Conventional Commit style — `feat(footer): ...`, `style(github): ...`, `fix(hydration): ...`. Describe the change, not the process. The skill itself is normal content; don't exclude `.agents/skills` or `.claude/skills`.
- Pre-commit hooks may print React Doctor warnings. They are advisory: ignore findings in code you didn't touch and don't fold unrelated cleanup into the release.

## 2. Push

```bash
git push origin main
git rev-list --left-right --count origin/main...HEAD   # expect: 0	0
```

Push `main` only when it is the checked-out branch; otherwise push the current branch. Stop and report if the push is rejected.

## 3. Deploy

Only deploy from a committed tree. If every change went into the commits, build and deploy in place:

```bash
git diff --check && npm run lint && npm run build
npx wrangler deploy
```

If the user asked to ship only part of the work, build in a throwaway worktree at `HEAD` instead (symlink `node_modules`, copy `.env`, then build and deploy there) so leftover edits can't leak into the release, and remove the worktree afterwards.

`vite.config.ts` drives Nitro's `cloudflare-module` preset and `npm run build` generates the Wrangler deploy config; `wrangler.jsonc` stays the binding and migration source. Never add a root Worker entrypoint to bypass Nitro. Deploy the tree you just built — never a rebuild, never a dirty checkout.

Report the URL and Version ID from the deploy output, then check the site:

```bash
curl -s -o /dev/null -w "status=%{http_code}\n" <deployed-url>
```

If the release touches the hero flow, also run `node --import tsx --test scripts/hero-refresh.test.ts`.

## Out of scope unless asked

- `npm run db:migrate:prod` — only when the release contains the matching schema migration and production migration was requested.
- `npm run db:pull` — never as a release step; it clears and reloads the local `Post` table.
- Uploaded images under `public/images/blogs` are served from the build, not R2; make sure new files are committed before deploying.
