# Task 6 — Rotas necessarias (Next App Router)

**Status:** Concluida
**Data:** 2026-02-20

---

## O que foi feito

### 6.1 `POST /api/waitlist` — criar inscricao

**Arquivo:** `app/api/waitlist/route.ts`

Fluxo:
1. Parse e validacao do body com Zod (email obrigatorio, UTMs opcionais, max length)
2. Extracao de IP via `x-forwarded-for` / `x-real-ip`
3. Rate limit via Upstash (antes de tocar no Supabase)
4. Normalizacao do email (`lower + trim`)
5. Verificacao de duplicado (retorna `200 { alreadySubscribed: true }`)
6. Geracao de `unsubscribe_token` (32 bytes random) + hash HMAC-SHA256
7. Insert no Supabase com todos os campos (email, UTMs, referrer, ip_hash, token_hash)
8. Envio de email fire-and-forget via Resend (nao bloqueia resposta)
9. Retorna `201 { ok: true, status: "subscribed", alreadySubscribed: false }`

Respostas:
- `201` — inscrito com sucesso
- `200` — ja estava inscrito (alreadySubscribed: true)
- `400` — body invalido / validacao falhou
- `429` — rate limit (com header Retry-After)
- `500` — erro interno

### 6.2 `POST /api/waitlist/unsubscribe` — descadastro

**Arquivo:** `app/api/waitlist/unsubscribe/route.ts`

Fluxo:
1. Validacao do token (min 32, max 128 chars)
2. Hash HMAC-SHA256 do token
3. Busca registro pelo hash
4. Se ja unsubscribed: retorna `200 { ok: true }` (idempotente)
5. Update `status='unsubscribed'` + `unsubscribed_at=now()`

Respostas:
- `200` — descadastrado (ou ja estava)
- `400` — token invalido
- `404` — token nao encontrado
- `500` — erro interno

### 6.3 Pagina de confirmacao de descadastro

**Arquivo:** `app/unsubscribe/page.tsx`

- Le `?token=` da URL via `useSearchParams()`
- Chama `POST /api/waitlist/unsubscribe`
- Mostra 3 estados: loading, sucesso, erro
- Design seguindo paleta RoadSaaS (dark, orange accent)
- Suspense boundary para SSR

### Seguranca

- Token de descadastro = 32 bytes random (nao e o UUID do registro)
- Apenas o hash e salvo no banco (HMAC-SHA256 com WAITLIST_UNSUBSCRIBE_SECRET)
- IP salvo como hash (nunca IP puro — LGPD)
- Rate limit aplicado antes de qualquer operacao no banco
- Campos com max length para evitar abuso
- Email de boas-vindas enviado fire-and-forget (nao bloqueia resposta)

### Testes: `tests/api-waitlist.test.ts` (10 novos — total 39/39)

| Teste | Valida |
|-------|--------|
| Insert com email + UTMs + token | Fluxo completo de inscricao |
| Rejeitar email duplicado | Unique constraint 23505 |
| Detectar duplicado via select | Fluxo da rota para retornar alreadySubscribed |
| Buscar pelo hash do token | Indice funciona |
| Marcar como unsubscribed | Update status + unsubscribed_at |
| Idempotencia | Re-unsubscribe nao da erro |
| Token inexistente retorna null | 404 esperado |
| Hashes diferentes para tokens diferentes | Seguranca criptografica |
| Hash deterministico | Mesmo token = mesmo hash |
| ip_hash diferente do IP puro | LGPD |

### Arquivos criados

- `app/api/waitlist/route.ts`
- `app/api/waitlist/unsubscribe/route.ts`
- `app/unsubscribe/page.tsx`
- `tests/api-waitlist.test.ts`
