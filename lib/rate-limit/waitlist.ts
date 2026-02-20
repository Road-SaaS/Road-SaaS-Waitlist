import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"

let _limiter: Ratelimit | null = null

function getLimiter(): Ratelimit {
  if (_limiter) return _limiter

  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env()

  const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  })

  _limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "waitlist",
  })

  return _limiter
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number }

/**
 * Rate limit por IP. Seguranca: o parametro `ip` deve vir de headers confiaveis
 * (ex.: x-forwarded-for / x-real-ip atras de proxy/Vercel que sobrescreve com IP real).
 * Headers podem ser forjados pelo cliente; considere rate limit adicional por email_normalized.
 */
export async function checkWaitlistRateLimit(
  ip: string
): Promise<RateLimitResult> {
  const limiter = getLimiter()
  const { success, reset } = await limiter.limit(ip)

  if (success) return { allowed: true }

  return {
    allowed: false,
    retryAfterMs: Math.max(0, reset - Date.now()),
  }
}
