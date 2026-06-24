import { createFileRoute } from "@tanstack/react-router"

const siteUrl = "https://hanzalahwaheed.com"

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV | Hanzalah Waheed" },
      { name: "description", content: "CV for Hanzalah Waheed, software developer focused on AI and web products." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/resume` }],
  }),
  component: CvPage,
})

function CvPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#111010]">
      <iframe src="/resume.pdf#toolbar=1" className="h-full w-full border-none" title="Resume" />
    </div>
  )
}
