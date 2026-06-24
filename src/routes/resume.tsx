import { createFileRoute } from "@tanstack/react-router"

const siteUrl = "https://hanzalahwaheed.com"

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume | Hanzalah Waheed" },
      {
        name: "description",
        content: "Resume for Hanzalah Waheed, a software developer focused on AI, applied AI, and web products.",
      },
      { property: "og:title", content: "Resume | Hanzalah Waheed" },
      {
        property: "og:description",
        content: "Resume for Hanzalah Waheed, a software developer focused on AI, applied AI, and web products.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: `${siteUrl}/resume` },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Resume | Hanzalah Waheed" },
      {
        name: "twitter:description",
        content: "Resume for Hanzalah Waheed, a software developer focused on AI, applied AI, and web products.",
      },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/resume` }],
  }),
  component: ResumePage,
})

function ResumePage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#111010]">
      <iframe src="/resume.pdf#toolbar=1" className="h-full w-full border-none" title="Resume" />
    </div>
  )
}
