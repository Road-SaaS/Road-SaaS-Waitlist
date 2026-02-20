# Task 3 — Banco de dados (Supabase) — schema minimo

**Status:** Concluida
**Data:** 2026-02-20

---

## O que foi feito

### 1. Tabela `waitlist_signups` criada no Supabase

Campos:

| Campo | Tipo | Restricao |
|-------|------|-----------|
| `id` | UUID | PK, default `gen_random_uuid()` |
| `email` | TEXT | NOT NULL |
| `email_normalized` | TEXT | NOT NULL, UNIQUE |
| `status` | TEXT | NOT NULL, default `'subscribed'` |
| `created_at` | TIMESTAMPTZ | NOT NULL, default `now()` |
| `source` | TEXT | NOT NULL, default `'landing'` |
| `utm_source` | TEXT | nullable |
| `utm_medium` | TEXT | nullable |
| `utm_campaign` | TEXT | nullable |
| `utm_term` | TEXT | nullable |
| `utm_content` | TEXT | nullable |
| `referrer` | TEXT | nullable |
| `landing_path` | TEXT | nullable |
| `user_agent` | TEXT | nullable |
| `ip_hash` | TEXT | nullable |
| `unsubscribe_token_hash` | TEXT | nullable |
| `unsubscribed_at` | TIMESTAMPTZ | nullable |

### 2. Indices criados

| Indice | Tipo | Coluna | Proposito |
|--------|------|--------|-----------|
| `idx_waitlist_email_normalized` | UNIQUE | `email_normalized` | Deduplicacao de emails |
| `idx_waitlist_status` | B-tree | `status` | Filtros por status |
| `idx_waitlist_unsubscribe_token` | Partial B-tree | `unsubscribe_token_hash` (WHERE NOT NULL) | Busca rapida no descadastro |

### 3. RLS (Row Level Security)

- RLS **ativado** na tabela
- **Zero policies** criadas = acesso via `anon key` totalmente bloqueado
- `service_role` key ignora RLS = API routes funcionam normalmente

### 4. Testes (8 novos — total 27/27 passando)

| Teste | Valida |
|-------|--------|
| Tabela existe | `SELECT` na tabela retorna sem erro |
| Insert com todos os campos | Insere registro completo e verifica todos os valores |
| UUID automatico | Campo `id` gerado no formato UUID valido |
| Default status=subscribed | Registro criado sem status explicito tem `subscribed` |
| Unique constraint email_normalized | Segunda insercao com mesmo email retorna erro `23505` |
| Update status para unsubscribed | Atualiza status e `unsubscribed_at` |
| Busca por unsubscribe_token_hash | Indice parcial funciona corretamente |
| RLS bloqueia acesso nao autorizado | Acesso sem service role nao retorna dados |

### 5. Arquivos criados

- `supabase/migrations/001_create_waitlist_signups.sql` — SQL da migration (referencia)
- `scripts/run-migration.ts` — script auxiliar para tentar executar migration via API
- `tests/schema.test.ts` — 8 testes de validacao do schema
- `docs/done/task-3-database-schema.md` — este arquivo
