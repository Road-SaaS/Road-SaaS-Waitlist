# Task 1 — Dependencias + Organizacao de codigo (SRP/SoC)

**Status:** Concluida
**Data:** 2026-02-20

---

## O que foi feito

### 1. Dependencias instaladas

| Pacote | Versao | Funcao |
|--------|--------|--------|
| `@supabase/supabase-js` | 2.97.0 | Cliente Supabase (persistencia no banco) |
| `@upstash/redis` | 1.36.2 | Cliente Redis serverless |
| `@upstash/ratelimit` | 2.0.8 | Rate limiting via Upstash Redis |
| `resend` | 6.9.2 | Email transacional |
| `vitest` | 4.0.18 | Framework de testes (devDep) |
| `dotenv` | 17.3.1 | Carregamento de .env nos testes (devDep) |

### 2. Wrappers criados (responsabilidade unica)

| Arquivo | Responsabilidade |
|---------|-----------------|
| `lib/env.ts` | Valida todas as envs com Zod em runtime (fail-fast com mensagem clara) |
| `lib/supabase/admin.ts` | Cliente Supabase server-only com guard contra import no client-side |
| `lib/rate-limit/waitlist.ts` | Rate limiter: 5 req / 10 min por IP (sliding window via Upstash) |
| `lib/email/resend-client.ts` | Funcao `sendWaitlistWelcomeEmail()` — envia email via Resend |
| `lib/email/templates/waitlist-welcome.ts` | Template HTML do email de boas-vindas (paleta RoadSaaS) |

### 3. Variaveis de ambiente

- `.env` renomeado para `.env.local` (protegido pelo `.gitignore`)
- `.env.example` criado com placeholders seguros para commitar

Envs configuradas:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `WAITLIST_UNSUBSCRIBE_SECRET`
- `PUBLIC_BASE_URL`

### 4. Testes (19/19 passando)

| Arquivo | Testes | Valida |
|---------|--------|--------|
| `tests/env.test.ts` | 4 | Carregamento, cache, falha com env ausente, falha com formato invalido |
| `tests/supabase.test.ts` | 4 | Criacao do cliente, singleton, query basica, auth admin (service role) |
| `tests/rate-limit.test.ts` | 3 | Requisicao permitida, multiplas no limite, bloqueio apos exceder |
| `tests/resend.test.ts` | 3 | Template HTML/subject, link descadastro, envio real (`delivered@resend.dev`) |
| `tests/integration.test.ts` | 5 | Todos os servicos conectados + smoke test do fluxo completo |

Scripts adicionados ao `package.json`:
- `pnpm test` — executa todos os testes
- `pnpm test:watch` — modo watch

### 5. Arquivos criados/modificados

**Criados:**
- `lib/env.ts`
- `lib/supabase/admin.ts`
- `lib/rate-limit/waitlist.ts`
- `lib/email/resend-client.ts`
- `lib/email/templates/waitlist-welcome.ts`
- `.env.example`
- `vitest.config.ts`
- `tests/setup.ts`
- `tests/env.test.ts`
- `tests/supabase.test.ts`
- `tests/rate-limit.test.ts`
- `tests/resend.test.ts`
- `tests/integration.test.ts`

**Modificados:**
- `package.json` (dependencias + scripts de teste)
- `.env` -> `.env.local` (renomeado por seguranca)
- `docs/TODO.md` (task 1 marcada como concluida)
