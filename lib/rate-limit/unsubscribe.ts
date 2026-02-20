import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"
import type { RateLimitResult } from "./waitlist"

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
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    prefix: "unsubscribe",
  })

  return _limiter
}

/**
 * Rate limit por IP no endpoint de unsubscribe.
 * Limite conservador (10/hora) para dificultar brute force em tokens.
 */
export async function checkUnsubscribeRateLimit(
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
