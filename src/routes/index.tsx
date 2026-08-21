import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useRef, useState } from "react"
import { instrumentSerif } from "@/lib/fonts"
import Navbar from "@/components/navbar"
import AboutMe from "@/components/about-me"
import Socials from "@/components/socials"
import MoreBelow from "@/components/more-below"
import Blogs from "@/components/blogs"
import Bookery from "@/components/bookery"
import Grind from "@/components/grind"
import Link from "@/components/app-link"
import { loadPosts } from "@/lib/blogs"
import { applyHeroTheme, extractHeroTheme, heroThemes, type HeroTheme } from "@/lib/hero-themes"
import { socialLinks } from "@/config"

export const Route = createFileRoute("/")({
  loader: () => loadPosts(),
  head: () => ({
    meta: [
      { title: "Hanzalah Waheed | Software Developer" },
      {
        name: "description",
        content:
          "Hanzalah Waheed is a software developer focused on AI and applied AI, building modern web products. Portfolio, projects, blogs, and open-source work.",
      },
      {
        name: "keywords",
        content:
          "Hanzalah Waheed, software developer, AI, applied AI, web developer, Next.js, TypeScript, portfolio, open source",
      },
      { property: "og:title", content: "Hanzalah Waheed | Software Developer" },
      {
        property: "og:description",
        content:
          "Software developer focused on AI and applied AI, building modern web products. Portfolio, projects, blogs, and open-source work.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hanzalahwaheed.com/" },
      { property: "og:site_name", content: "Hanzalah Waheed" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "https://hanzalahwaheed.com/opengraph-image" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@waheed_hanzalah" },
      { name: "twitter:creator", content: "@waheed_hanzalah" },
      { name: "twitter:title", content: "Hanzalah Waheed | Software Developer" },
      {
        name: "twitter:description",
        content:
          "Software developer focused on AI and applied AI, building modern web products. Portfolio, projects, blogs, and open-source work.",
      },
      { name: "twitter:image", content: "https://hanzalahwaheed.com/twitter-image" },
    ],
    links: [{ rel: "canonical", href: "https://hanzalahwaheed.com/" }],
  }),
  component: Home,
})

const heroBackgrounds = [
  "/images/aurora-forest.jpg",
  "/images/image copy 2.png",
  "/images/image copy 4.png",
]

function Home() {
  const { posts, error: postsError } = Route.useLoaderData()

  // Read the clock per-render, not at module scope: Workers evaluate top-level
  // module code during isolate startup, where the clock is pinned to the epoch
  // and getFullYear() returns 1970.
  const currentYear = new Date().getFullYear()

  // Cycle through the hero backgrounds in a fixed order, advancing once per
  // page load (stored in localStorage). Done in an effect (rather than during
  // render) so the server and initial client render agree.
  const [heroIndex, setHeroIndex] = useState(0)
  const [extractedThemes, setExtractedThemes] = useState<Record<string, HeroTheme>>({})
  const heroBgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = Number(localStorage.getItem("hero-bg-index")) || 0
    const index = stored % heroBackgrounds.length
    setHeroIndex(index)
    localStorage.setItem("hero-bg-index", String((index + 1) % heroBackgrounds.length))

    // Warm the browser cache for every background, so future refreshes swap
    // instantly instead of re-fetching from the CDN.
    heroBackgrounds.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // Extract a palette from each background once, so themes are exact.
  useEffect(() => {
    let cancelled = false
    heroBackgrounds.forEach(async src => {
      const theme = await extractHeroTheme(src)
      if (theme && !cancelled) setExtractedThemes(prev => ({ ...prev, [src]: theme }))
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Theme the page to match the active background. Falls back to the
  // pre-extracted palette until runtime extraction finishes.
  useEffect(() => {
    const src = heroBackgrounds[heroIndex]
    applyHeroTheme(extractedThemes[src] ?? heroThemes[src])
  }, [heroIndex, extractedThemes])

  // Slow parallax: drift the hero background at ~0.15x scroll so it lags behind
  // the page, making the story section feel like scrolling deeper into the same
  // scene. Capped to 15% of viewport height to stay within the oversized (130%)
  // background layer so no edges ever show. Disabled for reduced-motion users.
  useEffect(() => {
    const el = heroBgRef.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const offset = Math.min(window.scrollY * 0.15, window.innerHeight * 0.15)
      el.style.transform = `translate3d(0, ${offset}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const siteUrl = "https://hanzalahwaheed.com"
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hanzalah Waheed",
    url: siteUrl,
    image: `${siteUrl}/images/pfp.jpeg`,
    sameAs: [socialLinks.github, socialLinks.twitter, socialLinks.linkedin],
    jobTitle: "Software Developer (AI & Applied AI)",
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hanzalah Waheed",
    url: siteUrl,
    description:
      "Portfolio, projects, blogs, and open-source work by Hanzalah Waheed, a software developer focused on AI and applied AI.",
    publisher: {
      "@type": "Person",
      name: "Hanzalah Waheed",
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, websiteJsonLd]) }}
      />
      <Navbar />
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* Parallax background layer — oversized (130%) so the drift never exposes an edge.
            All backgrounds render stacked; the active one fades in. */}
        <div ref={heroBgRef} className="absolute -top-[15%] left-0 h-[130%] w-full will-change-transform">
          {heroBackgrounds.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === heroIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
        {/* Bottom fade: dissolve the image into the ink story section below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-b from-transparent to-ink" />
        <div className="absolute top-[45%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className={`${instrumentSerif.className} text-glow text-5xl text-white md:text-7xl lg:text-8xl`}>
            Hanzalah Waheed
          </h1>
          <br />
          <h2 className={`${instrumentSerif.className} text-lg text-white md:text-xl`}>
            Trying to understand how things work
          </h2>
          <div className="mt-8 flex items-center justify-center space-x-4">
            <Socials />
          </div>
        </div>
        <MoreBelow />
      </section>
      <div id="about-me" className="relative z-10 -mt-[70px]">
        <AboutMe />
      </div>
      <div id="blogs">
        <Blogs posts={posts ?? []} error={postsError} />
      </div>
      <div id="bookery">
        <Bookery />
      </div>
      <Grind />
      <footer
        className={`flex h-56 flex-col items-center justify-center gap-3 border-t border-hairline bg-ink ${instrumentSerif.className}`}
      >
        <p className="text-lg text-paper-dim">Design and Development by Hanzalah Waheed</p>
        <p className="font-ui text-[0.65rem] tracking-[0.3em] text-faint uppercase">&copy; {currentYear}</p>
        <Link
          href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="font-ui text-[0.65rem] tracking-[0.25em] text-faint uppercase transition-colors hover:text-brass"
          target="_blank"
        >
          Do not Click
        </Link>
      </footer>
    </>
  )
}
