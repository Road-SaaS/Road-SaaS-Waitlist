# Task 9 — UTM + UTMiFy (attribution)

**Status:** Concluida
**Data:** 2026-02-20

---

## O que foi feito

### 1. `lib/client/utm.ts` — atualizado

Captura completa de parametros de tracking:
- UTMs padrao: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Extras: `gclid` (Google Ads), `fbclid` (Facebook Ads), `ref` (referral customizado)
- Metadados: `document.referrer`, `window.location.pathname`
- `user_agent` capturado server-side via header na rota API

Persistencia:
- localStorage com chave `roadsaas_utm`
- TTL de 7 dias (expira automaticamente)
- Graceful fallback se localStorage indisponivel

### 2. `app/layout.tsx` — script UTMiFy adicionado

- Script `https://cdn.utmify.com.br/scripts/utms/latest.js` com `strategy="afterInteractive"`
- Atributo `data-utmify-prevent-subids` (evita sub-ids automaticos)

### Arquivos modificados

- `lib/client/utm.ts` — adicionado gclid, fbclid, ref
- `app/layout.tsx` — adicionado script UTMiFy
