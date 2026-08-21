import Link from "@/components/app-link"
import Reveal from "@/components/reveal"
import SectionHeading from "@/components/section-heading"
import { ChevronRight } from "lucide-react"
import { instrumentSerif } from "@/lib/fonts"

import { builds, type Build } from "../config"

const BuildItem = ({ build }: { build: Build }) => (
  <Reveal as="li">
    <div className="border-t border-hairline py-8">
      <h3 className={`${instrumentSerif.className} text-2xl leading-tight md:text-3xl`}>
        <Link
          href={build.url}
          className="text-paper transition-colors hover:text-brass"
          target="_blank"
          rel="noopener noreferrer"
        >
          {build.name}
        </Link>
      </h3>
      <p className="mt-3 max-w-prose leading-relaxed font-light text-paper-dim">{build.description}</p>
      {build.techStack.length > 0 && (
        <p className="font-ui mt-4 text-[0.7rem] tracking-[0.2em] text-faint uppercase">
          {build.techStack.join(" · ")}
        </p>
      )}
    </div>
  </Reveal>
)

export const MyBuilds = () => {
  const current = builds.filter(build => !build.archived)
  const archived = builds.filter(build => build.archived)

  return (
    <div id="builds" className="mt-24">
      <SectionHeading title="my builds" />

      <ul>
        {current.map(build => (
          <BuildItem key={build.name} build={build} />
        ))}
      </ul>

      {archived.length > 0 && (
        // <details> rather than useState: the archive stays in the server-rendered
        // DOM, so it works without JS and crawlers still see the older projects.
        <details className="group mt-8 border-t border-hairline pt-6">
          <summary className="font-ui flex cursor-pointer list-none items-center gap-1.5 text-[0.7rem] tracking-[0.25em] text-faint uppercase transition-colors hover:text-paper [&::-webkit-details-marker]:hidden">
            <ChevronRight
              size={14}
              className="transition-transform duration-200 group-open:rotate-90"
              aria-hidden="true"
            />
            Archive ({archived.length} earlier projects)
          </summary>
          <ul className="mt-4 opacity-60 transition-opacity hover:opacity-100">
            {archived.map(build => (
              <BuildItem key={build.name} build={build} />
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
