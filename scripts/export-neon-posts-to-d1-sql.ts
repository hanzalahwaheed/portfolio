import "dotenv/config"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import postgres from "postgres"

type NeonPostRow = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  publishedAt: number | null
  createdAt: number
  updatedAt: number
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set")
}

function sqlValue(value: string | number | boolean | null) {
  if (value === null) {
    return "NULL"
  }

  if (typeof value === "number") {
    return String(value)
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0"
  }

  return `'${value.replaceAll("'", "''")}'`
}

const sql = postgres(databaseUrl, { ssl: "require" })

const rows = await sql<NeonPostRow[]>`
  SELECT
    id,
    title,
    slug,
    content,
    excerpt,
    "coverImage",
    published,
    EXTRACT(EPOCH FROM "publishedAt")::integer AS "publishedAt",
    EXTRACT(EPOCH FROM "createdAt")::integer AS "createdAt",
    EXTRACT(EPOCH FROM "updatedAt")::integer AS "updatedAt"
  FROM "Post"
  ORDER BY "createdAt" ASC
`

await sql.end()

const statements = rows.map(row => {
  const values = [
    row.id,
    row.title,
    row.slug,
    row.content,
    row.excerpt,
    row.coverImage,
    row.published,
    row.publishedAt,
    row.createdAt,
    row.updatedAt,
  ]

  return `INSERT OR REPLACE INTO "Post" ("id", "title", "slug", "content", "excerpt", "coverImage", "published", "publishedAt", "createdAt", "updatedAt") VALUES (${values.map(sqlValue).join(", ")});`
})

const outputDir = path.join(process.cwd(), "tmp")
const outputPath = path.join(outputDir, "neon-posts-d1-import.sql")
const contents = [...statements, ""].join("\n")

await mkdir(outputDir, { recursive: true })
await writeFile(outputPath, contents)

console.log(`Exported ${rows.length} posts to ${outputPath}`)
