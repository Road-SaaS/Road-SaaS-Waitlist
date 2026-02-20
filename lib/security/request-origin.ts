/**
 * @file: request-origin.ts
 * @responsibility: validar Origin/Referer em rotas POST para mitigar CSRF
 * @exports: isAllowedOrigin
 * @layer: lib/security
 *
 * Uso nas Route Handlers (POST /api/waitlist, POST /api/waitlist/unsubscribe):
 *   const allowed = isAllowedOrigin(request.headers, env().PUBLIC_BASE_URL)
 *   if (!allowed) return new Response("Forbidden", { status: 403 })
 */

function getOriginFromHeaders(headers: Headers): string | null {
  return headers.get("origin") ?? headers.get("referer")?.split("?")[0] ?? null
}

/**
 * Verifica se o Origin ou Referer da requisicao corresponde à base URL permitida.
 * Reduz risco de POSTs cross-site (CSRF). Use em rotas que mutam estado.
 *
 * @param headers - headers da Request (Next.js: request.headers)
 * @param allowedBaseUrl - ex.: env().PUBLIC_BASE_URL (https://roadsaas.com)
 * @returns true se Origin/Referer ausente (clientes que nao enviam) ou se comeca com allowedBaseUrl
 */
export function isAllowedOrigin(
  headers: Headers,
  allowedBaseUrl: string
): boolean {
  const origin = getOriginFromHeaders(headers)
  if (!origin) return true // Navegadores antigos ou requests sem Origin; avaliar se aceitar ou rejeitar
  const base = allowedBaseUrl.replace(/\/$/, "")
  return origin === base || origin.startsWith(base + "/")
}
