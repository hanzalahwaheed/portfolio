import { createFileRoute } from "@tanstack/react-router"
import { getPosts } from "@/lib/blogs"

const siteUrl = "https://hanzalahwaheed.com"

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const posts = await getPosts()
        const urls = [
          `<url><loc>${siteUrl}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
          `<url><loc>${siteUrl}/blogs</loc><lastmod>${new Date().toISOString()}</lastmod></url>`,
          ...posts.map(post => {
            const lastModified = post.updatedAt || post.publishedAt || post.createdAt
            return `<url><loc>${siteUrl}/blogs/${post.slug}</loc><lastmod>${new Date(lastModified).toISOString()}</lastmod></url>`
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
