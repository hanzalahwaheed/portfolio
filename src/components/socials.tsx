import Link from "@/components/app-link"
import { CalendarDays } from "lucide-react"
import { contactLinks, socialLinks } from "@/config"
import { instrumentSerif } from "@/lib/fonts"

const Socials = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={socialLinks.github}
          className={`${instrumentSerif.className} font-bold text-white transition-all duration-300 hover:scale-110`}
        >
          Github
        </Link>
        <Link
          href={socialLinks.twitter}
          className={`${instrumentSerif.className} font-bold text-white transition-all duration-300 hover:scale-110`}
        >
          Twitter
        </Link>
        <Link
          href={socialLinks.linkedin}
          className={`${instrumentSerif.className} font-bold text-white transition-all duration-300 hover:scale-110`}
        >
          Linkedin
        </Link>
      </div>
      <Link
        href={contactLinks.scheduleCall}
        target="_blank"
        rel="noopener noreferrer"
        className={`${instrumentSerif.className} mt-5 inline-flex min-h-8 items-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/20`}
      >
        <CalendarDays className="size-4" />
        Schedule Call
      </Link>
    </div>
  )
}

export default Socials
