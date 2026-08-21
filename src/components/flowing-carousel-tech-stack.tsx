"use client"

import { cn } from "@/lib/utils"

interface FlowingCarouselProps {
  className?: string
}

const technologies = [
  "Python",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Git",
  "Next.js",
  "JavaScript",
  "TypeScript",
  "Shadcn",
  "Zustand",
  "Tanstack",
  "HTML",
  "CSS",
  "React",
  "Node.js",
  "Tailwind",
  "Zod",
  "Drizzle",
  "tRPC",
]

export function FlowingCarouselTechStack({ className }: FlowingCarouselProps) {
  const topTechnologies = technologies.slice(0, 8)
  const bottomTechnologies = technologies.slice(8)

  return (
    <div className={cn("relative w-full overflow-hidden py-8", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent" />

      {/* Top row - flowing left to right */}
      <div className="relative mb-6 overflow-hidden">
        <div className="animate-scroll-left flex gap-4 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, setIndex) =>
            topTechnologies.map((tech, index) => (
              <div
                key={`top-${setIndex}-${index}`}
                className="font-ui inline-flex shrink-0 items-center rounded-full border border-hairline px-4 py-2 text-[0.7rem] tracking-[0.2em] text-paper-dim uppercase transition-colors hover:border-brass/50 hover:text-paper"
              >
                {tech}
              </div>
            )),
          )}
        </div>
      </div>

      {/* Bottom row - flowing right to left */}
      <div className="relative overflow-hidden">
        <div className="animate-scroll-right flex gap-4 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, setIndex) =>
            bottomTechnologies.map((tech, index) => (
              <div
                key={`bottom-${setIndex}-${index}`}
                className="font-ui inline-flex shrink-0 items-center rounded-full border border-hairline px-4 py-2 text-[0.7rem] tracking-[0.2em] text-paper-dim uppercase transition-colors hover:border-brass/50 hover:text-paper"
              >
                {tech}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  )
}
