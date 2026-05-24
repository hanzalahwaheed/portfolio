import { env } from "cloudflare:workers"
import { drizzle } from "drizzle-orm/d1"
import * as schema from "./schema"

type WorkerEnv = {
  DB?: D1Database
}

const database = (env as WorkerEnv).DB

if (!database) {
  throw new Error("DB D1 binding is not set")
}

export const db = drizzle(database, { schema })

export * from "./schema"
