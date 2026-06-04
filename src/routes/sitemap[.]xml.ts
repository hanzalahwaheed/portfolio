import { createFileRoute } from "@tanstack/react-router"
import { getPosts } from "@/lib/blogs"

const siteUrl = "https://hanzalahwaheed.com"

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function urlEntry(location: string, lastModified: string) {
  return `<url><loc>${escapeXml(location)}</loc><lastmod>${new Date(lastModified).toISOString()}</lastmod></url>`
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getPosts()
        const latestPostDate = posts.reduce<string>((latest, post) => {
          const candidate = post.updatedAt || post.publishedAt || post.createdAt
          return new Date(candidate) > new Date(latest) ? candidate : latest
        }, new Date(0).toISOString())
        const blogsLastMod = posts.length ? new Date(latestPostDate).toISOString() : new Date().toISOString()
        const urls = [
          urlEntry(`${siteUrl}/`, blogsLastMod),
          urlEntry(`${siteUrl}/blogs`, blogsLastMod),
          urlEntry(`${siteUrl}/resume`, blogsLastMod),
          ...posts.map(post => {
            const lastModified = post.updatedAt || post.publishedAt || post.createdAt
            return urlEntry(`${siteUrl}/blogs/${post.slug}`, lastModified)
          }),
        ]

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
          {
            headers: { "Content-Type": "application/xml; charset=utf-8" },
          },
        )
      },
    },
  },
})
