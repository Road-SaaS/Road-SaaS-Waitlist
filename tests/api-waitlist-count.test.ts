import { describe, it, expect } from "vitest"

describe("GET /api/waitlist/count", () => {
  it("retorna 200 e body com count number", async () => {
    const { GET } = await import("@/app/api/waitlist/count/route")
    const res = await GET()

    expect(res.status).toBe(200)

    const data = (await res.json()) as { count: number }
    expect(data).toHaveProperty("count")
    expect(typeof data.count).toBe("number")
    expect(data.count).toBeGreaterThanOrEqual(0)
  })

  it("retorna Cache-Control nos headers", async () => {
    const { GET } = await import("@/app/api/waitlist/count/route")
    const res = await GET()

    const cacheControl = res.headers.get("Cache-Control")
    expect(cacheControl).toBeDefined()
    expect(cacheControl).toContain("s-maxage=60")
  })
})
