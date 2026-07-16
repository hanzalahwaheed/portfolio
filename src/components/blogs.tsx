"use client"

import React from "react"
import Image from "@/components/app-image"
import Link from "@/components/app-link"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import type { BlogPost as Post } from "@/lib/blogs"
import { format } from "date-fns"
import { instrumentSerif } from "@/lib/fonts"

type Article = {
  id: string
  title: string
  excerpt: string | null
  date: string
  readTime: string
  image: string
  slug: string
}

// Helper function to estimate read time from content
const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min`
}

const mapPostsToArticles = (posts: Post[]): Article[] => {
  const defaultImage = "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop"

  return posts.map(post => {
    const date = post.publishedAt
      ? format(new Date(post.publishedAt), "MMM dd, yyyy")
      : format(new Date(post.createdAt), "MMM dd, yyyy")

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date,
      readTime: estimateReadTime(post.content),
      image: post.coverImage || defaultImage,
      slug: post.slug,
    }
  })
}

const BlogRow = ({ article }: { article: Article }) => {
  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group relative block border-t border-white/10 transition-colors last:border-b hover:bg-white/[0.025]"
    >
      <div className="flex items-center gap-5 px-2 py-6 md:gap-6">
        {/* Thumbnail */}
        <div className="relative hidden h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 sm:block">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3 text-[0.7rem] tracking-[0.15em] text-[#66acb6] uppercase">
            <span>{article.date}</span>
            <span className="h-1 w-1 rounded-full bg-[#1E383C]" />
            <span className="text-neutral-500">{article.readTime} read</span>
          </div>

          <h3
            className={`${instrumentSerif.className} truncate text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-[#4fe0d0] md:text-3xl`}
          >
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-1 line-clamp-1 text-sm text-neutral-500 md:line-clamp-2">{article.excerpt}</p>
          )}
        </div>

        {/* Arrow */}
        <ArrowUpRight
          size={22}
          className="flex-shrink-0 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4fe0d0]"
        />
      </div>
    </Link>
  )
}

const Blogs = ({ posts, error = false }: { posts: Post[]; error?: boolean }) => {
  const articles = mapPostsToArticles(posts)
  const displayArticles = articles.slice(0, 5)

  return (
    <section className="w-full bg-[#050505] px-4 py-24 font-sans text-white selection:bg-white selection:text-black">
      <div className="mx-auto w-full max-w-3xl">
        {/* Section Header */}
        <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2
              className={`${instrumentSerif.className} bg-gradient-to-b from-white to-white/60 bg-clip-text pb-1 text-4xl tracking-tight text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] md:text-5xl`}
            >
              Blogs
            </h2>
            <p className="mt-3 max-w-md text-sm text-neutral-400">
              I mostly write about tech and some personal thoughts on stuff I read.
            </p>
          </div>

          <Link
            href="/blogs"
            className="group flex items-center gap-1.5 border-b border-transparent pb-1 text-sm font-medium text-[#66acb6] transition-colors hover:border-[#4fe0d0] hover:text-[#4fe0d0]"
          >
            View all
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </header>

        {/* The List */}
        {error ? (
          <div className="flex items-center justify-center border-y border-white/10 py-20">
            <p className="text-neutral-500">Couldn&apos;t load posts right now — try again in a bit.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-neutral-500">No posts available yet.</p>
          </div>
        ) : (
          <div>
            {displayArticles.map(article => (
              <BlogRow key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Blogs
