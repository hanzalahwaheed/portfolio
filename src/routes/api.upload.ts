import { createFileRoute } from "@tanstack/react-router"

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
const maxSize = 5 * 1024 * 1024

const extByType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
}

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { verifyAdmin } = await import("@/lib/admin-auth.server")
          if (!verifyAdmin()) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
          }

          const formData = await request.formData()
          const file = formData.get("file")

          if (!(file instanceof File)) {
            return Response.json({ error: "No file provided" }, { status: 400 })
          }

          if (!allowedTypes.includes(file.type)) {
            return Response.json({ error: "Invalid file type. Allowed: jpg, jpeg, png, gif, webp" }, { status: 400 })
          }

          if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0)
            return Response.json(
              { error: `File size is ${fileSizeMB} MB, maximum allowed is ${maxSizeMB} MB` },
              { status: 400 },
            )
          }

          // Images are committed into the repo and served as static assets from
          // public/. This writes to the local filesystem, so it only works when the
          // editor is run locally (vite dev) — the deployed Worker has a read-only FS.
          const { writeFile, mkdir } = await import("node:fs/promises")
          const path = await import("node:path")

          const baseName = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .toLowerCase()
          const ext = extByType[file.type] ?? "png"
          const fileName = `${Date.now()}-${baseName || "image"}.${ext}`

          const dir = path.join(process.cwd(), "public", "images", "blogs")
          await mkdir(dir, { recursive: true })
          await writeFile(path.join(dir, fileName), new Uint8Array(await file.arrayBuffer()))

          // Public URL served by the static assets handler.
          const url = `/images/blogs/${fileName}`

          return Response.json({ url })
        } catch (error) {
          console.error("Upload error:", error)
          return Response.json({ error: "Upload failed" }, { status: 500 })
        }
      },
    },
  },
})
