import { createFileRoute } from "@tanstack/react-router"
import Image from "@/components/app-image"
import { getPosts } from "@/lib/blogs"
import { BlogCard } from "@/components/blog/blog-card"
import { instrumentSerif } from "@/lib/fonts"

const siteUrl = "https://hanzalahwaheed.com"
const blogsDescription =
  "Writing on software engineering, React performance, databases, and building products by Hanzalah Waheed."

export const Route = createFileRoute("/blogs/")({
  loader: () => getPosts(),
  head: () => ({
    meta: [
      { title: "Writing | Hanzalah Waheed" },
      { name: "description", content: blogsDescription },
      { property: "og:title", content: "Writing | Hanzalah Waheed" },
      { property: "og:description", content: blogsDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${siteUrl}/blogs` },
      { property: "og:site_name", content: "Hanzalah Waheed" },
      { property: "og:image", content: `${siteUrl}/opengraph-image` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Writing | Hanzalah Waheed" },
      { name: "twitter:description", content: blogsDescription },
      { name: "twitter:image", content: `${siteUrl}/twitter-image` },
    ],
    links: [{ rel: "canonical", href: `${siteUrl}/blogs` }],
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  const posts = Route.useLoaderData()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Writing | Hanzalah Waheed",
    description: blogsDescription,
    url: `${siteUrl}/blogs`,
    author: { "@type": "Person", name: "Hanzalah Waheed", url: siteUrl },
    blogPost: posts.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${siteUrl}/blogs/${post.slug}`,
      datePublished: post.publishedAt ?? post.createdAt,
    })),
  }

  return (
    <div className="relative min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <Image src="/images/image copy 3.png" alt="Background" fill className="object-cover opacity-20 dark:opacity-90" />
      </div>

      <div className="relative z-10 container mx-auto max-w-3xl px-6 py-16 md:py-24 lg:max-w-4xl">
        <header className="mb-14 flex flex-col gap-5 md:mb-20">
          <h1
            className={`${instrumentSerif.className} text-rich-black dark:text-cream text-6xl leading-[0.95] font-bold tracking-tight md:text-7xl lg:text-8xl`}
          >
            Writing
          </h1>
          <p className="text-rich-black/70 dark:text-cream/70 max-w-xl text-lg font-light">
            Thoughts, ideas, and tutorials on building software.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-olive-grey py-16 text-center font-mono text-sm tracking-widest uppercase">No posts yet</p>
        ) : (
          <div className="flex flex-col">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
