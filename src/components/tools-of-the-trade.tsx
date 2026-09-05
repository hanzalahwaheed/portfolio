import { techIcons, type TechIconName } from "@/components/icons/tech-icon-data"
import { techGroups } from "../config"
import { cn } from "@/lib/utils"

const TechIcon = ({ name, className }: { name: TechIconName; className?: string }) => {
  const icon = techIcons[name]

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      fillRule={icon.fillRule}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {icon.paths.map(d => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

export function ToolsOfTheTrade({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      {techGroups.map(group => (
        <section key={group.label} className="border-hairline border-t py-8 last:border-b">
          <h3 className="font-ui text-brass mb-6 text-[0.7rem] tracking-[0.25em] uppercase">{group.label}</h3>
          <ul className="flex flex-wrap gap-x-10 gap-y-7 sm:gap-x-12">
            {group.items.map(item => (
              <li key={item.name} className="group flex min-w-16 flex-col items-center gap-3 sm:min-w-20">
                <TechIcon
                  name={item.icon}
                  className="text-paper-dim group-hover:text-brass h-8 w-8 transition-colors duration-300"
                />
                <span className="font-ui text-paper-dim group-hover:text-paper text-center text-[0.65rem] leading-tight tracking-[0.12em] uppercase transition-colors duration-300">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default ToolsOfTheTrade
