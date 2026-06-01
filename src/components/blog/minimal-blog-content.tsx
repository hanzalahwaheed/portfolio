"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import hljs from "highlight.js"

hljs.configure({
  languages: [
    "javascript",
    "typescript",
    "js",
    "ts",
    "tsx",
    "jsx",
    "css",
    "html",
    "json",
    "python",
    "bash",
    "shell",
    "markdown",
    "md",
  ],
})
import { Copy, Check, Moon, Sun, BookOpen, Clock, ChevronRight, ArrowUp } from "lucide-react"
import { format } from "date-fns"
import type { BlogPost as Post } from "@/lib/blogs"
import { calculateReadTime } from "@/lib/blog-utils"
import Link from "@/components/app-link"
import { instrumentSerif } from "@/lib/fonts"

// Custom remark plugin to wrap standalone code in paragraphs
const remarkWrapStandaloneCode = () => {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === "paragraph") {
        const children = node.children
        // Check if paragraph contains only code elements with optional whitespace
        const hasOnlyCode = children.every(
          (child: any) => child.type === "code" || (child.type === "text" && child.value.trim() === ""),
        )

        if (hasOnlyCode && children.length > 1) {
          // Split into separate paragraphs
          const newChildren: any[] = []
          children.forEach((child: any) => {
            if (child.type === "code") {
              newChildren.push({ type: "paragraph", children: [child] })
            }
          })
          node.children = newChildren
        }
      }
      if (node.children) {
        node.children.forEach(visit)
      }
    }
    visit(tree)
  }
}

interface MinimalBlogContentProps {
  post: Post
}

