import Image from "@/components/app-image"
import Reveal from "@/components/reveal"
import SectionHeading from "@/components/section-heading"
import { FlowingCarouselTechStack } from "./flowing-carousel-tech-stack"
import { MyBuilds } from "./my-builds"
import { MyWork } from "./my-work"
import Link from "@/components/app-link"

const AboutMe = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-x-hidden px-4 py-16">
      {/* Faint accent glow lingering from the hero, behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[560px] bg-[radial-gradient(70%_55%_at_50%_36%,var(--accent-tint),transparent_70%)]"
      />
      <div className="relative z-10 w-full">
        <div className="mx-auto w-full max-w-3xl">
          <Reveal>
            <SectionHeading title="my story so far" className="mt-20" />
          </Reveal>

          {/* basic intro */}
          <Reveal delay={100}>
            <div className="mb-20 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:gap-12">
              <div className="flex-shrink-0">
                {/* Arch frame — editorial portrait treatment */}
                <div className="w-48 overflow-hidden rounded-t-full border border-hairline p-2 sm:w-52">
                  <Image
                    src="/images/pfp.jpeg"
                    alt="Hanzalah Waheed"
                    width={250}
                    height={250}
                    className="rounded-t-full object-cover grayscale-[35%] transition-all duration-700 hover:grayscale-0"
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xl leading-relaxed font-light text-paper-dim first-letter:float-left first-letter:mr-3 first-letter:font-instrument-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-paper md:text-2xl">
                  I like building software that brings order to complicated data and unclear requirements. At{" "}
                  <Link
                    href="https://www.stockinsights.ai"
                    className="text-brass transition-colors hover:text-paper"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    StockInsights AI
                  </Link>
                  , I work on systems for AI-driven financial products.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Work, OSS, and GitHub */}
          <MyWork />

          <MyBuilds />

          {/* tech stack */}
          <Reveal>
            <div className="mt-24">
              <SectionHeading title="tools of the trade" />
              <FlowingCarouselTechStack />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}

export default AboutMe
