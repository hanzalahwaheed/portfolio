import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/opengraph-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL("/images/pfp.jpeg", request.url)
        return Response.redirect(url, 302)
      },
    },
  },
})
