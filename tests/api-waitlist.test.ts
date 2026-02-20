import { describe, it, expect, afterAll } from "vitest"
import crypto from "crypto"
import { env } from "@/lib/env"
import { supabaseAdmin } from "@/lib/supabase/admin"

const testEmail = `test-api-${Date.now()}@test.com`
const testEmailNormalized = testEmail.toLowerCase().trim()
const insertedIds: string[] = []

function hashToken(token: string): string {
  return crypto
    .createHmac("sha256", env().WAITLIST_UNSUBSCRIBE_SECRET)
    .update(token)
    .digest("hex")
}

afterAll(async () => {
  const db = supabaseAdmin()
  for (const id of insertedIds) {
    await db.from("waitlist_signups").delete().eq("id", id)
  }
  // Limpa por email tambem (caso o id nao tenha sido capturado)
  await db.from("waitlist_signups").delete().eq("email_normalized", testEmailNormalized)
})

describe("POST /api/waitlist — logica de inscricao", () => {
  const db = supabaseAdmin()

  it("deve inserir registro com email + UTMs e gerar unsubscribe token", async () => {
    const emailNormalized = testEmailNormalized
    const unsubscribeToken = crypto.randomBytes(32).toString("hex")
    const tokenHash = hashToken(unsubscribeToken)
    const ipHash = crypto
      .createHmac("sha256", env().WAITLIST_UNSUBSCRIBE_SECRET)
      .update("127.0.0.1")
      .digest("hex")

    const { data, error } = await db
      .from("waitlist_signups")
      .insert({
        email: testEmail,
        email_normalized: emailNormalized,
        source: "landing",
        utm_source: "google",
        utm_medium: "cpc",
        utm_campaign: "launch",
        utm_term: "saas",
        utm_content: "hero",
        referrer: "https://google.com",
        landing_path: "/",
        user_agent: "vitest",
        ip_hash: ipHash,
        unsubscribe_token_hash: tokenHash,
      })
      .select()
      .single()

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data!.email).toBe(testEmail)
    expect(data!.email_normalized).toBe(emailNormalized)
    expect(data!.status).toBe("subscribed")
    expect(data!.unsubscribe_token_hash).toBe(tokenHash)
    expect(data!.utm_source).toBe("google")

    insertedIds.push(data!.id)
  })

  it("deve rejeitar email duplicado (unique constraint)", async () => {
    const { error } = await db.from("waitlist_signups").insert({
      email: testEmail,
      email_normalized: testEmailNormalized,
    })

    expect(error).not.toBeNull()
    expect(error!.code).toBe("23505")
  })

  it("deve detectar duplicado via select (fluxo da rota)", async () => {
    const { data } = await db
      .from("waitlist_signups")
      .select("id, status")
      .eq("email_normalized", testEmailNormalized)
      .single()

    expect(data).toBeDefined()
    expect(data!.status).toBe("subscribed")
  })
})

describe("POST /api/waitlist/unsubscribe — logica de descadastro", () => {
  const db = supabaseAdmin()

  it("deve encontrar registro pelo hash do token", async () => {
    // Busca o registro inserido no teste anterior
    const { data: signup } = await db
      .from("waitlist_signups")
      .select("id, unsubscribe_token_hash")
      .eq("email_normalized", testEmailNormalized)
      .single()

    expect(signup).toBeDefined()
    expect(signup!.unsubscribe_token_hash).toBeDefined()

    // Busca pelo hash
    const { data: found } = await db
      .from("waitlist_signups")
      .select("id")
      .eq("unsubscribe_token_hash", signup!.unsubscribe_token_hash)
      .single()

    expect(found).toBeDefined()
    expect(found!.id).toBe(signup!.id)
  })

  it("deve marcar como unsubscribed e setar unsubscribed_at", async () => {
    const { data: signup } = await db
      .from("waitlist_signups")
      .select("id")
      .eq("email_normalized", testEmailNormalized)
      .single()

    const { error } = await db
      .from("waitlist_signups")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", signup!.id)

    expect(error).toBeNull()

    // Verificar
    const { data: updated } = await db
      .from("waitlist_signups")
      .select("status, unsubscribed_at")
      .eq("id", signup!.id)
      .single()

    expect(updated!.status).toBe("unsubscribed")
    expect(updated!.unsubscribed_at).toBeDefined()
  })

  it("deve ser idempotente (update de registro ja unsubscribed)", async () => {
    const { data: signup } = await db
      .from("waitlist_signups")
      .select("id, status")
      .eq("email_normalized", testEmailNormalized)
      .single()

    expect(signup!.status).toBe("unsubscribed")

    // Tentar de novo — nao deve dar erro
    const { error } = await db
      .from("waitlist_signups")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", signup!.id)

    expect(error).toBeNull()
  })

  it("deve retornar null para token hash inexistente", async () => {
    const fakeHash = hashToken("token-que-nao-existe-" + Date.now())

    const { data, error } = await db
      .from("waitlist_signups")
      .select("id")
      .eq("unsubscribe_token_hash", fakeHash)
      .single()

    // single() retorna erro quando nao encontra
    expect(data).toBeNull()
    expect(error).not.toBeNull()
  })
})

describe("validacoes de seguranca", () => {
  it("deve gerar hashes diferentes para tokens diferentes", () => {
    const token1 = crypto.randomBytes(32).toString("hex")
    const token2 = crypto.randomBytes(32).toString("hex")

    expect(hashToken(token1)).not.toBe(hashToken(token2))
  })

  it("deve gerar hash determinístico para o mesmo token", () => {
    const token = "fixed-token-for-test"
    expect(hashToken(token)).toBe(hashToken(token))
  })

  it("ip_hash deve ser diferente do IP puro", () => {
    const ip = "192.168.1.1"
    const hash = crypto
      .createHmac("sha256", env().WAITLIST_UNSUBSCRIBE_SECRET)
      .update(ip)
      .digest("hex")

    expect(hash).not.toBe(ip)
    expect(hash.length).toBe(64) // sha256 hex
  })
})
