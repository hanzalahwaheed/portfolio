import { createServerFn } from "@tanstack/react-start"

export const ensureAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server")
  requireAdmin()
  return { ok: true }
})
