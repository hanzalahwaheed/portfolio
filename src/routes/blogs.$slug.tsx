import { createFileRoute, notFound } from "@tanstack/react-router"
import { getPost } from "@/lib/blogs"
import { MinimalBlogContent } from "@/components/blog/minimal-blog-content"

const siteUrl = "https://hanzalahwaheed.com"

const createExcerpt = (content: string, fallbackLength = 160) => {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return plainText.length > fallbackLength ? `${plainText.slice(0, fallbackLength - 1)}...` : plainText
}

export const Route = createFileRoute("/blogs/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({ data: { slug: params.slug } })
    if (!post || !post.published) {
      throw notFound()
    }
    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const description = loaderData.excerpt?.trim() || createExcerpt(loaderData.content)
    const canonical = `/blogs/${loaderData.slug}`
    return {
      meta: [
        { title: `${loaderData.title} | Hanzalah Waheed` },
        { name: "description", content: description },
        { property: "og:title", content: `${loaderData.title} | Hanzalah Waheed` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `${siteUrl}${canonical}` },
        { property: "og:image", content: `${siteUrl}/blogs/${loaderData.slug}/opengraph-image` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${loaderData.title} | Hanzalah Waheed` },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${siteUrl}/blogs/${loaderData.slug}/twitter-image` },
      ],
      links: [{ rel: "canonical", href: canonical }],
    }
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const post = Route.useLoaderData()
  const description = post.excerpt?.trim() || createExcerpt(post.content)
  const url = `${siteUrl}/blogs/${post.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: "Hanzalah Waheed",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Hanzalah Waheed",
      url: siteUrl,
    },
    mainEntityOfPage: url,
    url,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MinimalBlogContent post={post} />
    </>
  )
}
