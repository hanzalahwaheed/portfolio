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
            className={`font-ui rounded-full px-4 py-1.5 text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-200 ${
              selectedYear === year
                ? "border border-brass bg-brass/10 text-brass"
                : "border border-hairline text-faint hover:border-paper/30 hover:text-paper"
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
            color: "#ede6d6",
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
          fill: #a89f8c !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-empty) {
          fill: rgba(237, 230, 214, 0.07) !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-1) {
          fill: #4a3d26 !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-2) {
          fill: #7a6238 !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-3) {
          fill: #a5854f !important;
        }

        .github-calendar-wrapper :global(.react-activity-calendar .react-calendar-heatmap .color-scale-4) {
          fill: #c9a870 !important;
        }
      `}</style>
    </div>
  )
}

export default GitHubCalendarComponent
