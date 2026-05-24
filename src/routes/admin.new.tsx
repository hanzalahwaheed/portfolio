import { createFileRoute } from "@tanstack/react-router"
import { Editor } from "@/components/blog/editor"
import { ensureAdmin } from "@/lib/admin-auth"
import { createPost } from "@/lib/blogs"

export const Route = createFileRoute("/admin/new")({
  loader: () => ensureAdmin(),
  component: NewPostPage,
})

function NewPostPage() {
  return <Editor action={formData => createPost({ data: formData })} />
}
