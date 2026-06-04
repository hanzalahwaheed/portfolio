import { createFileRoute, notFound } from "@tanstack/react-router"
import { getPost } from "@/lib/blogs"
import { toMetaDescription } from "@/lib/blog-utils"
import { MinimalBlogContent } from "@/components/blog/minimal-blog-content"

const siteUrl = "https://hanzalahwaheed.com"
const authorName = "Hanzalah Waheed"
const twitterHandle = "@waheed_hanzalah"
const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`

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
    const description = toMetaDescription(loaderData.excerpt?.trim() || loaderData.content)
    const pageTitle = `${loaderData.title} | ${authorName}`
    const canonical = absoluteUrl(`/blogs/${loaderData.slug}`)
    const ogImage = absoluteUrl(`/blogs/${loaderData.slug}/opengraph-image`)
    const publishedTime = loaderData.publishedAt ? new Date(loaderData.publishedAt).toISOString() : undefined
    const modifiedTime = loaderData.updatedAt ? new Date(loaderData.updatedAt).toISOString() : undefined
    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: description },
        { name: "author", content: authorName },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonical },
        { property: "og:site_name", content: authorName },
        { property: "og:locale", content: "en_US" },
        { property: "og:image", content: ogImage },
        { property: "og:image:alt", content: loaderData.title },
        ...(publishedTime ? [{ property: "article:published_time", content: publishedTime }] : []),
        ...(modifiedTime ? [{ property: "article:modified_time", content: modifiedTime }] : []),
        { property: "article:author", content: siteUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: twitterHandle },
        { name: "twitter:creator", content: twitterHandle },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: absoluteUrl(`/blogs/${loaderData.slug}/twitter-image`) },
        { name: "twitter:image:alt", content: loaderData.title },
      ],
      links: [{ rel: "canonical", href: canonical }],
    }
  },
  component: BlogPostPage,
})

function BlogPostPage() {
  const post = Route.useLoaderData()
  const description = toMetaDescription(post.excerpt?.trim() || post.content)
  const url = absoluteUrl(`/blogs/${post.slug}`)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: [absoluteUrl(post.coverImage ? post.coverImage : `/blogs/${post.slug}/opengraph-image`)],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: {
      "@type": "Person",
      name: authorName,
      url: siteUrl,
      sameAs: [
        "https://github.com/hanzalahwaheed",
        "https://x.com/waheed_hanzalah",
        "https://linkedin.com/in/hanzalahwaheed",
      ],
    },
    publisher: {
      "@type": "Person",
      name: authorName,
      url: siteUrl,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MinimalBlogContent post={post} />
    </>
  )
}
