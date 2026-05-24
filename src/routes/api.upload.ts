import { createFileRoute } from "@tanstack/react-router"
import { uploadToR2 } from "@/lib/r2"

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
const maxSize = 5 * 1024 * 1024

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

          const timestamp = Date.now()
          const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
          const key = `uploads/${timestamp}-${originalName}`
          const url = await uploadToR2(file, key)

          return Response.json({ url })
        } catch (error) {
          console.error("Upload error:", error)
          return Response.json({ error: "Upload failed" }, { status: 500 })
        }
      },
    },
  },
})
