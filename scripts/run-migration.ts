/**
 * Executa a migration SQL no Supabase via REST API (rpc pg_query nao existe por padrao).
 * Usa o endpoint /rest/v1/rpc ou query direta via supabase-js.
 * Valida SUPABASE_* com Zod para falhar cedo com URLs/chaves malformadas (schema minimo; nao exige demais envs).
 *
 * Uso: npx tsx scripts/run-migration.ts
 */
import { config } from "dotenv"
import { resolve as resolvePath } from "path"
config({ path: resolvePath(__dirname, "../.env.local") })
import { readFileSync } from "fs"
import { resolve } from "path"
import { z } from "zod"

const migrationEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
})
const parsed = migrationEnvSchema.safeParse(process.env)
if (!parsed.success) {
  const msg = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
  console.error("Variaveis de ambiente invalidas (Supabase):\n" + msg)
  process.exit(1)
}
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = parsed.data

const sqlPath = resolve(__dirname, "../supabase/migrations/001_create_waitlist_signups.sql")
const sql = readFileSync(sqlPath, "utf-8")

// Supabase expoe o endpoint /pg para SQL via service role (Management API)
// Alternativa: usar o SQL Editor endpoint
const url = `${SUPABASE_URL}/rest/v1/rpc/`

async function runViaPgMeta() {
  // Usa o pg-meta endpoint do Supabase para executar SQL arbitrario
  const pgMetaUrl = SUPABASE_URL!.replace(".supabase.co", ".supabase.co/pg")

  const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  })

  // Se chegou aqui, a conexao funciona. Vamos executar via query endpoint
  const queryRes = await fetch(`${SUPABASE_URL.replace(".supabase.co", ".supabase.co")}/pg/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!queryRes.ok) {
    // Fallback: instrucoes manuais
    console.log("---")
    console.log("Nao foi possivel executar via API automaticamente.")
    console.log("Execute o SQL abaixo no Supabase SQL Editor:")
    console.log("https://supabase.com/dashboard/project/" + SUPABASE_URL.split("//")[1].split(".")[0] + "/sql/new")
    console.log("---")
    console.log(sql)
    console.log("---")
    process.exit(1)
  }

  const data = await queryRes.json()
  console.log("Migration executada com sucesso!")
  console.log(data)
}

runViaPgMeta().catch((err) => {
  console.error("Erro ao executar migration:", err.message)
  console.log("\n--- Execute manualmente no SQL Editor do Supabase: ---")
  const projectRef = SUPABASE_URL.split("//")[1].split(".")[0]
  console.log(`https://supabase.com/dashboard/project/${projectRef}/sql/new`)
  console.log("\n" + sql)
  process.exit(1)
})
