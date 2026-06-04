import { createFileRoute } from "@tanstack/react-router"
import { instrumentSerif } from "@/lib/fonts"
import Navbar from "@/components/navbar"
import Lines from "@/components/lines"
import AboutMe from "@/components/about-me"
import Socials from "@/components/socials"
import MoreBelow from "@/components/more-below"
import Blogs from "@/components/blogs"
import Bookery from "@/components/bookery"
import Grind from "@/components/grind"
import Link from "@/components/app-link"
import { socialLinks } from "@/config"

export const Route = createFileRoute("/")({
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

const currentYear = new Date().getFullYear()

function Home() {
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
      <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
        <main className="space-y-8 text-center">
          <div
            className="relative h-screen w-screen bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hollow_knight_bg.jpg')",
            }}
          >
            <div className="absolute top-[45%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 bg-transparent">
              <h1
                className={`${instrumentSerif.className} bg-gradient-background text-glow text-5xl text-white md:text-7xl lg:text-8xl`}
              >
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
          </div>
        </main>
      </div>
      <Lines reverse={true} />
      <div id="about-me" className="mb-0.25">
        <div className="bg-gradient-background h-full w-full">
          <AboutMe />
        </div>
      </div>
      <Lines />
      <div id="blogs">
        <Blogs />
      </div>
      <Lines />
      <div id="bookery">
        <Bookery />
      </div>
      <Lines />
      <Grind />
      <Lines />
      <footer
        className={`flex h-48 flex-col items-center justify-center gap-4 bg-[#061113] ${instrumentSerif.className}`}
      >
        <p>Design and Development by Hanzalah Waheed</p>
        <p>&copy; {currentYear}</p>
        <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="text-white hover:underline" target="_blank">
          Do not Click
        </Link>
      </footer>
      <Lines />
    </>
  )
}
