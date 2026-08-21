import Link from "@/components/app-link"
import Reveal from "@/components/reveal"
import SectionHeading from "@/components/section-heading"
import GitHubCalendar from "./github-calendar"
import OssContributions from "./oss-contributions"
import { instrumentSerif } from "@/lib/fonts"

import { workExperiences, personalDetails, WorkExperience } from "../config"

const WorkEntry = ({ experience }: { experience: WorkExperience }) => (
  <Reveal>
    <article className="group grid gap-3 border-t border-hairline py-10 sm:grid-cols-[9rem_1fr] sm:gap-8">
      <p className="font-ui pt-1.5 text-[0.7rem] tracking-[0.2em] text-faint uppercase">{experience.duration}</p>
      <div>
        <h3 className={`${instrumentSerif.className} text-2xl leading-tight text-paper md:text-3xl`}>
          {experience.role}
          <span className="text-faint"> — </span>
          <Link
            href={experience.companyUrl}
            className="text-brass transition-colors hover:text-paper"
            target="_blank"
            rel="noopener noreferrer"
          >
            {experience.company}
          </Link>
        </h3>
        <p className="mt-4 max-w-prose leading-relaxed font-light text-paper-dim">{experience.description}</p>
        <p className="font-ui mt-5 text-[0.7rem] tracking-[0.2em] text-faint uppercase">
          {experience.techStack.join(" · ")}
        </p>
      </div>
    </article>
  </Reveal>
)

export const MyWork = () => {
  return (
    <div className="mx-auto w-full">
      {/* Work Experience */}
      <SectionHeading title="my work" />
      <div>{workExperiences.map(experience => <WorkEntry key={experience.company} experience={experience} />)}</div>

      {/* OSS Contributions */}
      <div className="mt-24">
        <SectionHeading title="open source" />
        <OssContributions />
      </div>

      {/* GitHub Calendar */}
      <div className="mt-24">
        <h3 className={`${instrumentSerif.className} mb-6 text-2xl text-paper`}>the grind, mapped</h3>
        <div className="w-full border border-hairline bg-ink-raised/50 p-4 sm:p-6">
          <GitHubCalendar username={personalDetails.githubUsername} />
        </div>
      </div>
    </div>
  )
}

export default MyWork
