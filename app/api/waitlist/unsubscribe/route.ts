import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { env } from "@/lib/env"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { isAllowedOrigin } from "@/lib/security/request-origin"

const unsubscribeSchema = z.object({
  token: z.string().min(32).max(128),
})

function hashToken(token: string): string {
  return crypto
    .createHmac("sha256", env().WAITLIST_UNSUBSCRIBE_SECRET)
    .update(token)
    .digest("hex")
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req.headers, env().PUBLIC_BASE_URL)) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { ok: false, error: "Body JSON invalido" },
        { status: 400 }
      )
    }

    const parsed = unsubscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Token invalido" },
        { status: 400 }
      )
    }

    const tokenHash = hashToken(parsed.data.token)
    const db = supabaseAdmin()

    // Buscar registro pelo hash do token
    const { data: signup, error: findError } = await db
      .from("waitlist_signups")
      .select("id, status")
      .eq("unsubscribe_token_hash", tokenHash)
      .single()

    if (findError || !signup) {
      return NextResponse.json(
        { ok: false, error: "Token nao encontrado" },
        { status: 404 }
      )
    }

    // Idempotente: se ja esta unsubscribed, retorna sucesso mesmo assim
    if (signup.status === "unsubscribed") {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    // Marcar como unsubscribed
    const { error: updateError } = await db
      .from("waitlist_signups")
      .update({
        status: "unsubscribed",
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("id", signup.id)

    if (updateError) {
      console.error("[unsubscribe] supabase update:", updateError)
      return NextResponse.json(
        { ok: false, error: "Erro ao processar descadastro" },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error("[unsubscribe] erro inesperado:", err)
    return NextResponse.json(
      { ok: false, error: "Erro interno" },
      { status: 500 }
    )
  }
}
