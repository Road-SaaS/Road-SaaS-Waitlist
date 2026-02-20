"use client"

import { useEffect, useState } from "react"
import { CountUp } from "./count-up"

export function WaitlistCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/waitlist/count")
      .then((res) => res.json())
      .then((data) => setCount(typeof data.count === "number" ? data.count : 0))
      .catch(() => setCount(0))
  }, [])

  if (count === null) {
    return (
      <span className="text-sm text-muted-foreground">
        Primeiros fundadores já estão entrando na lista.
      </span>
    )
  }

  if (count < 10) {
    return (
      <span className="text-sm text-muted-foreground">
        Primeiros fundadores já estão entrando na lista.
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-road-green)]" />
      <CountUp target={count} />
      {" fundadores solo já entraram na lista. Entra também."}
    </span>
  )
}
