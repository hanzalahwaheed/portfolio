import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router"
import Image from "@/components/app-image"
import { getPosts } from "@/lib/blogs"
import { BlogCard } from "@/components/blog/blog-card"
import { instrumentSerif } from "@/lib/fonts"

export const Route = createFileRoute("/blogs")({
  loader: () => getPosts(),
  head: () => ({
    meta: [
      { title: "Blogs | Hanzalah Waheed" },
      { name: "description", content: "Thoughts, ideas, and tutorials by Hanzalah Waheed." },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
  component: BlogPage,
})

function BlogPage() {
  const pathname = useRouterState({ select: state => state.location.pathname })
  const posts = Route.useLoaderData()

  if (pathname !== "/blogs") {
    return <Outlet />
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-[-1]">
        <Image
          src="/images/image copy 3.png"
          alt="Background"
          fill
          className="object-cover opacity-20 dark:opacity-90"
        />
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
          <p className="text-olive-grey py-16 text-center font-mono text-sm tracking-widest uppercase">
            No posts yet
          </p>
        ) : (
          <div className="flex flex-col">
            {posts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
