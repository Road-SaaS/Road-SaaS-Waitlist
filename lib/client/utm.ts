const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

const EXTRA_KEYS = ["gclid", "fbclid", "ref"] as const

const STORAGE_KEY = "roadsaas_utm"
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

type UtmData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landingPath?: string
}

export function captureUtms(): void {
  if (typeof window === "undefined") return

  const params = new URLSearchParams(window.location.search)
  const allKeys = [...UTM_KEYS, ...EXTRA_KEYS]
  const hasTracking = allKeys.some((k) => params.has(k))

  // So salva se tem UTM/tracking na URL (primeira visita com parametros)
  if (!hasTracking) return

  const data: Record<string, string> = {}
  for (const key of allKeys) {
    const val = params.get(key)
    if (val) data[key] = val
  }

  data._referrer = document.referrer || ""
  data._landingPath = window.location.pathname
  data._ts = String(Date.now())

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage indisponivel (modo privado etc)
  }
}

export function getUtmData(): UtmData {
  if (typeof window === "undefined") return {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        referrer: document.referrer || undefined,
        landingPath: window.location.pathname,
      }
    }

    const data = JSON.parse(raw) as Record<string, string>

    // Expirar UTMs antigas
    const ts = Number(data._ts || 0)
    if (Date.now() - ts > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return {
        referrer: document.referrer || undefined,
        landingPath: window.location.pathname,
      }
    }

    return {
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_term: data.utm_term,
      utm_content: data.utm_content,
      referrer: data._referrer || document.referrer || undefined,
      landingPath: data._landingPath || window.location.pathname,
    }
  } catch {
    return {}
  }
}
