# Task 4 — Cliente Supabase (server-only)

**Status:** Concluida (implementada na Task 1)
**Data:** 2026-02-20

---

## O que foi feito

### Arquivo: `lib/supabase/admin.ts`

- Funcao `supabaseAdmin()` que retorna um `SupabaseClient` configurado com `service_role` key
- Singleton com lazy initialization (instancia criada na primeira chamada)
- Guard contra import no client-side: `if (typeof window !== "undefined") throw`
- Usa `env()` para obter `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (validado com Zod)
- `auth.persistSession: false` — sem sessao persistente (server-only)

### Testes: `tests/supabase.test.ts` (4 testes)

| Teste | Valida |
|-------|--------|
| Cria cliente sem erro | Instanciacao funciona |
| Singleton | Mesma instancia retornada em chamadas consecutivas |
| Query basica | Conectividade com Supabase (responde mesmo sem tabela) |
| Auth admin | Service role key valida (lista users) |
