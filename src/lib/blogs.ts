import { createServerFn } from "@tanstack/react-start"
import { redirect } from "@tanstack/react-router"
import { desc, eq } from "drizzle-orm"
import { uuidv7 } from "uuidv7"
import { db, posts, type Post } from "@/db"
import { cacheRequest, deleteCachedRequests, getCachedJson, putCachedJson } from "@/lib/cache"

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  readTime: string | null
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
    readTime: (formData.get("readTime") as string) || null,
    published: formData.get("published") === "on",
  }
}

const postsCacheKey = cacheRequest("/cache/blogs")
const publicPostsMaxAge = 60
const publicPostMaxAge = 300

function postCacheKey(slug: string) {
  return cacheRequest(`/cache/blogs/${encodeURIComponent(slug)}`)
}

async function clearPublicPostCache(slugs: Array<string | null | undefined> = []) {
  const uniqueSlugs = [...new Set(slugs.filter((slug): slug is string => Boolean(slug)))]
  await deleteCachedRequests([postsCacheKey, ...uniqueSlugs.map(postCacheKey)])
}

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const cached = await getCachedJson<BlogPost[]>(postsCacheKey)
  if (cached !== undefined) return cached

  const result = await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt))
  const serializedPosts = result.map(serializePost)
  await putCachedJson(postsCacheKey, serializedPosts, publicPostsMaxAge)
  return serializedPosts
})

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const request = postCacheKey(data.slug)
    const cached = await getCachedJson<BlogPost | null>(request)
    if (cached !== undefined) return cached

    const result = await db.select().from(posts).where(eq(posts.slug, data.slug)).limit(1)
    const post = result[0] && result[0].published ? serializePost(result[0]) : null
    await putCachedJson(request, post, publicPostMaxAge)
    return post
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

    await clearPublicPostCache([values.slug])
    throw redirect({ to: "/admin" })
  })

export const updatePost = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => data)
  .handler(async ({ data }) => {
    const { requireAdminForMutation } = await import("@/lib/admin-auth.server")
    requireAdminForMutation()
    const id = data.get("id") as string
    const values = readPostFormData(data)
    const existingPost = await db.select().from(posts).where(eq(posts.id, id)).limit(1)

    await db
      .update(posts)
      .set({
        ...values,
        publishedAt: values.published ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, id))

    await clearPublicPostCache([existingPost[0]?.slug, values.slug])
    throw redirect({ to: "/admin" })
  })

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { requireAdminForMutation } = await import("@/lib/admin-auth.server")
    requireAdminForMutation()
    const existingPost = await db.select().from(posts).where(eq(posts.id, data.id)).limit(1)
    await db.delete(posts).where(eq(posts.id, data.id))
    await clearPublicPostCache([existingPost[0]?.slug])
    return { ok: true }
  })
