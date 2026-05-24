import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { desc, eq } from "drizzle-orm"
import { uuidv7 } from "uuidv7"
import { db, posts, type Post } from "@/db"

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

function serializePost(post: Post): BlogPost {
  return {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

function readPostFormData(formData: FormData) {
  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    coverImage: (formData.get("coverImage") as string) || null,
    published: formData.get("published") === "on",
  }
}

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const result = await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt))
  return result.map(serializePost)
})

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const result = await db.select().from(posts).where(eq(posts.slug, data.slug)).limit(1)
    return result[0] ? serializePost(result[0]) : null
  })

export const getAllPostsAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("@/lib/admin-auth.server")
  requireAdmin()
  const result = await db.select().from(posts).orderBy(desc(posts.createdAt))
  return result.map(serializePost)
})

export const getPostAdmin = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("@/lib/admin-auth.server")
    requireAdmin()
    const result = await db.select().from(posts).where(eq(posts.id, data.id)).limit(1)
    return result[0] ? serializePost(result[0]) : null
  })

export const createPost = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => data)
  .handler(async ({ data }) => {
    const { requireAdminForMutation } = await import("@/lib/admin-auth.server")
    requireAdminForMutation()
    const values = readPostFormData(data)

    await db.insert(posts).values({
      id: uuidv7(),
      ...values,
      publishedAt: values.published ? new Date() : null,
      updatedAt: new Date(),
    })

    throw redirect({ to: "/admin" })
  })

export const updatePost = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; formData: FormData }) => data)
  .handler(async ({ data }) => {
    const { requireAdminForMutation } = await import("@/lib/admin-auth.server")
    requireAdminForMutation()
    const values = readPostFormData(data.formData)

    await db
      .update(posts)
      .set({
        ...values,
        publishedAt: values.published ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, data.id))

    throw redirect({ to: "/admin" })
  })

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdminForMutation } = await import("@/lib/admin-auth.server")
    requireAdminForMutation()
    await db.delete(posts).where(eq(posts.id, data.id))
    return { ok: true }
  })
