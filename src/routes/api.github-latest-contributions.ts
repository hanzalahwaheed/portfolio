import { createFileRoute } from "@tanstack/react-router"
import { githubService } from "@/lib/github/service"
import { Contribution } from "@/lib/github/types"
import { cacheRequest, getCachedJson, putCachedJson } from "@/lib/cache"

const usernamePattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/
const freshTtlMs = 60 * 60 * 1000
const staleMaxAge = 24 * 60 * 60
const freshCacheControl = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
const staleCacheControl = "public, max-age=60"

type CacheEntry = {
  contributions: Contribution[]
  fetchedAt: number
}

const memoryCache = new Map<string, CacheEntry>()
const inFlight = new Map<string, Promise<Contribution[]>>()

function contributionsCacheKey(username: string) {
  return cacheRequest(`/cache/github-contributions/${encodeURIComponent(username)}`)
}

function isFresh(entry: CacheEntry) {
  return Date.now() - entry.fetchedAt < freshTtlMs
}

async function readCache(username: string) {
  const local = memoryCache.get(username)
  if (local && isFresh(local)) return local

  const stored = await getCachedJson<CacheEntry>(contributionsCacheKey(username))
  if (stored && (!local || stored.fetchedAt > local.fetchedAt)) {
    memoryCache.set(username, stored)
    return stored
  }

  return local
}

function fetchContributions(username: string) {
  const pending = inFlight.get(username)
  if (pending) return pending

  const request = githubService
    .getLatestContributions(username)
    .then(async contributions => {
      const entry: CacheEntry = { contributions, fetchedAt: Date.now() }
      memoryCache.set(username, entry)
      await putCachedJson(contributionsCacheKey(username), entry, staleMaxAge)
      return contributions
    })
    .finally(() => {
      inFlight.delete(username)
    })

  inFlight.set(username, request)
  return request
}

function contributionsResponse(contributions: Contribution[], cacheControl: string) {
  return Response.json({ contributions }, { headers: { "Cache-Control": cacheControl } })
}

export const Route = createFileRoute("/api/github-latest-contributions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get("username")

        if (!username) {
          return Response.json({ error: "Username is required" }, { status: 400 })
        }

        if (!usernamePattern.test(username)) {
          return Response.json({ error: "Invalid username" }, { status: 400 })
        }

        const cached = await readCache(username)

        if (cached && isFresh(cached)) {
          return contributionsResponse(cached.contributions, freshCacheControl)
        }

        try {
          const contributions = await fetchContributions(username)
          return contributionsResponse(contributions, freshCacheControl)
        } catch (error) {
          console.error("Error fetching GitHub contributions:", error)

          if (cached) {
            return contributionsResponse(cached.contributions, staleCacheControl)
          }

          return contributionsResponse([], "no-store")
        }
      },
    },
  },
})
