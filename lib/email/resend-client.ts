import { Resend } from "resend"
import { env } from "@/lib/env"
import { buildWaitlistWelcomeEmail } from "./templates/waitlist-welcome"

let _resend: Resend | null = null

function getResend(): Resend {
  if (_resend) return _resend
  _resend = new Resend(env().RESEND_API_KEY)
  return _resend
}

export async function sendWaitlistWelcomeEmail({
  to,
  unsubscribeUrl,
}: {
  to: string
  unsubscribeUrl: string
}) {
  const { PUBLIC_BASE_URL } = env()
  const { subject, html } = buildWaitlistWelcomeEmail({
    unsubscribeUrl,
    publicBaseUrl: PUBLIC_BASE_URL,
  })

  const { error } = await getResend().emails.send({
    from: env().RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  })

  if (error) {
    console.error("[resend] falha ao enviar email:", error)
    throw new Error("Falha ao enviar email de boas-vindas")
  }
}
