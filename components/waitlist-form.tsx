"use client"

import { useState, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Loader2 } from "lucide-react"
import { captureUtms, getUtmData } from "@/lib/client/utm"

type WaitlistFormProps = {
  id?: string
  showHelperText?: boolean
  helperText?: string
}

type FormState = "idle" | "loading" | "success" | "error" | "rate-limited"

const DEFAULT_HELPER_TEXT = "Sem spam. Um email quando abrir. Só."

function isValidEmail(value: string) {
  const email = value.trim()
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function WaitlistForm({
  id,
  showHelperText = false,
  helperText = DEFAULT_HELPER_TEXT,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [successMessage, setSuccessMessage] = useState(
    "Pronto. Você tá na lista. Eu te aviso quando abrir."
  )

  useEffect(() => {
    captureUtms()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setState("error")
      return
    }
    setState("loading")

    try {
      const utmData = getUtmData()

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          ...utmData,
        }),
      })

      if (res.status === 429) {
        setState("rate-limited")
        return
      }

      if (!res.ok) {
        setState("error")
        return
      }

      const data = await res.json()

      if (data.alreadySubscribed) {
        setSuccessMessage("Você já está na lista! Te aviso quando abrir.")
      } else {
        setSuccessMessage("Pronto. Você tá na lista. Eu te aviso quando abrir.")
      }

      setState("success")
    } catch {
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <motion.div
        id={id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2.5 rounded-md border border-[var(--color-road-green)]/30 bg-[var(--color-road-green)]/10 px-6 py-3"
      >
        <CheckCircle2
          className="h-4.5 w-4.5 text-[var(--color-road-green)]"
          strokeWidth={1.5}
        />
        <span className="font-sans text-sm font-medium text-[var(--color-road-green)]">
          {successMessage}
        </span>
      </motion.div>
    )
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === "error") setState("idle")
          }}
          required
          aria-invalid={state === "error"}
          className="w-full rounded-md border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,107,0,0.1)]"
        />

        <AnimatePresence mode="popLayout" initial={false}>
          {state === "error" ? (
            <motion.p
              key="waitlist-error"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-destructive"
            >
              Algo deu errado. Confere o email e tenta de novo.
            </motion.p>
          ) : state === "rate-limited" ? (
            <motion.p
              key="waitlist-rate-limited"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-[var(--color-safety-orange)]"
            >
              Calma, muitas tentativas. Tenta de novo em alguns minutos.
            </motion.p>
          ) : showHelperText ? (
            <motion.p
              key="waitlist-helper"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground"
            >
              {helperText}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
      <motion.button
        type="submit"
        disabled={state === "loading"}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="cursor-pointer rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-[var(--color-safety-orange-hover)] hover:shadow-[0_0_24px_rgba(255,107,0,0.35)] disabled:opacity-70"
      >
        {state === "loading" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            Entrando na lista…
          </span>
        ) : (
          "Quero acesso primeiro"
        )}
      </motion.button>
    </form>
  )
}
