import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/resume-in")({
  component: ResumeIndiaPage,
})

function ResumeIndiaPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#111010]">
      <iframe src="/resume.pdf#toolbar=1" className="h-full w-full border-none" title="Resume" />
    </div>
  )
}
