"use client"

import { useState, useEffect } from "react"
import Link from "@/components/app-link"
import { instrumentSerif } from "@/lib/fonts"

import { ossContributions as staticContributions, OSSContribution, personalDetails } from "../config"
import { handleApiResponse } from "@/lib/api-client"

const OSSTimelineItem = ({ contribution, isLast }: { contribution: OSSContribution; isLast: boolean }) => {
  return (
    <div className="group relative flex gap-6 pb-8 last:pb-0">
      {/* Timeline Line */}
      {!isLast && <div className="bg-hairline absolute top-7 left-[5px] h-full w-px" />}

      {/* Node */}
      <div className="relative z-10 mt-2 flex h-[11px] w-[11px] shrink-0 items-center justify-center">
        <span className="border-brass/70 bg-ink group-hover:bg-brass h-[11px] w-[11px] rotate-45 border transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="flex flex-col pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            href={contribution.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${instrumentSerif.className} text-paper hover:text-brass text-xl transition-colors`}
          >
            {contribution.project}
          </Link>
          <span className="font-ui text-faint text-[0.65rem] tracking-[0.25em] uppercase">{contribution.type}</span>
        </div>
        <p className="text-paper-dim group-hover:text-paper mt-1.5 max-w-prose text-sm leading-relaxed font-light transition-colors">
          {contribution.description}
        </p>
      </div>
    </div>
  )
}

export const OssContributions = () => {
  const [contributions, setContributions] = useState<OSSContribution[]>(staticContributions)

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
      }
    }

    fetchContributions()
  }, [])

  return (
    <div className="custom-scrollbar max-h-[500px] overflow-y-auto pt-2 pr-4 pl-1">
      {contributions.map((contribution, index) => (
        <OSSTimelineItem
          key={contribution.githubUrl}
          contribution={contribution}
          isLast={index === contributions.length - 1}
        />
      ))}
    </div>
  )
}

export default OssContributions
