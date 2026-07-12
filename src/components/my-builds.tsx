import Link from "@/components/app-link"
import { ChevronRight } from "lucide-react"
import { instrumentSerif } from "@/lib/fonts"

import { builds, type Build } from "../config"

const BuildItem = ({ build }: { build: Build }) => (
  <li className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold text-white">
          <Link
            href={build.url}
            className="text-[#66acb6] transition-colors hover:text-[#4fe0d0]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {build.name}
          </Link>
        </h3>
      </div>
      <p className="text-gray-300">{build.description}</p>
      {build.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {build.techStack.map(tech => (
            <span key={tech} className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  </li>
)

export const MyBuilds = () => {
  const current = builds.filter(build => !build.archived)
  const archived = builds.filter(build => build.archived)

  return (
    <div id="builds" className="mx-auto mt-16 w-full max-w-3xl">
      <h2 className={`${instrumentSerif.className} text-glow mb-8 text-center text-3xl text-white md:text-4xl`}>
        my builds
      </h2>

      <ul className="space-y-6">
        {current.map(build => (
          <BuildItem key={build.name} build={build} />
        ))}
      </ul>

      {archived.length > 0 && (
        // <details> rather than useState: the archive stays in the server-rendered
        // DOM, so it works without JS and crawlers still see the older projects.
        <details className="group mt-10 border-t border-white/10 pt-6">
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-300 [&::-webkit-details-marker]:hidden">
            <ChevronRight
              size={15}
              className="transition-transform duration-200 group-open:rotate-90"
              aria-hidden="true"
            />
            Archive ({archived.length} earlier projects)
          </summary>
          <ul className="mt-6 space-y-6 opacity-70 transition-opacity hover:opacity-100">
            {archived.map(build => (
              <BuildItem key={build.name} build={build} />
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
