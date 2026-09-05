"use client"

import { useState, useEffect, useRef } from "react"
import MarkdownBody from "@/components/blog/markdown-body"
import { Moon, Sun, ArrowLeft, ArrowUp, Mail, Calendar } from "lucide-react"
import { format } from "date-fns"
import type { BlogPost as Post } from "@/lib/blogs"
import { calculateReadTime } from "@/lib/blog-utils"
import Link from "@/components/app-link"
import { instrumentSerif } from "@/lib/fonts"
import { contactLinks } from "@/config"

interface MinimalBlogContentProps {
  post: Post
}

export function MinimalBlogContent({ post }: MinimalBlogContentProps) {
  const [isDark, setIsDark] = useState(true)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [headerRevealed, setHeaderRevealed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme")
    if (savedTheme) {
      setIsDark(savedTheme === "dark")
    } else {
      setIsDark(true)
    }
  }, [post.id])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("blog-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("blog-theme", "light")
    }
  }, [isDark])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      const isScrollingUp = scrollTop < lastScrollY.current
      const isPastHeader = scrollTop > 120

      setReadingProgress(progress)
      setShowBackToTop(scrollTop > 500)
      setIsHeaderVisible(scrollTop < 80 || isScrollingUp || !isPastHeader)
      lastScrollY.current = scrollTop
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeaderRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [post.id])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const readTime = post.readTime || calculateReadTime(post.content)
  const publishedDate = post.createdAt ? format(new Date(post.createdAt), "MMMM d, yyyy") : null
  const reveal = (delay: string) =>
    `transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${delay} ${
      headerRevealed ? "translate-y-0 opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[2px]"
    }`

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-neutral-950 text-neutral-200" : "bg-white text-neutral-800"
      } selection:bg-white selection:text-black dark:selection:bg-white dark:selection:text-black`}
    >
      {/* Reading Progress Bar */}
      <div
        className={`fixed top-0 right-0 left-0 z-50 h-1 transition-all duration-150 ${
          isDark ? "bg-gradient-to-r from-[#66acb6] to-[#4FE0D0]" : "bg-gradient-to-r from-[#0B5964] to-[#66acb6]"
        }`}
        style={{ width: `${readingProgress}%` }}
      />

      {/* Minimal Header */}
      <nav
        className={`fixed top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300 ease-out ${
          isDark ? "border-neutral-800 bg-neutral-950/90" : "border-neutral-200 bg-white/90"
        } ${isHeaderVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"}`}
      >
        <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-6 lg:max-w-4xl xl:max-w-5xl">
          <Link
            href="/blogs"
            aria-label="Back to all posts"
            className={`group inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium shadow-sm transition-all duration-200 ${
              isDark
                ? "border-neutral-800 bg-neutral-900/70 text-neutral-300 shadow-black/20 hover:border-[#66acb6]/40 hover:bg-neutral-900 hover:text-white"
                : "border-neutral-200 bg-white/80 text-neutral-700 shadow-neutral-200/70 hover:border-[#0B5964]/30 hover:bg-neutral-50 hover:text-neutral-950"
            }`}
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="tracking-tight">All posts</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`rounded-lg p-2.5 transition-all duration-200 ${
                isDark
                  ? "text-neutral-500 hover:bg-neutral-900 hover:text-white hover:shadow-lg"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 hover:shadow-lg"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-3xl px-6 pt-32 pb-24 lg:max-w-4xl xl:max-w-5xl">
        {/* Article Title Block — editorial masthead */}
        <header className="mb-16">
          {/* Dateline rule: read time ⟷ date, anchored by a fading hairline */}
          <div className={reveal("delay-0")}>
            <div
              className={`flex items-center justify-between font-mono text-[0.7rem] font-medium tracking-[0.25em] uppercase ${
                isDark ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              <span className="flex items-center gap-2.5">{readTime} read</span>
              {publishedDate && <time className="tabular-nums">{publishedDate}</time>}
            </div>
            <div
              className={`mt-4 h-px w-full ${
                isDark
                  ? "bg-gradient-to-r from-neutral-700 via-neutral-800 to-transparent"
                  : "bg-gradient-to-r from-neutral-300 via-neutral-200 to-transparent"
              }`}
            />
          </div>

          {/* Title */}
          <h1
            className={`${instrumentSerif.className} mt-10 text-4xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl ${reveal("delay-100")} ${
              isDark ? "text-white" : "text-neutral-900"
            }`}
          >
            {post.title}
          </h1>

          {/* Byline: profile photo + name (Instrument Sans) + role */}
          <div className={`group mt-12 flex items-center gap-4 ${reveal("delay-200")}`}>
            <div className="relative shrink-0">
              <img
                src="/images/pfp.webp"
                alt="Hanzalah Waheed"
                className={`h-14 w-14 rounded-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 ${
                  isDark ? "ring-turquoise/30 ring-1" : "ring-deep-teal/25 ring-1"
                }`}
              />
              <span
                className={`pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ${
                  isDark ? "ring-white/10" : "ring-black/5"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span
                className={`font-instrument text-lg font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-neutral-900"
                }`}
              >
                Hanzalah Waheed
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className={`mb-20 transition-all duration-700 ${isDark ? "opacity-90" : "opacity-95"}`}>
            <div
              className={`relative overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-2xl ${
                isDark
                  ? "border-neutral-800 shadow-xl shadow-neutral-950/50"
                  : "border-neutral-200 shadow-xl shadow-neutral-300/30"
              }`}
            >
              <img
                src={post.coverImage}
                alt={`Cover image for ${post.title}`}
                fetchPriority="high"
                decoding="async"
                className="h-auto w-full transition-transform duration-700 hover:scale-[1.02]"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isDark ? "from-neutral-950/20 to-transparent" : "from-white/10 to-transparent"
                }`}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <article ref={contentRef}>
          <div
            className={`markdown-content prose prose-lg max-w-none font-sans font-light ${
              isDark ? "prose-invert text-neutral-300" : "text-neutral-700"
            }`}
          >
            <MarkdownBody content={post.content} isDark={isDark} />
          </div>
        </article>

        <footer
          className={`mt-24 border-t pt-10 ${
            isDark ? "border-neutral-800 text-neutral-300" : "border-neutral-200 text-neutral-700"
          }`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2
                className={`${instrumentSerif.className} mt-3 text-3xl leading-tight tracking-tight ${
                  isDark ? "text-white" : "text-neutral-950"
                }`}
              >
                Want to talk about this?
              </h2>
              <p className={`mt-3 text-base leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                Send me a note if this sparked an idea, a question, or something worth building.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <a
                href={`mailto:${contactLinks.email}`}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-200 sm:w-44 ${
                  isDark
                    ? "bg-[#66acb6] text-neutral-950 hover:bg-[#7fc3cc]"
                    : "bg-[#0B5964] text-white hover:bg-[#0f6f7d]"
                }`}
              >
                <Mail size={16} />
                Email me
              </a>
              <a
                href={contactLinks.scheduleCall}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium transition-all duration-200 sm:w-44 ${
                  isDark
                    ? "border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 hover:text-white"
                    : "border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <Calendar size={16} />
                Book a call
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed right-8 bottom-8 z-50 rounded-xl p-4 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${
            isDark
              ? "bg-[#66acb6] text-white shadow-[#66acb6]/20 hover:shadow-[#66acb6]/30"
              : "bg-[#0B5964] text-white shadow-[#0B5964]/20 hover:shadow-[#0B5964]/30"
          }`}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Highlight.js styles */}
      <style>{`
        /* Modern Syntax Highlighting Theme */
        .hljs {
          background: transparent !important;
          padding: 0 !important;
        }
        .hljs-comment,
        .hljs-quote {
          color: ${isDark ? "#6b7280" : "#9ca3af"} !important;
          font-style: italic;
        }
        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-type {
          color: ${isDark ? "#c084fc" : "#9333ea"} !important;
          font-weight: 500;
        }
        .hljs-string,
        .hljs-literal {
          color: ${isDark ? "#4ade80" : "#16a34a"} !important;
        }
        .hljs-number {
          color: ${isDark ? "#fb923c" : "#ea580c"} !important;
        }
        .hljs-function,
        .hljs-title {
          color: ${isDark ? "#60a5fa" : "#2563eb"} !important;
        }
        .hljs-variable,
        .hljs-template-variable {
          color: ${isDark ? "#facc15" : "#ca8a04"} !important;
        }
        .hljs-attr,
        .hljs-attribute {
          color: ${isDark ? "#f472b6" : "#db2777"} !important;
        }
        .hljs-tag,
        .hljs-name {
          color: ${isDark ? "#f87171" : "#dc2626"} !important;
        }
        .hljs-regexp,
        .hljs-link {
          color: ${isDark ? "#4ade80" : "#16a34a"} !important;
        }
        .hljs-built_in,
        .hljs-builtin-name {
          color: ${isDark ? "#22d3ee" : "#0891b2"} !important;
        }
        .hljs-meta {
          color: ${isDark ? "#6b7280" : "#9ca3af"} !important;
        }
        .hljs-deletion {
          background: ${isDark ? "rgba(248, 113, 113, 0.1)" : "rgba(220, 38, 38, 0.1)"} !important;
          color: ${isDark ? "#fca5a5" : "#ef4444"} !important;
        }
        .hljs-addition {
          background: ${isDark ? "rgba(74, 222, 128, 0.1)" : "rgba(22, 163, 74, 0.1)"} !important;
          color: ${isDark ? "#86efac" : "#22c55e"} !important;
        }
        .hljs-emphasis {
          font-style: italic;
        }
        .hljs-strong {
          font-weight: bold;
        }
        .hljs-operator {
          color: ${isDark ? "#9ca3af" : "#6b7280"} !important;
        }
        .hljs-punctuation {
          color: ${isDark ? "#9ca3af" : "#6b7280"} !important;
        }
      `}</style>
    </div>
  )
}
