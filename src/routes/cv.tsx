import { createFileRoute } from "@tanstack/react-router"
import { getResumeFileId } from "@/lib/resume"

const siteUrl = "https://hanzalahwaheed.com"

export const Route = createFileRoute("/cv")({
  loader: () => getResumeFileId({ data: { variant: "default" } }),
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
