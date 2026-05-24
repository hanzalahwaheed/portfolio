import Link from "@/components/app-link"
import GitHubCalendar from "./github-calendar"
import OssContributions from "./oss-contributions"
import { instrumentSerif } from "@/lib/fonts"

import { workExperiences, personalDetails, WorkExperience } from "../config"

const TechBadge = ({ tech }: { tech: string }) => (
  <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium tracking-wider text-gray-300 transition-colors hover:bg-white/15 hover:text-white">
    {tech}
  </span>
)

const WorkCard = ({ experience }: { experience: WorkExperience }) => (
  <div className="rounded-2xl bg-white/4 p-6 backdrop-blur-sm">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
      <h3 className="text-2xl font-semibold text-white">
        <Link
          href={experience.companyUrl}
          className="text-[#66acb6] transition-colors hover:text-[#4fe0d0]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {experience.company}
        </Link>
        <span className="text-white"> - {experience.role}</span>
      </h3>
      <p className="text-sm whitespace-nowrap text-gray-400">{experience.duration}</p>
    </div>
    <p className="mt-3 mb-4 text-gray-300">{experience.description}</p>
    <div className="flex flex-wrap gap-2">
      {experience.techStack.map(tech => (
        <TechBadge key={tech} tech={tech} />
      ))}
    </div>
  </div>
)

export const MyWork = () => {
  return (
    <div className="mx-auto mt-16 w-full max-w-3xl">
      {/* Work Experience */}
      <h2 className={`${instrumentSerif.className} text-glow mb-8 text-center text-3xl text-white md:text-4xl`}>
        my work
      </h2>
      <div className="grid gap-6">
        {workExperiences.map(experience => (
          <WorkCard key={experience.company} experience={experience} />
        ))}
      </div>

      {/* OSS Contributions */}
      <div className="mt-12">
        <h2 className={`${instrumentSerif.className} text-glow mb-8 text-center text-3xl text-white md:text-4xl`}>
          open source
        </h2>
        <OssContributions />
      </div>

      {/* GitHub Calendar */}
      <div className="mt-12">
        <h2 className={`${instrumentSerif.className} text-glow mb-8 text-center text-3xl text-white md:text-4xl`}>
          my github
        </h2>
        <div className="w-full max-w-full rounded-2xl bg-white/5 p-4 backdrop-blur-sm sm:p-6">
          <GitHubCalendar username={personalDetails.githubUsername} />
        </div>
      </div>
    </div>
  )
}

export default MyWork
