# Task 12 — Checklist final (aceite)

**Status:** Concluida
**Data:** 2026-02-20

---

## Checklist de aceite

| Item | Status | Evidencia |
|------|--------|-----------|
| `POST /api/waitlist` grava no Supabase (dedupe ok) | OK | `tests/api-waitlist.test.ts` — insert + unique constraint 23505 |
| Rate limit funcionando (429) | OK | `tests/rate-limit.test.ts` — bloqueia apos 5 req/10min |
| Email transacional chegando (Resend) | OK | `tests/resend.test.ts` — envio real para `delivered@resend.dev` |
| Link de descadastro funciona e e idempotente | OK | `tests/api-waitlist.test.ts` — unsubscribe + re-unsubscribe sem erro |
| UTMs/referrer/landing_path gravando no registro | OK | `tests/api-waitlist.test.ts` — insert com todos os campos UTM |
| Paginas de privacidade linkadas | OK | `/privacy` + link no footer |
| Build/lint passando | OK | `pnpm build` sucesso, `pnpm lint` 0 erros |

## Resultado final

| Comando | Resultado |
|---------|-----------|
| `pnpm test` | **39/39 testes passando** (7 arquivos) |
| `pnpm lint` | **0 erros**, 2 warnings (shadcn/ui) |
| `pnpm build` | **Sucesso** — 7 rotas (2 dynamic, 4 static, 1 not-found) |

## Rotas implementadas

| Rota | Metodo | Tipo | Funcao |
|------|--------|------|--------|
| `/` | GET | Static | Landing page com waitlist form |
| `/api/waitlist` | POST | Dynamic | Inscricao (validacao, rate limit, dedup, insert, email) |
| `/api/waitlist/unsubscribe` | POST | Dynamic | Descadastro idempotente por token |
| `/unsubscribe` | GET | Static | Pagina de confirmacao de descadastro |
| `/privacy` | GET | Static | Politica de privacidade (LGPD) |

## Todas as tasks do TODO.md

| Task | Descricao | Status |
|------|-----------|--------|
| 1 | Dependencias + organizacao de codigo | Concluida |
| 2 | Variaveis de ambiente | Concluida |
| 3 | Banco de dados (Supabase schema) | Concluida |
| 4 | Cliente Supabase (server-only) | Concluida |
| 5 | Rate limit (Upstash Redis) | Concluida |
| 6 | Rotas API (Next App Router) | Concluida |
| 7 | Email transacional (Resend) | Concluida |
| 8 | Integracao no frontend | Concluida |
| 9 | UTM + UTMiFy (attribution) | Concluida |
| 10 | LGPD / Legal minimo | Concluida |
| 11 | Observabilidade + qualidade de build | Concluida |
| 12 | Checklist final (aceite) | Concluida |
