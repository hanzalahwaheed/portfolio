---
name: deploy
description: Release this portfolio to Cloudflare Workers when the user asks to commit, push, deploy, or ship it.
---

# Deploy

Release the TanStack Start portfolio through its Vite/Nitro Cloudflare Workers build. Do only the release actions the user requested. That authorization remains valid for those actions; do not ask again before each command. Get direction before adding a new production action, such as a migration that was not part of the requested release.

## Prepare the release

Inspect the working tree, the staged diff, current branch, and `origin` push URL before changing Git state. Resolve the requested release ref to a commit and distinguish local branches from remote-tracking branches. Determine the files and hunks that belong to the requested release; preserve all unrelated staged and unstaged work.

Stage only the intended paths or hunks with explicit pathspecs or `git add -p`. Do not use blanket staging. If the index already has unrelated staged work, keep it intact and use a temporary checkout or a separate index initialized from the release base commit, then apply only the intended changes. Verify the resulting tree before committing.

When unrelated work would affect a check, build, or deploy, use a temporary isolated worktree for the intended release tree. Keep the original worktree and index untouched; do not clean, reset, or deploy from the dirty tree.

Validate that intended tree before committing or pushing:

```bash
git diff --check
npm run lint
npm run build
```

Fix release-scope failures and rerun the relevant check. Before pushing or deploying, verify that the final release source matches the validated tree. If commit hooks or later edits change build inputs, rerun the affected checks and rebuild. Build output is generated; do not treat it as source for the deployment configuration.

When the release changes the hero flow, run `node --import tsx --test scripts/hero-refresh.test.ts` and manually verify the intended hero before and after hydration, including the relevant desktop or mobile variant.

## Commit and push

Commit only the intended release files with an accurate message. The skill itself is normal repository content: do not blanket-exclude `.agents/skills` or `.claude/skills`.

Before pushing, verify the current branch, `origin` push URL, worktree/index, and the commits that would be sent. Push the checked branch. Directly push `main` only when the checked-out branch is `main` and the user requested that release path; otherwise push the current branch or follow the user’s specified integration path.

## Deploy

`vite.config.ts` is the source of the Cloudflare/Nitro configuration. `npm run build` uses Nitro’s `cloudflare-module` preset and generates the Wrangler deployment config. Keep the root `wrangler.jsonc` as the binding and migration source; do not add a root Worker entrypoint to bypass Nitro’s generated flow.

After a successful final build, deploy from that same release tree, using the isolated worktree when one was needed. A deploy-only request does not require a commit or push:

```bash
npx wrangler deploy
```

Do not deploy the original dirty worktree.

Report the deployment URL and Version ID only when they appear in the deploy output. Then make a basic HTTP request to the deployed URL and report its status or failure.

## Data and uploads

Run `npm run db:migrate:prod` only when this release includes the corresponding schema migration and production migration is within the user’s requested scope. Do not run `npm run db:pull` as a release prerequisite: it clears and reloads the local `Post` table.

The current image upload route writes files under `public/images/blogs` when run locally. It does not upload to R2, and deployed Workers have a read-only filesystem. For a release that includes uploaded images, ensure those static files are intentionally version-controlled and included in the release.
