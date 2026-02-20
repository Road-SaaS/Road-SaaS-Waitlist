"use client"

import { useEffect, useRef } from "react"

export function AsphaltBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      const imageData = ctx.createImageData(w, h)
      const data = imageData.data

      // Static grain pattern - no animation needed for performance
      for (let i = 0; i < data.length; i += 4) {
        const n = Math.random() * 18
        data[i] = n
        data[i + 1] = n
        data[i + 2] = n
        data[i + 3] = 14 // ~5.5% opacity
      }

      ctx.putImageData(imageData, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />
      {/* Spotlight radial gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% 20%, rgba(255,107,0,0.035) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
    </>
  )
}
