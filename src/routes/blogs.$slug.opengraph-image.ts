import { createFileRoute } from "@tanstack/react-router"
import { getPost } from "@/lib/blogs"

export const Route = createFileRoute("/blogs/$slug/opengraph-image")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const post = await getPost({ data: { slug: params.slug } })
        const imageUrl = post?.coverImage || "/images/pfp.jpeg"
        return Response.redirect(new URL(imageUrl, request.url), 302)
      },
    },
  },
})
