import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const db = supabaseAdmin()
    const { count, error } = await db
      .from("waitlist_signups")
      .select("*", { count: "exact", head: true })
      .eq("status", "subscribed")

    if (error) {
      console.error("[waitlist/count] supabase:", error)
      return NextResponse.json(
        { count: 0 },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
      )
    }

    return NextResponse.json(
      { count: count ?? 0 },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    )
  } catch (err) {
    console.error("[waitlist/count] erro inesperado:", err)
    return NextResponse.json(
      { count: 0 },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    )
  }
}
