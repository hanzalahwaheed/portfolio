import { createFileRoute } from "@tanstack/react-router"
import { githubService } from "@/lib/github/service"

export const Route = createFileRoute("/api/github-latest-contributions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get("username")

        if (!username) {
          return Response.json({ error: "Username is required" }, { status: 400 })
        }

        try {
          const contributions = await githubService.getLatestContributions(username)
          return Response.json({ contributions })
        } catch (error) {
          console.error("Error fetching GitHub contributions:", error)
          return Response.json({ error: "Failed to fetch contributions" }, { status: 500 })
        }
      },
    },
  },
})
