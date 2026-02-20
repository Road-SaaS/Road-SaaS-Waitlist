import { describe, it, expect } from "vitest"
import { supabaseAdmin } from "@/lib/supabase/admin"

describe("lib/supabase/admin — conexao com Supabase", () => {
  it("deve criar o cliente sem erro", () => {
    const client = supabaseAdmin()
    expect(client).toBeDefined()
  })

  it("deve retornar a mesma instancia (singleton)", () => {
    const a = supabaseAdmin()
    const b = supabaseAdmin()
    expect(a).toBe(b)
  })

  it("deve conectar e responder a uma query basica", async () => {
    const client = supabaseAdmin()

    // Testa conectividade com o Supabase executando uma query a uma tabela inexistente
    const { error } = await client
      .from("_test_ping")
      .select("*")
      .limit(1)

    // Conexao OK se retornou qualquer resposta (mesmo erro de tabela inexistente)
    // PGRST205 = schema cache miss, 42P01 = relation does not exist — ambos indicam conexao OK
    if (error) {
      expect(["42P01", "PGRST205"]).toContain(error.code)
    }
  })

  it("deve conseguir acessar o auth admin (valida service role key)", async () => {
    const client = supabaseAdmin()
    const { data, error } = await client.auth.admin.listUsers({ perPage: 1 })

    expect(error).toBeNull()
    expect(data).toBeDefined()
    expect(data.users).toBeInstanceOf(Array)
  })
})
