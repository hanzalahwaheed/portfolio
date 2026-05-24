import { getCookie, getRequest, setCookie } from "@tanstack/react-start/server"
import { redirect } from "@tanstack/react-router"

export const ADMIN_COOKIE_NAME = "admin-key"

export function verifyAdminFromRequestUrl() {
  const adminKey = process.env.ADMIN_KEY

  if (!adminKey) {
    console.warn("ADMIN_KEY environment variable is not set!")
    return false
  }

  const request = getRequest()
  const url = new URL(request.url)
  const key = url.searchParams.get("key")
  const cookieKey = getCookie(ADMIN_COOKIE_NAME)

  if (key && key === adminKey) {
    setCookie(ADMIN_COOKIE_NAME, key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })
    return true
  }

  return cookieKey === adminKey
}

export function verifyAdmin() {
  const adminKey = process.env.ADMIN_KEY

  if (!adminKey) {
    console.warn("ADMIN_KEY environment variable is not set!")
    return false
  }

  return getCookie(ADMIN_COOKIE_NAME) === adminKey
}

export function requireAdmin() {
  if (!verifyAdminFromRequestUrl()) {
    throw redirect({ to: "/" })
  }
}

export function requireAdminForMutation() {
  if (!verifyAdmin()) {
    throw new Error("Unauthorized")
  }
}
