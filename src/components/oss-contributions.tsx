"use client"

import { useState, useEffect } from "react"
import Link from "@/components/app-link"
import { Loader2 } from "lucide-react"
import { instrumentSerif } from "@/lib/fonts"

import { ossContributions as staticContributions, OSSContribution, personalDetails } from "../config"
import { handleApiResponse } from "@/lib/api-client"

const OSSTimelineItem = ({ contribution, isLast }: { contribution: OSSContribution; isLast: boolean }) => {
  return (
    <div className="group relative flex gap-6 pb-8 last:pb-0">
      {/* Timeline Line */}
      {!isLast && <div className="absolute top-7 left-[5px] h-full w-px bg-hairline" />}

      {/* Node */}
      <div className="relative z-10 mt-2 flex h-[11px] w-[11px] shrink-0 items-center justify-center">
        <span className="h-[11px] w-[11px] rotate-45 border border-brass/70 bg-ink transition-colors duration-300 group-hover:bg-brass" />
      </div>

      {/* Content */}
      <div className="flex flex-col pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            href={contribution.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${instrumentSerif.className} text-xl text-paper transition-colors hover:text-brass`}
          >
            {contribution.project}
          </Link>
          <span className="font-ui text-[0.65rem] tracking-[0.25em] text-faint uppercase">{contribution.type}</span>
        </div>
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed font-light text-paper-dim transition-colors group-hover:text-paper">
          {contribution.description}
        </p>
      </div>
    </div>
  )
}

export const OssContributions = () => {
  const [contributions, setContributions] = useState<OSSContribution[]>(staticContributions)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(`/api/github-latest-contributions?username=${personalDetails.githubUsername}`)
        const data = await handleApiResponse<{ contributions: OSSContribution[] }>(response)
        if (data.contributions && data.contributions.length > 0) {
          setContributions(data.contributions)
        }
      } catch (error) {
        console.error("Error fetching contributions:", error)
        // Fallback to static data (already set as initial state)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributions()
  }, [])

  return (
    <div className="custom-scrollbar max-h-[500px] overflow-y-auto pt-2 pr-4 pl-1">
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brass" />
        </div>
      ) : (
        contributions.map((contribution, index) => (
          <OSSTimelineItem
            key={contribution.githubUrl}
            contribution={contribution}
            isLast={index === contributions.length - 1}
          />
        ))
      )}
    </div>
  )
}

export default OssContributions
