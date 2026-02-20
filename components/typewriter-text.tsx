"use client"

import { useEffect, useState } from "react"

export function TypewriterText({
  text,
  delay = 60,
  className,
}: {
  text: string
  delay?: number
  className?: string
}) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setDone(true), 1500)
      }
    }, delay)
    return () => clearInterval(interval)
  }, [text, delay])

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="animate-blink ml-0.5 inline-block h-[1em] w-[3px] translate-y-[0.1em] bg-primary" />
      )}
    </span>
  )
}
