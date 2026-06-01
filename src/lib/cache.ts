const cacheOrigin = "https://hanzalahwaheed-portfolio.hanzalah-w.workers.dev"

function getDefaultCache() {
  if (typeof caches === "undefined") {
    return null
  }

  return caches.default
}

export function cacheRequest(path: string) {
  return new Request(`${cacheOrigin}${path}`)
}

export async function getCachedJson<T>(request: Request) {
  try {
    const cache = getDefaultCache()
    if (!cache) return undefined

    const response = await cache.match(request)
    if (!response) return undefined

    return (await response.json()) as T
  } catch {
    return undefined
  }
}

export async function putCachedJson(request: Request, value: unknown, maxAgeSeconds: number) {
  try {
    const cache = getDefaultCache()
    if (!cache) return

    await cache.put(
      request,
      new Response(JSON.stringify(value), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": `public, max-age=${maxAgeSeconds}`,
          "Cloudflare-CDN-Cache-Control": `public, max-age=${maxAgeSeconds}`,
        },
      }),
    )
  } catch {
    return
  }
}

export async function deleteCachedRequests(requests: Request[]) {
  try {
    const cache = getDefaultCache()
    if (!cache) return

    await Promise.all(requests.map(request => cache.delete(request)))
  } catch {
    return
  }
}
