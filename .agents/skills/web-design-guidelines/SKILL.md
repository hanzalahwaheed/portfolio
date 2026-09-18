---
name: web-design-guidelines
description: Review a web interface for actionable design, usability, and accessibility issues using the current Web Interface Guidelines. Use for requested UI, UX, accessibility, or design-best-practice reviews.
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review the requested interface against the current primary source:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use an available web-fetching capability to retrieve that source at review time. If fresh retrieval is unavailable, say so and avoid presenting the review as current-guideline compliance.

Infer the review target from the request when it identifies a file, component, route, page, or visible screen. For a route or screen, inspect the route entry plus the components and styles that directly determine that interface. Ask for a target only when the request provides no usable scope.

Report concrete findings only. Give each finding a precise `file:line` location when source code is available, explain the user-facing impact, and suggest a focused correction. Follow any output requirements supplied by the fetched guidelines. Do not pad the review with generic praise or turn clear scope into a clarification round.
