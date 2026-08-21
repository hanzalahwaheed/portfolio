"use client"

import React from "react"
import Image from "@/components/app-image"
import Link from "@/components/app-link"
import Reveal from "@/components/reveal"
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
      className="group relative block border-t border-hairline transition-colors last:border-b hover:bg-paper/[0.02]"
    >
      <div className="flex items-center gap-5 px-2 py-7 md:gap-6">
        {/* Thumbnail */}
        <div className="relative hidden h-20 w-28 flex-shrink-0 overflow-hidden sm:block">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover opacity-75 grayscale-[40%] transition-all duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          />
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="font-ui mb-2 flex items-center gap-3 text-[0.65rem] tracking-[0.25em] text-faint uppercase">
            <span className="text-brass">{article.date}</span>
            <span className="h-px w-4 bg-hairline" />
            <span>{article.readTime} read</span>
          </div>

          <h3
            className={`${instrumentSerif.className} truncate text-2xl leading-tight text-paper transition-colors duration-300 group-hover:text-brass md:text-3xl`}
          >
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="mt-1 line-clamp-1 font-light text-faint md:line-clamp-2">{article.excerpt}</p>
          )}
        </div>

        {/* Arrow */}
        <ArrowUpRight
          size={22}
          className="flex-shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brass"
        />
      </div>
    </Link>
  )
}

const Blogs = ({ posts, error = false }: { posts: Post[]; error?: boolean }) => {
  const articles = mapPostsToArticles(posts)
  const displayArticles = articles.slice(0, 5)

  return (
    <section className="w-full bg-ink px-4 py-24 text-paper">
      <div className="mx-auto w-full max-w-3xl">
        {/* Section Header */}
        <Reveal>
          <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className={`${instrumentSerif.className} text-4xl leading-none text-paper md:text-5xl`}>
                writing
              </h2>
              <p className="mt-4 max-w-md font-light text-paper-dim">
                I mostly write about tech and some personal thoughts on stuff I read.
              </p>
            </div>

            <Link
              href="/blogs"
              className="font-ui group flex items-center gap-1.5 border-b border-transparent pb-1 text-[0.7rem] tracking-[0.25em] text-brass uppercase transition-colors hover:border-brass hover:text-paper"
            >
              View all
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </header>
        </Reveal>

        {/* The List */}
        {error ? (
          <div className="flex items-center justify-center border-y border-hairline py-20">
            <p className="font-light text-faint">Couldn&apos;t load posts right now — try again in a bit.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-light text-faint">No posts available yet.</p>
          </div>
        ) : (
          <div className="border-b border-hairline">
            {displayArticles.map((article, i) => (
              <Reveal key={article.id} delay={i * 60}>
                <BlogRow article={article} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Blogs
