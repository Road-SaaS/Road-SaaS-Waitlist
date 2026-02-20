import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Politica de Privacidade — RoadSaaS",
  description: "Como o RoadSaaS coleta, usa e protege seus dados.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#121212] px-6 py-16">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-block text-sm text-[#A3A3A3] hover:text-[#E5E5E5] transition-colors"
        >
          &larr; Voltar para a pagina inicial
        </Link>

        <h1 className="text-3xl font-bold text-[#E5E5E5] mb-2 font-[family-name:var(--font-space-grotesk)]">
          Politica de Privacidade
        </h1>
        <p className="text-sm text-[#737373] mb-10">
          Ultima atualizacao: 20 de fevereiro de 2026
        </p>

        <div className="space-y-8 text-[#A3A3A3] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              1. Quem somos
            </h2>
            <p>
              O <strong className="text-[#E5E5E5]">RoadSaaS</strong> e um produto criado por Jose Hernane.
              Nosso site e <strong className="text-[#E5E5E5]">roadsaas.com</strong>.
              Para qualquer questao sobre seus dados, entre em contato pelo email{" "}
              <a href="mailto:contato@roadsaas.com" className="text-[#FF6B00] underline">
                contato@roadsaas.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              2. Dados que coletamos
            </h2>
            <p className="mb-3">
              Ao se inscrever na waitlist, coletamos:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-[#E5E5E5]">Email</strong> — para comunicar quando o produto estiver disponivel.</li>
              <li><strong className="text-[#E5E5E5]">Parametros de campanha (UTMs)</strong> — utm_source, utm_medium, utm_campaign, utm_term, utm_content. Servem para entendermos de onde voce veio (ex: Twitter, Google).</li>
              <li><strong className="text-[#E5E5E5]">Referrer e pagina de entrada</strong> — URL de origem e caminho da pagina acessada.</li>
              <li><strong className="text-[#E5E5E5]">Hash do IP</strong> — armazenamos apenas um hash criptografico do seu endereco IP (nunca o IP puro). Usado para protecao contra abuso.</li>
              <li><strong className="text-[#E5E5E5]">User-Agent</strong> — informacoes basicas do navegador.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              3. Por que coletamos
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gerenciar a lista de espera (waitlist) do RoadSaaS.</li>
              <li>Enviar um email de confirmacao quando voce se inscreve.</li>
              <li>Avisar quando o produto estiver disponivel.</li>
              <li>Entender de onde vem nosso publico (attribution de marketing).</li>
              <li>Proteger contra spam e abuso (rate limiting).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              4. Com quem compartilhamos
            </h2>
            <p>
              Seus dados sao processados pelos seguintes servicos, estritamente para as funcoes descritas:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li><strong className="text-[#E5E5E5]">Supabase</strong> — banco de dados (armazenamento).</li>
              <li><strong className="text-[#E5E5E5]">Resend</strong> — envio de email transacional.</li>
              <li><strong className="text-[#E5E5E5]">Upstash</strong> — rate limiting (protecao contra abuso).</li>
              <li><strong className="text-[#E5E5E5]">Vercel</strong> — hospedagem e analytics.</li>
            </ul>
            <p className="mt-3">
              Nao vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              5. Como sair da lista (descadastro)
            </h2>
            <p>
              Voce pode sair da waitlist a qualquer momento clicando no link
              {" "}<strong className="text-[#E5E5E5]">&quot;Sair da waitlist&quot;</strong>{" "}
              presente no email de confirmacao que enviamos.
              Isso marca seu registro como descadastrado e voce nao recebera mais comunicacoes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              6. Exclusao total de dados
            </h2>
            <p>
              Se voce deseja a exclusao completa dos seus dados, envie um email para{" "}
              <a href="mailto:contato@roadsaas.com" className="text-[#FF6B00] underline">
                contato@roadsaas.com
              </a>{" "}
              com o assunto &quot;Exclusao de dados&quot; e o email usado na inscricao.
              Responderemos em ate 15 dias uteis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              7. Seguranca
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>IPs sao armazenados apenas como hash criptografico (nao e possivel recuperar o IP original).</li>
              <li>Chaves de acesso ao banco de dados sao exclusivas do servidor (nunca expostas ao navegador).</li>
              <li>Tokens de descadastro sao armazenados como hash (nao em texto plano).</li>
              <li>Rate limiting protege contra tentativas automatizadas de abuso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              8. Alteracoes nesta politica
            </h2>
            <p>
              Esta politica pode ser atualizada periodicamente. Alteracoes relevantes serao comunicadas
              por email aos inscritos na waitlist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#E5E5E5] mb-3">
              9. Contato
            </h2>
            <p>
              Para duvidas, solicitacoes ou exercicio de direitos sobre seus dados pessoais:
            </p>
            <p className="mt-2">
              <a href="mailto:contato@roadsaas.com" className="text-[#FF6B00] underline">
                contato@roadsaas.com
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