export function MinimalBlogContent({ post }: MinimalBlogContentProps) {
  const [isDark, setIsDark] = useState(true)
  const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Record<string, boolean>>({})
  const codeBlockCounter = useRef(0)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme")
    if (savedTheme) {
      setIsDark(savedTheme === "dark")
    } else {
      setIsDark(true)
    }
    codeBlockCounter.current = 0
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
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setReadingProgress(progress)
      setShowBackToTop(scrollTop > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const handleCopyCode = async (code: string, index: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodeBlocks(prev => ({ ...prev, [index]: true }))
      setTimeout(() => {
        setCopiedCodeBlocks(prev => ({ ...prev, [index]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const readTime = post.readTime || calculateReadTime(post.content)
  const publishedDate = post.createdAt ? format(new Date(post.createdAt), "MMMM d, yyyy") : null

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
        className={`fixed top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
          isDark ? "border-neutral-800 bg-neutral-950/90" : "border-neutral-200 bg-white/90"
        }`}
      >
        <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-6 lg:max-w-4xl xl:max-w-5xl">
          <Link href="/blogs" className="group flex items-center gap-2 text-sm transition-all">
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${
                isDark
                  ? "text-neutral-500 group-hover:-translate-x-1 group-hover:text-white"
                  : "text-neutral-600 group-hover:-translate-x-1 group-hover:text-neutral-900"
              }`}
            />
            <span
              className={`font-medium tracking-tight transition-colors ${
                isDark ? "text-neutral-400 group-hover:text-white" : "text-neutral-600 group-hover:text-neutral-900"
              }`}
            >
              All Posts
            </span>
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
        {/* Article Title Block */}
        <header className="mb-16">
          <div className="flex flex-col gap-6">
            <div
              className={`flex flex-wrap items-center gap-3 font-mono text-xs font-medium tracking-wider uppercase ${
                isDark ? "text-neutral-500" : "text-neutral-500"
              }`}
            >
              {publishedDate && (
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>{publishedDate}</span>
                </div>
              )}
              {publishedDate && (
                <span className={`h-1 w-1 rounded-full ${isDark ? "bg-neutral-600" : "bg-neutral-400"}`} />
              )}
              <div className="flex items-center gap-2">
                <BookOpen size={12} />
                <span>{readTime} read</span>
              </div>
            </div>
            <h1
              className={`${instrumentSerif.className} text-4xl leading-[1.1] tracking-tight md:text-6xl lg:text-7xl ${
                isDark ? "text-white" : "text-neutral-900"
              }`}
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-4 pt-4">
              <div
                className={`h-12 w-px ${isDark ? "bg-gradient-to-b from-neutral-700 to-transparent" : "bg-gradient-to-b from-neutral-300 to-transparent"}`}
              />
              <div className="flex flex-col gap-1">
                <span className={`font-mono text-sm font-medium ${isDark ? "text-neutral-300" : "text-neutral-700"}`}>
                  Hanzalah Waheed
                </span>
                <span className={`font-mono text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                  Software Engineer · Execution-First
                </span>
              </div>
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
                alt={post.title}
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkWrapStandaloneCode]}
              rehypePlugins={[[rehypeHighlight], rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h2
                    className={`${instrumentSerif.className} my-8 scroll-mt-24 text-4xl leading-tight font-bold tracking-tight md:text-5xl ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h2
                    className={`${instrumentSerif.className} my-10 mt-16 scroll-mt-24 text-3xl leading-tight font-bold tracking-tight md:text-4xl ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3
                    className={`${instrumentSerif.className} my-8 scroll-mt-24 text-2xl leading-tight font-semibold md:text-3xl ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4
                    className={`${instrumentSerif.className} my-6 scroll-mt-24 text-xl font-semibold md:text-2xl ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="mb-8 text-lg leading-relaxed font-light antialiased md:text-xl">{children}</p>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className={`${instrumentSerif.className} my-10 border-l-4 pl-6 text-xl leading-relaxed italic ${
                      isDark
                        ? "border-[#66acb6] bg-neutral-900/50 text-neutral-300"
                        : "border-[#0B5964] bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => <ul className="my-6 ml-6 list-disc space-y-4 font-light">{children}</ul>,
                ol: ({ children }) => <ol className="my-6 ml-6 list-decimal space-y-4 font-light">{children}</ol>,
                li: ({ children }) => (
                  <li
                    className={`text-lg leading-relaxed font-light md:text-xl ${isDark ? "text-neutral-300 marker:text-[#66acb6]" : "text-neutral-700 marker:text-[#0B5964]"}`}
                  >
                    {children}
                  </li>
                ),
                hr: () => <hr className={`my-16 border-2 ${isDark ? "border-neutral-800" : "border-neutral-200"}`} />,
                strong: ({ children }) => (
                  <strong className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className={`border-b-2 pb-0.5 font-medium transition-all duration-200 hover:pb-1 ${
                      isDark
                        ? "border-[#66acb6] text-[#66acb6] hover:border-white hover:text-white hover:shadow-[0_2px_8px_rgba(102,172,182,0.3)]"
                        : "border-[#0B5964] text-[#0B5964] hover:border-neutral-900 hover:text-neutral-900 hover:shadow-[0_2px_8px_rgba(11,89,100,0.2)]"
                    }`}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children, node, ...props }: any) => {
                  // Detect inline vs block code:
                  // - Fenced code blocks (```) have a parent <pre> element
                  // - Inline code (`) does not have a parent <pre> element
                  // Note: rehype-highlight only adds language class when a language is specified
                  const match = /language-(\w+)/.exec(className || "")
                  const codeString = String(children).replace(/\n$/, "")
                  // Check if this is block code by looking at parent element or if content has newlines
                  const isBlock =
                    node?.tagName === "pre" ||
                    node?.parentElement?.tagName?.toLowerCase() === "pre" ||
                    (codeString.includes("\n") && !match) ||
                    !!match
                  const language = match ? match[1] : "plaintext"
                  const isInline = !isBlock

                  let currentIndex = ""
                  if (!isInline) {
                    currentIndex = `code-${codeBlockCounter.current++}`
                  }

                  if (isInline) {
                    return (
                      <code
                        className={`inline-code rounded-none px-2 py-0.5 font-mono text-sm transition-all duration-200 ${
                          isDark
                            ? "border-b-2 border-[#66acb6]/50 bg-[#66acb6]/10 text-[#66acb6]"
                            : "border-b-2 border-[#0B5964]/50 bg-[#0B5964]/10 text-[#0B5964]"
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }

                  return (
                    <div
                      className={`my-10 overflow-hidden rounded-none border shadow-lg transition-all duration-300 hover:shadow-xl ${
                        isDark
                          ? "border-neutral-800 bg-neutral-900 shadow-neutral-950/30"
                          : "border-neutral-200 bg-neutral-50 shadow-neutral-300/20"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between border-b px-5 py-3 ${
                          isDark ? "border-neutral-800 bg-neutral-900" : "border-neutral-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-none border px-2.5 py-1 font-mono text-xs font-medium tracking-wider uppercase ${
                              isDark
                                ? "border-[#66acb6]/30 bg-[#66acb6]/10 text-[#66acb6]"
                                : "border-[#0B5964]/30 bg-[#0B5964]/10 text-[#0B5964]"
                            }`}
                          >
                            {language}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyCode(codeString, currentIndex)}
                          className={`rounded-none border px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            isDark
                              ? "border-neutral-700 text-neutral-400 hover:border-[#66acb6] hover:text-[#66acb6]"
                              : "border-neutral-300 text-neutral-600 hover:border-[#0B5964] hover:text-[#0B5964]"
                          }`}
                        >
                          {copiedCodeBlocks[currentIndex] ? (
                            <span className="flex items-center gap-1.5">
                              <Check size={14} />
                              Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Copy size={14} />
                              Copy
                            </span>
                          )}
                        </button>
                      </div>
                      <div className="overflow-x-auto p-5">
                        <pre
                          className={`font-mono text-sm leading-relaxed ${
                            isDark ? "text-neutral-300" : "text-neutral-700"
                          }`}
                        >
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )
                },
                table: ({ children }) => (
                  <div className="my-10 overflow-x-auto rounded-none border shadow-md">
                    <table
                      className={`w-full border-collapse text-left ${isDark ? "border-neutral-800" : "border-neutral-200"}`}
                    >
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead
                    className={`font-semibold ${
                      isDark ? "bg-neutral-900 text-neutral-200" : "bg-neutral-100 text-neutral-900"
                    }`}
                  >
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                  <tr
                    className={`border-b transition-all duration-200 ${
                      isDark ? "border-neutral-800 hover:bg-neutral-900/50" : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th
                    className={`border px-6 py-4 text-sm tracking-wider uppercase ${
                      isDark ? "border-neutral-800" : "border-neutral-200"
                    }`}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    className={`border px-6 py-4 text-sm ${
                      isDark ? "border-neutral-800 text-neutral-300" : "border-neutral-200 text-neutral-700"
                    }`}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
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
