import Link from "@/components/app-link"
import type { BlogPost as Post } from "@/lib/blogs"
import { calculateReadTime } from "@/lib/blog-utils"
import { instrumentSerif } from "@/lib/fonts"

interface BlogCardProps {
  post: Post
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group border-gold-dust/25 hover:border-gold-dust/70 relative block border-t py-9 transition-colors duration-300 first:border-t-0"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <div className="text-olive-grey flex flex-wrap items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            <span>{post.readTime || calculateReadTime(post.content)} read</span>
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
      </div>
    </Link>
  )
}
