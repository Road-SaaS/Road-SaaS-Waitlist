import { z } from "zod"

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith("re_"),
  RESEND_FROM_EMAIL: z.string().email(),
  WAITLIST_UNSUBSCRIBE_SECRET: z.string().min(32),
  PUBLIC_BASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>

let _env: Env | null = null

export function env(): Env {
  if (_env) return _env

  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n")
    throw new Error(`Variaveis de ambiente invalidas:\n${missing}`)
  }

  _env = parsed.data
  return _env
}
