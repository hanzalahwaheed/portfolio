import { createServerFn } from "@tanstack/react-start"

const DEFAULT_RESUME_FILE_ID = "1kecex5AqriaNBFcGLWwaEijm6204fLmo"
const INDIA_RESUME_FILE_ID = "1QjiJx9Y9hl8s-jhDPyrF3Tn5PTV_09J3"
const DRIVE_FILE_ID_PATTERN = /^[A-Za-z0-9_-]{20,}$/

function resolveDriveFileId(value: string | undefined, fallback: string) {
  if (!value) return fallback

  const driveFileUrlMatch = value.match(/\/file\/d\/([^/]+)/)
  const fileId = driveFileUrlMatch?.[1] ?? value

  return DRIVE_FILE_ID_PATTERN.test(fileId) ? fileId : fallback
}

export const getResumeFileId = createServerFn({ method: "GET" })
  .inputValidator((data: { variant: "default" | "india" }) => data)
  .handler(async ({ data }) => {
    return data.variant === "india"
      ? resolveDriveFileId(process.env.RESUME_URL_FILE_ID_INDIA, INDIA_RESUME_FILE_ID)
      : resolveDriveFileId(process.env.RESUME_URL_FILE_ID, DEFAULT_RESUME_FILE_ID)
  })
