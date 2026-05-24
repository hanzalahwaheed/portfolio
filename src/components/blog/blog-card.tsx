import Link from "@/components/app-link"
import { format } from "date-fns"
import { ArrowUpRight } from "lucide-react"
import type { BlogPost as Post } from "@/lib/blogs"
import { calculateReadTime } from "@/lib/blog-utils"
import { instrumentSerif } from "@/lib/fonts"

interface BlogCardProps {
  post: Post
  index: number
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group border-gold-dust/25 hover:border-gold-dust/70 relative block border-t py-9 transition-colors duration-300 first:border-t-0"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-10">
        <span
          className={`${instrumentSerif.className} text-gold-dust/50 group-hover:text-gold-dust w-12 shrink-0 text-3xl tabular-nums transition-colors duration-300`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex flex-1 flex-col gap-3">
          <div className="text-olive-grey flex flex-wrap items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), "MMM d, yyyy")}</time>
            )}
            {post.publishedAt && <span className="bg-olive-grey/50 h-1 w-1 rounded-full" />}
            <span>{calculateReadTime(post.content)} read</span>
          </div>

          <h2
            className={`${instrumentSerif.className} text-rich-black dark:text-cream group-hover:text-deep-teal dark:group-hover:text-turquoise text-3xl leading-tight font-bold tracking-tight transition-colors duration-300 md:text-4xl`}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-rich-black/70 dark:text-cream/70 line-clamp-2 max-w-2xl leading-relaxed font-light">
              {post.excerpt}
            </p>
          )}
        </div>

        <ArrowUpRight
          className="text-olive-grey/60 group-hover:text-deep-teal dark:group-hover:text-turquoise mt-1 hidden shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:block"
          size={22}
          strokeWidth={1.5}
        />
      </div>
    </Link>
  )
}
