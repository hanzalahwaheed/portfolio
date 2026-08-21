import { instrumentSerif } from "@/lib/fonts"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  title: string
  className?: string
}

export default function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <h2 className={cn(`${instrumentSerif.className} mb-12 text-4xl leading-none text-paper md:text-6xl`, className)}>
      {title}
    </h2>
  )
}
