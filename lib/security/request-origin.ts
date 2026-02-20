/**
 * @file: request-origin.ts
 * @responsibility: validar Origin/Referer em rotas POST para mitigar CSRF
 * @exports: isAllowedOrigin, getAllowedOriginBases
 * @layer: lib/security
 *
 * Uso nas Route Handlers (POST /api/waitlist, POST /api/waitlist/unsubscribe):
 *   const bases = getAllowedOriginBases(env().PUBLIC_BASE_URL)
 *   if (!isAllowedOrigin(request.headers, bases)) return new Response("Forbidden", { status: 403 })
 */

function getOriginFromHeaders(headers: Headers): string | null {
  return headers.get("origin") ?? headers.get("referer")?.split("?")[0] ?? null
}

/**
 * Normaliza uma base URL (remove barra final).
 */
function normalizeBase(url: string): string {
  return url.replace(/\/$/, "")
}

/**
 * Retorna as bases permitidas para Origin/Referer: PUBLIC_BASE_URL, origens extras
 * definidas em EXTRA_ALLOWED_ORIGINS (separadas por virgula) e, na Vercel, a URL do deployment.
 * Use com isAllowedOrigin(headers, getAllowedOriginBases(env().PUBLIC_BASE_URL)) para evitar 403
 * quando o usuario acessa pelo dominio *.vercel.app ou por dominios alternativos (ex: www vs naked).
 */
export function getAllowedOriginBases(publicBaseUrl: string): string[] {
  const base = normalizeBase(publicBaseUrl)
  const bases = [base]

  // VERCEL_URL e injetado automaticamente pela Vercel (URL do deployment)
  const raw =
    typeof process !== "undefined" ? process.env?.VERCEL_URL : undefined
  const vercelHost = raw?.replace(/^https?:\/\//, "").trim()
  if (vercelHost) {
    const vercelBase = `https://${vercelHost}`
    if (!bases.includes(vercelBase)) bases.push(vercelBase)
  }

  // EXTRA_ALLOWED_ORIGINS: lista separada por virgula para dominios adicionais
  // Ex: "https://www.roadsaas.com,https://roadsaas.com"
  const extra =
    typeof process !== "undefined"
      ? process.env?.EXTRA_ALLOWED_ORIGINS
      : undefined
  if (extra) {
    for (const origin of extra.split(",")) {
      const normalized = normalizeBase(origin.trim())
      if (normalized && !bases.includes(normalized)) bases.push(normalized)
    }
  }

  return bases
}

/**
 * Verifica se o Origin ou Referer da requisicao corresponde a uma das bases permitidas.
 * Reduz risco de POSTs cross-site (CSRF). Use em rotas que mutam estado.
 *
 * @param headers - headers da Request (Next.js: request.headers)
 * @param allowedBaseUrls - uma ou mais URLs base permitidas (ex.: PUBLIC_BASE_URL e URL do deployment Vercel)
 * @returns true se Origin/Referer ausente (clientes que nao enviam) ou se comeca com alguma base permitida
 */
export function isAllowedOrigin(
  headers: Headers,
  allowedBaseUrls: string | string[]
): boolean {
  const origin = getOriginFromHeaders(headers)
  if (!origin) return true
  const bases = Array.isArray(allowedBaseUrls)
    ? allowedBaseUrls.map(normalizeBase)
    : [normalizeBase(allowedBaseUrls)]
  return bases.some(
    (base) => origin === base || origin.startsWith(base + "/")
  )
}
