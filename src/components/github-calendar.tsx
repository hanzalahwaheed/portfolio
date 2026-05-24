"use client"

import { useState, useMemo } from "react"
import GitHubCalendar from "react-github-calendar"

interface GitHubCalendarProps {
  username: string
  className?: string
}

const GitHubCalendarComponent = ({ username, className = "" }: GitHubCalendarProps) => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const Calendar = (GitHubCalendar as unknown as { default?: typeof GitHubCalendar }).default || GitHubCalendar

  const years = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => currentYear - i)
  }, [currentYear])

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex flex-wrap gap-2">
        {years.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              selectedYear === year
                ? "bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="github-calendar-wrapper custom-scrollbar w-full overflow-x-auto pb-2">
        <Calendar
          username={username}
          year={selectedYear}
          colorScheme="dark"
          style={{
            background: "transparent",
            color: "#ffffff",
          }}
          blockSize={10}
          blockMargin={3}
          fontSize={14}
          showWeekdayLabels={false}
          hideTotalCount={false}
          hideColorLegend={false}
        />
      </div>

      <style>{`
        .github-calendar-wrapper :global(.react-activity-calendar) {
          background: transparent !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar svg) {
          background: transparent !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap) {
          background: transparent !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap text) {
          fill: #9ca3af !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-empty) {
          fill: #374151 !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-1) {
          fill: #166534 !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-2) {
          fill: #16a34a !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-3) {
          fill: #22c55e !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-4) {
          fill: #4ade80 !important;
        }
      `}</style>
    </div>
  )
}

export default GitHubCalendarComponent
