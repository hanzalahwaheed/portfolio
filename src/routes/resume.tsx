import { createFileRoute } from "@tanstack/react-router"
import { getResumeFileId } from "@/lib/resume"

const siteUrl = "https://hanzalahwaheed.com"

export const Route = createFileRoute("/resume")({
  loader: () => getResumeFileId({ data: { variant: "default" } }),
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
  const resumeUrlFileId = Route.useLoaderData()

  if (!resumeUrlFileId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p>Resume URL not configured.</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#111010]">
      <iframe
        src={`https://drive.google.com/file/d/${resumeUrlFileId}/preview`}
        className="h-full w-full border-none"
        title="Resume"
        allow="autoplay"
      />
    </div>
  )
}
