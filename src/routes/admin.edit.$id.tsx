import { createFileRoute, notFound } from "@tanstack/react-router"
import { Editor } from "@/components/blog/editor"
import { getPostAdmin, updatePost } from "@/lib/blogs"

export const Route = createFileRoute("/admin/edit/$id")({
  loader: async ({ params }) => {
    const post = await getPostAdmin({ data: { id: params.id } })
    if (!post) {
      throw notFound()
    }
    return post
  },
  component: EditPostPage,
})

function EditPostPage() {
  const post = Route.useLoaderData()
  return (
    <Editor
      post={post}
      action={formData => {
        formData.set("id", post.id)
        return updatePost({ data: formData })
      }}
    />
  )
}
