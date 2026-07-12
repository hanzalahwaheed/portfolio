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
    <div className={cn("relative w-full overflow-hidden bg-[#0A0A0A] py-8", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0A0A0A] to-transparent" />

      {/* Top row - flowing left to right */}
      <div className="relative mb-6 overflow-hidden">
        <div className="animate-scroll-left flex gap-4 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, setIndex) =>
            topTechnologies.map((tech, index) => (
              <div
                key={`top-${setIndex}-${index}`}
                className="inline-flex shrink-0 items-center rounded-full border border-gray-600/50 bg-gray-800/50 px-4 py-2 font-mono text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-gray-700/50"
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
                className="inline-flex shrink-0 items-center rounded-full border border-gray-600/50 bg-gray-800/50 px-4 py-2 font-mono text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-gray-700/50"
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
