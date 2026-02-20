import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { env } from "@/lib/env"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { checkWaitlistRateLimit } from "@/lib/rate-limit/waitlist"
import { sendWaitlistWelcomeEmail } from "@/lib/email/resend-client"
import { isAllowedOrigin } from "@/lib/security/request-origin"

const MAX_FIELD_LENGTH = 500

const waitlistSchema = z.object({
  email: z.string().email().max(320),
  utm_source: z.string().max(MAX_FIELD_LENGTH).nullish(),
  utm_medium: z.string().max(MAX_FIELD_LENGTH).nullish(),
  utm_campaign: z.string().max(MAX_FIELD_LENGTH).nullish(),
  utm_term: z.string().max(MAX_FIELD_LENGTH).nullish(),
  utm_content: z.string().max(MAX_FIELD_LENGTH).nullish(),
  referrer: z.string().max(2000).nullish(),
  landingPath: z.string().max(2000).nullish(),
})

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()

  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}

function hashIp(ip: string): string {
  return crypto
    .createHmac("sha256", env().WAITLIST_UNSUBSCRIBE_SECRET)
    .update(ip)
    .digest("hex")
}

function generateUnsubscribeToken(): {
  token: string
  tokenHash: string
} {
  const token = crypto.randomBytes(32).toString("hex")
  const tokenHash = crypto
    .createHmac("sha256", env().WAITLIST_UNSUBSCRIBE_SECRET)
    .update(token)
    .digest("hex")
  return { token, tokenHash }
}

export async function POST(req: NextRequest) {
  try {
    // 0. CSRF: rejeitar requests de origem nao permitida
    if (!isAllowedOrigin(req.headers, env().PUBLIC_BASE_URL)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 })
    }

    // 1. Parse body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body JSON invalido" },
        { status: 400 }
      )
    }

    // 2. Validar com Zod
    const parsed = waitlistSchema.safeParse(body)
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")
      console.error("[waitlist] validacao:", message)
      return NextResponse.json(
        { ok: false, error: "Dados invalidos" },
        { status: 400 }
      )
    }

    const data = parsed.data
    const ip = getClientIp(req)

    // 3. Rate limit (antes de bater no Supabase)
    const rateResult = await checkWaitlistRateLimit(ip)
    if (!rateResult.allowed) {
      console.warn("[waitlist] rate limit:", ip)
      return NextResponse.json(
        { ok: false, error: "Muitas tentativas. Tente novamente em alguns minutos." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateResult.retryAfterMs / 1000)),
          },
        }
      )
    }

    // 4. Normalizar email
    const emailNormalized = data.email.toLowerCase().trim()

    // 5. Verificar duplicado
    const db = supabaseAdmin()
    const { data: existing } = await db
      .from("waitlist_signups")
      .select("id, status")
      .eq("email_normalized", emailNormalized)
      .single()

    if (existing) {
      return NextResponse.json(
        { ok: true, status: existing.status, alreadySubscribed: true },
        { status: 200 }
      )
    }

    // 6. Gerar unsubscribe token
    const { token, tokenHash } = generateUnsubscribeToken()
    const unsubscribeUrl = `${env().PUBLIC_BASE_URL}/unsubscribe?token=${token}`

    // 7. Inserir no Supabase
    const { error: insertError } = await db.from("waitlist_signups").insert({
      email: data.email.trim(),
      email_normalized: emailNormalized,
      source: "landing",
      utm_source: data.utm_source || null,
      utm_medium: data.utm_medium || null,
      utm_campaign: data.utm_campaign || null,
      utm_term: data.utm_term || null,
      utm_content: data.utm_content || null,
      referrer: data.referrer || null,
      landing_path: data.landingPath || null,
      user_agent: req.headers.get("user-agent") || null,
      ip_hash: hashIp(ip),
      unsubscribe_token_hash: tokenHash,
    })

    if (insertError) {
      // Unique violation = duplicado (race condition)
      if (insertError.code === "23505") {
        return NextResponse.json(
          { ok: true, status: "subscribed", alreadySubscribed: true },
          { status: 200 }
        )
      }
      console.error("[waitlist] supabase insert:", insertError)
      return NextResponse.json(
        { ok: false, error: "Erro interno ao salvar inscricao" },
        { status: 500 }
      )
    }

    // 8. Enviar email (fire-and-forget para nao bloquear resposta)
    sendWaitlistWelcomeEmail({
      to: data.email.trim(),
      unsubscribeUrl,
    }).catch((err) => {
      console.error("[waitlist] falha ao enviar email:", err)
    })

    return NextResponse.json(
      { ok: true, status: "subscribed", alreadySubscribed: false },
      { status: 201 }
    )
  } catch (err) {
    console.error("[waitlist] erro inesperado:", err)
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    )
  }
}
