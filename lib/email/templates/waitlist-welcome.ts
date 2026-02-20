/**
 * Valida que a URL de descadastro e segura para uso no email (evita XSS via javascript:/data:).
 * Deve ser sempre montada no servidor como PUBLIC_BASE_URL + path fixo + token gerado.
 */
function assertUnsubscribeUrlSafe(unsubscribeUrl: string, publicBaseUrl: string): void {
  const base = publicBaseUrl.replace(/\/$/, "")
  if (!unsubscribeUrl.startsWith(base)) {
    throw new Error("unsubscribeUrl deve começar com PUBLIC_BASE_URL")
  }
  try {
    const parsed = new URL(unsubscribeUrl)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("unsubscribeUrl deve usar protocolo http ou https")
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("unsubscribeUrl")) throw e
    throw new Error("unsubscribeUrl invalida")
  }
}

export function buildWaitlistWelcomeEmail({
  unsubscribeUrl,
  publicBaseUrl,
}: {
  unsubscribeUrl: string
  publicBaseUrl: string
}) {
  assertUnsubscribeUrlSafe(unsubscribeUrl, publicBaseUrl)
  const subject = "Voce esta na lista — RoadSaaS"

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#121212;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#121212;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1C1C1C;border-radius:8px;padding:40px;">
          <tr>
            <td>
              <h1 style="color:#FF6B00;font-size:24px;margin:0 0 16px;">
                RoadSaaS
              </h1>
              <p style="color:#E5E5E5;font-size:16px;line-height:1.6;margin:0 0 16px;">
                Pronto! Voce entrou na waitlist do RoadSaaS.
              </p>
              <p style="color:#A3A3A3;font-size:14px;line-height:1.6;margin:0 0 24px;">
                Quando abrirmos acesso, voce vai receber um email com os proximos passos.
                Por enquanto, nao precisa fazer mais nada.
              </p>
              <hr style="border:none;border-top:1px solid #404040;margin:24px 0;">
              <p style="color:#737373;font-size:12px;line-height:1.5;margin:0;">
                Se voce nao se inscreveu, pode ignorar este email.<br>
                <a href="${unsubscribeUrl}" style="color:#737373;text-decoration:underline;">Sair da waitlist</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()

  return { subject, html }
}
