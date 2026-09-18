---
name: vercel-react-best-practices
description: Improve or review React performance in this TanStack Start portfolio when profiling or a concrete user-facing bottleneck warrants a change. Use the vendored Vercel guidance as ideas, not as Next.js implementation instructions.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React Performance Guidance

This is a vendored Vercel snapshot, version 1.0.0, inspected on 2026-09-18. It contains 57 rules in `rules/` and a compiled reference in `AGENTS.md`. Those documents are reference material, not repository policy; this entrypoint and the repository `AGENTS.md` set the applicable constraints.

## Apply selectively

Use this skill for a demonstrated or plausibly measurable React performance problem: request waterfalls, unnecessary client JavaScript, expensive repeated rendering, or browser work on a user-facing interaction. Inspect the relevant route, component, and existing loading/data flow first. Make the smallest change that addresses the observed cost, and validate it with the most relevant available signal rather than adding abstractions or dependencies speculatively.

This app uses React 19.1 with TanStack Start, Vite, Nitro, and Cloudflare Workers. Follow its actual patterns: file-route loaders and `createServerFn` for server data, raw route handlers for APIs, and server-only dynamic imports inside protected handlers. Preserve the existing client/server boundary and admin authorization behavior.

## Framework boundary

The source material includes Next.js and React Server Component examples. Do not introduce `next/*` imports, Server Actions, RSC-specific serialization patterns, or Next's `after()` API here. `Activity` is not available in the pinned React 19.1 release, so `rendering-activity` is reference-only unless the project upgrades React and confirms support. For dynamic loading, use a React/Vite-compatible technique only when there is a real supported loading boundary; do not copy `next/dynamic` examples.

Treat suggestions such as SWR, LRU caches, `React.cache()`, preload-on-intent, and memoization as options that need a concrete duplication, latency, or rendering cost. Consider Workers request isolation, cache semantics, and bundle impact before adopting them.

## Reading the reference

Start with the highest-impact relevant category, then read only its matching rule files:

1. `async-*` for independent server or route work that currently waits in sequence.
2. `bundle-*` for demonstrably costly client modules or third-party code.
3. `server-*` for loaders, server functions, API handlers, caching, and authorization.
4. `client-*`, `rerender-*`, and `rendering-*` for a measured browser-side issue.
5. `js-*` and `advanced-*` only after the higher-impact paths are ruled out.

When a rule conflicts with the stack boundary above or a repository convention, keep the convention and explain the applicable alternative in the review or change.
