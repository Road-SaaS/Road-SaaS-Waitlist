import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso — RoadSaaS",
  description: "Termos de uso do RoadSaaS.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#121212] text-[#E5E5E5] px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]">
        Termos de Uso
      </h1>
      <p className="text-[#9CA3AF]">
        Em breve. Para dúvidas:{" "}
        <a
          href="mailto:contato@roadsaas.com"
          className="text-[#E5E5E5] underline hover:no-underline"
        >
          contato@roadsaas.com
        </a>
      </p>
    </main>
  )
}
