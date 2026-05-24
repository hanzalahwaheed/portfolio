import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/github-contributions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get("username")

        if (!username) {
          return Response.json({ error: "Username is required" }, { status: 400 })
        }

        try {
          const response = await fetch(`https://api.github.com/users/${username}/events/public`, {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "Portfolio-App",
            },
          })

          if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`)
          }

          const events = (await response.json()) as Array<{ created_at: string }>
          const contributions: Record<string, number> = {}

          events.forEach(event => {
            const date = event.created_at.split("T")[0]
            contributions[date] = (contributions[date] || 0) + 1
          })

          return Response.json({ contributions })
        } catch (error) {
          console.error("Error fetching GitHub contributions:", error)
          return Response.json({ error: "Failed to fetch contributions" }, { status: 500 })
        }
      },
    },
  },
})
