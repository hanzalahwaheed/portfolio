import { createFileRoute, Outlet, useRouter, useRouterState } from "@tanstack/react-router"
import { format } from "date-fns"
import { FileText, Pencil, Plus, Trash2 } from "lucide-react"
import Link from "@/components/app-link"
import { deletePost, getAllPostsAdmin } from "@/lib/blogs"

export const Route = createFileRoute("/admin")({
  loader: () => getAllPostsAdmin(),
  head: () => ({
    meta: [
      { title: "Admin | Hanzalah Waheed" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
})

function AdminPage() {
  const pathname = useRouterState({ select: state => state.location.pathname })
  const posts = Route.useLoaderData()
  const router = useRouter()

  if (pathname !== "/admin") {
    return <Outlet />
  }

  async function handleDelete(id: string) {
    await deletePost({ data: { id } })
    await router.invalidate()
  }

  return (
    <div className="font-instrument min-h-screen bg-black text-neutral-200 selection:bg-neutral-800 selection:text-white">
      <nav className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-neutral-900 bg-black/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <FileText size={16} className="text-neutral-500" />
          <span className="font-instrument text-sm font-medium text-white">Dashboard</span>
          <span className="text-sm text-neutral-800">/</span>
          <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        <Link
          href="/admin/new"
          className="inline-flex h-9 items-center justify-center rounded-sm bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
        >
          <Plus size={14} className="mr-2" />
          New Post
        </Link>
      </nav>

      <main className="pt-14">
        <div className="mx-auto max-w-4xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="font-instrument mb-2 text-3xl text-white">All Posts</h1>
            <p className="font-mono text-sm tracking-widest text-neutral-500 uppercase">Manage your blog content</p>
          </div>

          <div className="overflow-hidden rounded-sm border border-neutral-900">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 border-b border-neutral-900 bg-neutral-900/50 p-4">
              <div className="font-mono text-xs tracking-widest text-neutral-500 uppercase">Title</div>
              <div className="font-mono text-xs tracking-widest text-neutral-500 uppercase">Status</div>
              <div className="font-mono text-xs tracking-widest text-neutral-500 uppercase">Date</div>
              <div className="font-mono text-xs tracking-widest text-neutral-500 uppercase">Actions</div>
            </div>

            {posts.length === 0 ? (
              <div className="p-16 text-center">
                <FileText size={32} className="mx-auto mb-4 text-neutral-700" />
                <p className="font-instrument text-neutral-600 italic">No posts yet. Create your first one!</p>
              </div>
            ) : (
              posts.map(post => (
                <div
                  key={post.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6 border-b border-neutral-900 p-4 transition-colors last:border-0 hover:bg-neutral-900/30"
                >
                  <div className="font-instrument font-medium text-white">{post.title}</div>
                  <div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        post.published ? "border-neutral-600 text-neutral-300" : "border-neutral-800 text-neutral-600"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-neutral-500">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-white"
                    >
                      <Pencil size={14} />
                      <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(post.id)}
                      className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
