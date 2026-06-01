import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} environment variable is not set`)
  }
  return value
}

export async function uploadToR2(file: File, key: string) {
  const accountId = getRequiredEnv("R2_ACCOUNT_ID")
  const bucket = getRequiredEnv("R2_BUCKET_NAME")
  const accessKeyId = getRequiredEnv("R2_ACCESS_KEY_ID")
  const secretAccessKey = getRequiredEnv("R2_SECRET_ACCESS_KEY")
  const publicUrl = getRequiredEnv("R2_PUBLIC_URL").replace(/\/$/, "")

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  )

  return `${publicUrl}/${key}`
}
