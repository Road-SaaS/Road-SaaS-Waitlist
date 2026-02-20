"use client"

import { useState, useEffect, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { captureUtms, getUtmData } from "@/lib/client/utm"

const EXPERIENCE_OPTIONS = [
  { value: "no-code", label: "Não sei programar (no-code)" },
  { value: "low-code", label: "Sei o básico (low-code)" },
  { value: "intermediate", label: "Dev intermediário" },
  { value: "advanced", label: "Dev avançado" },
] as const

type WaitlistFormProps = {
  id?: string
  formId?: string
  showHelperText?: boolean
  helperText?: string
}

type FormState = "idle" | "loading" | "success" | "error" | "rate-limited"

const DEFAULT_HELPER_TEXT = "Sem spam. Um email quando abrir. Só."

const SUCCESS_MESSAGE = "✅ Você está na lista! Vamos te avisar quando abrir."

function isValidEmail(value: string) {
  const email = value.trim()
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const inputBase =
  "w-full rounded-lg border bg-[#1C1C1C] px-4 py-3 text-[#E5E5E5] placeholder-[#9CA3AF] outline-none transition-all focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-0"
const inputError = "border-[#EF4444]"
const inputNormal = "border-[#404040]"

export function WaitlistForm({
  id,
  formId,
  showHelperText = false,
  helperText = DEFAULT_HELPER_TEXT,
}: WaitlistFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [levelError, setLevelError] = useState(false)

  useEffect(() => {
    captureUtms()
  }, [])

  const clearFieldErrors = () => {
    setNameError(false)
    setEmailError(false)
    setLevelError(false)
    if (state === "error") setState("idle")
  }

  const validate = (): boolean => {
    const nameValid = name.trim().length >= 2
    const emailValid = isValidEmail(email)
    const levelValid = experienceLevel.trim().length > 0

    setNameError(!nameValid)
    setEmailError(!emailValid)
    setLevelError(!levelValid)
    return nameValid && emailValid && levelValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setState("loading")

    try {
      const utmData = getUtmData()

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          experience_level: experienceLevel.trim() || null,
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

      setState("success")
    } catch {
      setState("error")
    }
  }

  if (state === "success") {
    return (
      <motion.div
        id={formId ?? id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-center gap-2.5 rounded-lg px-6 py-4"
      >
        <span className="text-base font-medium text-[#22C55E]">
          {SUCCESS_MESSAGE}
        </span>
      </motion.div>
    )
  }

  const formContent = (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="waitlist-name" className="sr-only">
            Seu nome
          </label>
          <input
            id="waitlist-name"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
              clearFieldErrors()
            }}
            disabled={state === "loading"}
            aria-invalid={nameError}
            className={`${inputBase} ${nameError ? inputError : inputNormal}`}
            minLength={2}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="waitlist-email" className="sr-only">
            Seu melhor email
          </label>
          <input
            id="waitlist-email"
            type="email"
            placeholder="Seu melhor email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(false)
              clearFieldErrors()
            }}
            disabled={state === "loading"}
            required
            aria-invalid={emailError}
            className={`${inputBase} ${emailError ? inputError : inputNormal}`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="waitlist-level" className="sr-only">
          Seu nível técnico
        </label>
        <select
          id="waitlist-level"
          value={experienceLevel}
          onChange={(e) => {
            setExperienceLevel(e.target.value)
            setLevelError(false)
            clearFieldErrors()
          }}
          disabled={state === "loading"}
          aria-invalid={levelError}
          className={`${inputBase} ${levelError ? inputError : inputNormal}`}
        >
          <option value="" disabled>
            Seu nível técnico
          </option>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <motion.button
          type="submit"
          disabled={state === "loading"}
          whileHover={{ scale: state === "loading" ? 1 : 1.02 }}
          whileTap={{ scale: state === "loading" ? 1 : 0.98 }}
          className="w-full cursor-pointer rounded-lg bg-[#FF6B00] px-4 py-3 font-bold text-white transition-colors hover:bg-[#E65D00] disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Inscrever na lista de espera"
        >
          {state === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
              Entrando na lista...
            </span>
          ) : (
            "Quero acesso primeiro 🚀"
          )}
        </motion.button>

        <AnimatePresence mode="popLayout" initial={false}>
          {state === "error" ? (
            <motion.p
              key="waitlist-error"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-[#EF4444]"
            >
              Ops, algo deu errado. Tenta de novo?
            </motion.p>
          ) : state === "rate-limited" ? (
            <motion.p
              key="waitlist-rate-limited"
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-[#FF6B00]"
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
    </form>
  )

  if (formId) {
    return (
      <div id={formId} className="w-full max-w-md">
        {formContent}
      </div>
    )
  }

  return <div className="w-full max-w-md">{formContent}</div>
}
