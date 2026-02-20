import { describe, it, expect, beforeEach, vi } from "vitest"

describe("lib/env — validacao de variaveis de ambiente", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("deve carregar todas as envs obrigatorias sem erro", async () => {
    const { env } = await import("@/lib/env")
    const result = env()

    expect(result.SUPABASE_URL).toBeDefined()
    expect(result.SUPABASE_URL).toMatch(/^https:\/\//)
    expect(result.SUPABASE_SERVICE_ROLE_KEY).toBeDefined()
    expect(result.UPSTASH_REDIS_REST_URL).toBeDefined()
    expect(result.UPSTASH_REDIS_REST_URL).toMatch(/^https:\/\//)
    expect(result.UPSTASH_REDIS_REST_TOKEN).toBeDefined()
    expect(result.RESEND_API_KEY).toBeDefined()
    expect(result.RESEND_API_KEY).toMatch(/^re_/)
    expect(result.RESEND_FROM_EMAIL).toBeDefined()
    expect(result.WAITLIST_UNSUBSCRIBE_SECRET).toBeDefined()
    expect(result.WAITLIST_UNSUBSCRIBE_SECRET.length).toBeGreaterThanOrEqual(32)
    expect(result.PUBLIC_BASE_URL).toBeDefined()
  })

  it("deve retornar a mesma instancia em chamadas consecutivas (cache)", async () => {
    const { env } = await import("@/lib/env")
    const first = env()
    const second = env()
    expect(first).toBe(second)
  })

  it("deve falhar se SUPABASE_URL estiver ausente", async () => {
    const original = process.env.SUPABASE_URL
    delete process.env.SUPABASE_URL

    try {
      const { env } = await import("@/lib/env")
      expect(() => env()).toThrow("Variaveis de ambiente invalidas")
    } finally {
      process.env.SUPABASE_URL = original
    }
  })

  it("deve falhar se RESEND_API_KEY nao comecar com re_", async () => {
    const original = process.env.RESEND_API_KEY
    process.env.RESEND_API_KEY = "invalid_key"

    try {
      const { env } = await import("@/lib/env")
      expect(() => env()).toThrow("Variaveis de ambiente invalidas")
    } finally {
      process.env.RESEND_API_KEY = original
    }
  })
})
