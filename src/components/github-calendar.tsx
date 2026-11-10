"use client"

import { useState, useMemo } from "react"
import GitHubCalendar from "react-github-calendar"
import { instrumentSerif } from "@/lib/fonts"

interface GitHubCalendarProps {
  username: string
  title: string
  className?: string
}

const calendarTheme = { dark: ["rgba(237, 230, 214, 0.07)", "var(--brass)"] }

const GitHubCalendarComponent = ({ username, title, className = "" }: GitHubCalendarProps) => {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const Calendar = (GitHubCalendar as unknown as { default?: typeof GitHubCalendar }).default || GitHubCalendar

  const years = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => currentYear - i)
  }, [currentYear])

  return (
    <div className={`w-full ${className}`}>
      <div className="border-hairline flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b pb-5">
        <h3 className={`${instrumentSerif.className} text-paper text-2xl`}>{title}</h3>
        <div className="flex gap-6">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              aria-pressed={selectedYear === year}
              className={`font-ui cursor-pointer text-[0.7rem] tracking-[0.2em] uppercase underline-offset-8 transition-colors duration-200 ${
                selectedYear === year ? "text-brass underline" : "text-faint hover:text-paper"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="github-calendar-wrapper custom-scrollbar text-paper-dim w-full overflow-x-auto pt-8 pb-2">
        <Calendar
          username={username}
          year={selectedYear}
          colorScheme="dark"
          theme={calendarTheme}
          blockSize={10}
          blockMargin={3}
          fontSize={14}
          showWeekdayLabels={false}
          hideTotalCount={false}
          hideColorLegend={false}
        />
      </div>
    </div>
  )
}

export default GitHubCalendarComponent
