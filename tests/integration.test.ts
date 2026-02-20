import { describe, it, expect } from "vitest"
import { Resend } from "resend"
import { env } from "@/lib/env"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { checkWaitlistRateLimit } from "@/lib/rate-limit/waitlist"
import { buildWaitlistWelcomeEmail } from "@/lib/email/templates/waitlist-welcome"

describe("integracao — todos os servicos conectados", () => {
  it("env: todas as variaveis carregam corretamente", () => {
    expect(() => env()).not.toThrow()
  })

  it("supabase: cliente conecta e responde", async () => {
    const client = supabaseAdmin()
    const { data, error } = await client.auth.admin.listUsers({ perPage: 1 })
    expect(error).toBeNull()
    expect(data).toBeDefined()
  })

  it("upstash: rate limit responde", async () => {
    const ip = `integration-${Date.now()}`
    const result = await checkWaitlistRateLimit(ip)
    expect(result.allowed).toBe(true)
  })

  it("resend: envio de email funciona", async () => {
    const resend = new Resend(env().RESEND_API_KEY)
    const { subject, html } = buildWaitlistWelcomeEmail({
      unsubscribeUrl: "https://roadsaas.com/unsubscribe?token=integration-test",
      publicBaseUrl: "https://roadsaas.com",
    })

    const { data, error } = await resend.emails.send({
      from: env().RESEND_FROM_EMAIL,
      to: "delivered@resend.dev",
      subject: `[INTEGRATION] ${subject}`,
      html,
    })

    expect(error).toBeNull()
    expect(data?.id).toBeDefined()
  })

  it("fluxo completo: rate limit -> supabase -> resend (smoke test)", async () => {
    // 1. Rate limit permite
    const ip = `smoke-${Date.now()}`
    const rateResult = await checkWaitlistRateLimit(ip)
    expect(rateResult.allowed).toBe(true)

    // 2. Supabase responde (auth admin como prova de conexao)
    const client = supabaseAdmin()
    const { error: supaError } = await client.auth.admin.listUsers({ perPage: 1 })
    expect(supaError).toBeNull()

    // 3. Resend — valida que o cliente instancia sem erro
    // (envio real ja validado no teste individual; evita 429 do rate limit do Resend)
    const resend = new Resend(env().RESEND_API_KEY)
    expect(resend).toBeDefined()
  })
})
