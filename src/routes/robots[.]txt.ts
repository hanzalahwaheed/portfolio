import { createFileRoute } from "@tanstack/react-router"

const siteUrl = "https://hanzalahwaheed.com"

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
})
