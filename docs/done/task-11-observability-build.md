# Task 11 — Observabilidade + qualidade de build (minimo)

**Status:** Concluida
**Data:** 2026-02-20

---

## O que foi feito

### 1. Logs server-side (ja existiam na rota API)

Logs no `POST /api/waitlist`:
- `console.error("[waitlist] validacao:", ...)` — payload invalido
- `console.warn("[waitlist] rate limit:", ip)` — rate limit atingido
- `console.error("[waitlist] supabase insert:", ...)` — erro ao inserir no banco
- `console.error("[waitlist] falha ao enviar email:", ...)` — erro Resend
- `console.error("[waitlist] erro inesperado:", ...)` — catch geral

Logs no `POST /api/waitlist/unsubscribe`:
- `console.error("[unsubscribe] supabase update:", ...)` — erro ao atualizar
- `console.error("[unsubscribe] erro inesperado:", ...)` — catch geral

### 2. `typescript.ignoreBuildErrors` removido

- Removido do `next.config.mjs`
- Build agora valida TypeScript (mensagem "Running TypeScript..." visivel no build)
- Build passa sem erros

### 3. ESLint configurado

- Instalado: `eslint@9`, `typescript-eslint`, `eslint-config-next`
- Config: `eslint.config.mjs` (flat config com typescript-eslint)
- Regras: `no-console` (warn, permite error/warn), `no-unused-vars` (warn)
- Resultado: 0 erros, 2 warnings (em arquivos shadcn/ui nao tocados)

### 4. Build + Lint + Tests

| Comando | Resultado |
|---------|-----------|
| `pnpm lint` | 0 erros, 2 warnings |
| `pnpm build` | Sucesso (TS validado, 7 rotas geradas) |
| `pnpm test` | 39/39 passando |

### Rotas no build

| Rota | Tipo |
|------|------|
| `/` | Static |
| `/_not-found` | Static |
| `/api/waitlist` | Dynamic (server) |
| `/api/waitlist/unsubscribe` | Dynamic (server) |
| `/privacy` | Static |
| `/unsubscribe` | Static |

### Arquivos criados/modificados

- **Criado:** `eslint.config.mjs`
- **Modificado:** `next.config.mjs` (removido `ignoreBuildErrors`)
- **Modificado:** `package.json` (deps ESLint)
