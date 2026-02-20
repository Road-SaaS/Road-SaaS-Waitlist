import { describe, it, expect } from "vitest"
import { Resend } from "resend"
import { env } from "@/lib/env"
import { buildWaitlistWelcomeEmail } from "@/lib/email/templates/waitlist-welcome"

describe("lib/email — Resend + template", () => {
  describe("template waitlist-welcome", () => {
    it("deve gerar subject e html validos", () => {
      const result = buildWaitlistWelcomeEmail({
        unsubscribeUrl: "https://roadsaas.com/unsubscribe?token=abc123",
        publicBaseUrl: "https://roadsaas.com",
      })

      expect(result.subject).toBe("Voce esta na lista — RoadSaaS")
      expect(result.html).toContain("RoadSaaS")
      expect(result.html).toContain("waitlist")
      expect(result.html).toContain("unsubscribe?token=abc123")
      expect(result.html).toContain("<!DOCTYPE html>")
    })

    it("deve rejeitar unsubscribeUrl que nao comeca com publicBaseUrl", () => {
      expect(() =>
        buildWaitlistWelcomeEmail({
          unsubscribeUrl: "https://evil.com/unsubscribe?token=xyz",
          publicBaseUrl: "https://roadsaas.com",
        })
      ).toThrow("PUBLIC_BASE_URL")
    })

    it("deve rejeitar protocolo nao-http (javascript:, data:)", () => {
      expect(() =>
        buildWaitlistWelcomeEmail({
          unsubscribeUrl: "javascript:alert(1)",
          publicBaseUrl: "javascript:",
        })
      ).toThrow("protocolo")
    })

    it("deve incluir o link de descadastro no html", () => {
      const url = "https://roadsaas.com/unsubscribe?token=xyz"
      const { html } = buildWaitlistWelcomeEmail({
        unsubscribeUrl: url,
        publicBaseUrl: "https://roadsaas.com",
      })
      expect(html).toContain(`href="${url}"`)
    })
  })

  describe("conexao com Resend API", () => {
    it("deve enviar email para endereco de teste (valida API key + envio)", async () => {
      const resend = new Resend(env().RESEND_API_KEY)
      const { subject, html } = buildWaitlistWelcomeEmail({
        unsubscribeUrl: "https://roadsaas.com/unsubscribe?token=test",
        publicBaseUrl: "https://roadsaas.com",
      })

      const { data, error } = await resend.emails.send({
        from: env().RESEND_FROM_EMAIL,
        to: "delivered@resend.dev",
        subject: `[TEST] ${subject}`,
        html,
      })

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data!.id).toBeDefined()
    })
  })
})
