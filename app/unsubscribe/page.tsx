"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

type Status = "loading" | "success" | "error"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<Status>("loading")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      return
    }

    fetch("/api/waitlist/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus("success")
        } else {
          setStatus("error")
        }
      })
      .catch(() => setStatus("error"))
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="max-w-md w-full bg-[#1C1C1C] rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-[#FF6B00] mb-4">RoadSaaS</h1>

        {status === "loading" && (
          <p className="text-[#A3A3A3]">Processando descadastro...</p>
        )}

        {status === "success" && (
          <>
            <p className="text-[#E5E5E5] text-lg mb-2">
              Voce foi removido da waitlist.
            </p>
            <p className="text-[#A3A3A3] text-sm">
              Se mudar de ideia, e so se inscrever novamente.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-[#E5E5E5] text-lg mb-2">
              Nao foi possivel processar o descadastro.
            </p>
            <p className="text-[#A3A3A3] text-sm">
              O link pode estar expirado ou invalido. Entre em contato pelo{" "}
              <a
                href="mailto:contato@roadsaas.com"
                className="text-[#FF6B00] underline"
              >
                contato@roadsaas.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
          <p className="text-[#A3A3A3]">Carregando...</p>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  )
}
