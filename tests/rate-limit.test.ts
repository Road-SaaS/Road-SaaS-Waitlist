import { describe, it, expect } from "vitest"
import { checkWaitlistRateLimit } from "@/lib/rate-limit/waitlist"

describe("lib/rate-limit/waitlist — conexao com Upstash Redis", () => {
  // Usa IP unico por test run pra nao colidir com execucoes anteriores
  const testIp = `test-${Date.now()}-${Math.random().toString(36).slice(2)}`

  it("deve permitir a primeira requisicao", async () => {
    const result = await checkWaitlistRateLimit(testIp)
    expect(result.allowed).toBe(true)
  })

  it("deve permitir multiplas requisicoes dentro do limite (5 req / 10 min)", async () => {
    const ip = `test-multi-${Date.now()}`

    for (let i = 0; i < 4; i++) {
      const result = await checkWaitlistRateLimit(ip)
      expect(result.allowed).toBe(true)
    }
  })

  it("deve bloquear apos exceder o limite", async () => {
    const ip = `test-block-${Date.now()}`

    // Esgota as 5 requisicoes permitidas
    for (let i = 0; i < 5; i++) {
      await checkWaitlistRateLimit(ip)
    }

    // A 6a deve ser bloqueada
    const result = await checkWaitlistRateLimit(ip)
    expect(result.allowed).toBe(false)

    if (!result.allowed) {
      expect(result.retryAfterMs).toBeGreaterThan(0)
    }
  })
})
