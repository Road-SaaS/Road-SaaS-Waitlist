# Task 5 — Rate limit (Upstash Redis)

**Status:** Concluida (implementada na Task 1)
**Data:** 2026-02-20

---

## O que foi feito

### Arquivo: `lib/rate-limit/waitlist.ts`

- Limiter configurado: **5 requisicoes / 10 minutos** por IP (sliding window)
- Singleton com lazy init do cliente Redis + Ratelimit
- Funcao `checkWaitlistRateLimit(ip)` retorna `{ allowed: true }` ou `{ allowed: false, retryAfterMs }`
- Prefixo `waitlist` no Redis para nao colidir com outros limiters futuros

### Testes: `tests/rate-limit.test.ts` (3 testes)

| Teste | Valida |
|-------|--------|
| Primeira requisicao permitida | Conexao com Upstash funciona |
| Multiplas dentro do limite | 4 req seguidas passam |
| Bloqueio apos exceder | 6a req retorna `allowed: false` com `retryAfterMs > 0` |

### Nota

A extracao de IP dos headers e o retorno HTTP 429 serao implementados na Task 6 (rota `POST /api/waitlist`).
