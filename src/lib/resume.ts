import { createServerFn } from "@tanstack/react-start"

export const getResumeFileId = createServerFn({ method: "GET" })
  .inputValidator((data: { variant: "default" | "india" }) => data)
  .handler(async ({ data }) => {
    return data.variant === "india"
      ? process.env.RESUME_URL_FILE_ID_INDIA || null
      : process.env.RESUME_URL_FILE_ID || null
  })
