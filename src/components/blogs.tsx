"use client"

import React from "react"
import Image from "@/components/app-image"
import Link from "@/components/app-link"
import Reveal from "@/components/reveal"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import type { BlogPostSummary as Post } from "@/lib/blogs"
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

const mapPostsToArticles = (posts: Post[]): Article[] => {
  const defaultImage = "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=320&auto=format&fit=crop"

  return posts.map(post => {
    const date = post.publishedAt
      ? format(new Date(post.publishedAt), "MMM dd, yyyy")
      : format(new Date(post.createdAt), "MMM dd, yyyy")

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      date,
      readTime: post.readTime,
      image: post.coverImage || defaultImage,
      slug: post.slug,
    }
  })
}

const BlogRow = ({ article }: { article: Article }) => {
  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group border-hairline hover:bg-paper/[0.02] relative block border-t transition-colors last:border-b"
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
          <div className="font-ui text-faint mb-2 flex items-center gap-3 text-[0.65rem] tracking-[0.25em] uppercase">
            <span className="text-brass">{article.date}</span>
            <span className="bg-hairline h-px w-4" />
            <span>{article.readTime} read</span>
          </div>

          <h3
            className={`${instrumentSerif.className} text-paper group-hover:text-brass truncate text-2xl leading-tight transition-colors duration-300 md:text-3xl`}
          >
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-faint mt-1 line-clamp-1 font-light md:line-clamp-2">{article.excerpt}</p>
          )}
        </div>

        {/* Arrow */}
        <ArrowUpRight
          size={22}
          className="text-faint group-hover:text-brass flex-shrink-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  )
}

const Blogs = ({ posts, error = false }: { posts: Post[]; error?: boolean }) => {
  const articles = mapPostsToArticles(posts)
  const displayArticles = articles.slice(0, 5)

  return (
    <section className="bg-ink text-paper w-full px-4 py-24">
      <div className="mx-auto w-full max-w-3xl">
        {/* Section Header */}
        <Reveal>
          <header className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className={`${instrumentSerif.className} text-paper text-4xl leading-none md:text-5xl`}>writing</h2>
              <p className="text-paper-dim mt-4 max-w-md font-light">
                I mostly write about tech and some personal thoughts on stuff I read.
              </p>
            </div>

            <Link
              href="/blogs"
              className="font-ui group text-brass hover:border-brass hover:text-paper flex items-center gap-1.5 border-b border-transparent pb-1 text-[0.7rem] tracking-[0.25em] uppercase transition-colors"
            >
              View all
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </header>
        </Reveal>

        {/* The List */}
        {error ? (
          <div className="border-hairline flex items-center justify-center border-y py-20">
            <p className="text-faint font-light">Couldn&apos;t load posts right now — try again in a bit.</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-faint font-light">No posts available yet.</p>
          </div>
        ) : (
          <div className="border-hairline border-b">
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
