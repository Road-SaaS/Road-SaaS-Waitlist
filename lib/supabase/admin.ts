import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { env } from "@/lib/env"

if (typeof window !== "undefined") {
  throw new Error("lib/supabase/admin.ts nao pode ser importado no client")
}

let _client: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (_client) return _client

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = env()

  _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  return _client
}
