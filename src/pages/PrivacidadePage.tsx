import { Link } from 'react-router-dom'

import { SiteLayout } from '@/components/SiteLayout'
import { evento } from '@/config/evento'
import { privacidade } from '@/config/privacidade'
import { site } from '@/config/site'
import { usePageTitle } from '@/hooks/usePageTitle'

const dadosColetados = [
  ['Nome completo', 'para identificar você na inscrição'],
  ['Telefone', 'para enviar avisos e lembretes sobre a feira'],
  ['E-mail', 'para confirmar a inscrição e mandar novidades da feira'],
  ['Escolaridade', 'para entender o público e preparar as atividades'],
  ['Se já foi aluno do Frei', 'para conhecer quem volta ao Instituto'],
  ['Curso de interesse', 'para direcionar você às salas e professores certos'],
  ['Como ficou sabendo da feira (origem)', 'para melhorar a divulgação'],
  ['Previsão de chegada', 'para organizar a recepção nos horários de maior movimento'],
] as const

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-bold text-brand-navy">{titulo}</h2>
      <div className="space-y-3 text-body text-brand-ink/90 [&_a]:font-medium [&_a]:text-brand-blue [&_a]:underline-offset-4 hover:[&_a]:underline">
        {children}
      </div>
    </section>
  )
}

export default function PrivacidadePage() {
  usePageTitle('Política de privacidade')
  const [ano, mes, dia] = privacidade.atualizadoEm.split('-')

  return (
    <SiteLayout>
      <div className="bg-grad-sky py-section">
        <article className="container max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">LGPD</p>
          <h1 className="mt-2 font-display text-title-sm font-bold text-brand-navy">Política de privacidade</h1>
          <p className="mt-3 text-body-lg text-brand-navy/80">
            Explicamos aqui, de forma simples, como cuidamos dos dados que você informa no formulário de inscrição da{' '}
            {evento.nome}.
          </p>

          <div className="mt-10 space-y-10 rounded-card-lg bg-white px-6 py-8 shadow-card sm:px-10 sm:py-12">
            <Bloco titulo="Quem é o responsável pelos seus dados">
              <p>
                O responsável (controlador) é o <strong>{privacidade.responsavel.nome}</strong>
                {privacidade.responsavel.cnpj && <>, CNPJ {privacidade.responsavel.cnpj}</>}, localizado na{' '}
                {evento.local.logradouro}, {evento.local.bairro}, {evento.local.cidade} - {evento.local.uf},{' '}
                {evento.local.cep}.
              </p>
            </Bloco>

            <Bloco titulo="Quais dados coletamos e por quê">
              <ul className="space-y-2">
                {dadosColetados.map(([dado, motivo]) => (
                  <li key={dado} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                    <span>
                      <strong className="font-semibold text-brand-navy">{dado}</strong>: {motivo}.
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                Também guardamos a data e a hora em que você concordou com esta política. Não pedimos documentos, endereço
                nem dados sensíveis.
              </p>
            </Bloco>

            <Bloco titulo="Para que usamos">
              <p>
                Usamos os dados <strong>somente</strong> para organizar a Feira das Profissões e entrar em contato com os
                inscritos sobre ela. A base legal é o seu <strong>consentimento</strong>, que você dá ao marcar a caixa
                antes de enviar o formulário.
              </p>
              <p>
                Não vendemos nem compartilhamos seus dados com empresas parceiras ou terceiros para publicidade. Eles ficam
                guardados em um serviço de banco de dados na nuvem (Supabase), com acesso restrito à equipe do Instituto.
              </p>
            </Bloco>

            <Bloco titulo="Por quanto tempo guardamos">
              <p>
                Os dados ficam guardados por <strong>{privacidade.prazoRetencao}</strong>. Depois disso, são apagados.
              </p>
            </Bloco>

            <Bloco titulo="Menores de 18 anos">
              <p>
                Menores de idade podem se inscrever, mas devem fazer isso com a ciência do pai, da mãe ou do responsável
                legal.
              </p>
            </Bloco>

            <Bloco titulo="Seus direitos e como pedir a exclusão">
              <p>
                Você pode, a qualquer momento e sem custo, pedir para ver, corrigir ou <strong>apagar</strong> seus dados, ou
                retirar o seu consentimento. Basta falar com a secretaria do Instituto:
              </p>
              <ul className="space-y-1">
                {site.telefones.map((tel) => (
                  <li key={tel.numero}>
                    <a href={tel.href} target={tel.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {tel.numero}
                    </a>{' '}
                    ({tel.descricao})
                  </li>
                ))}
                <li>
                  Instagram:{' '}
                  <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                    @{site.instagram.usuario}
                  </a>
                </li>
              </ul>
              <p>Informe o nome e o e-mail usados na inscrição para localizarmos o seu cadastro.</p>
            </Bloco>

            <p className="border-t border-brand-sky pt-6 text-sm text-brand-ink/70">
              Última atualização: {dia}/{mes}/{ano}.
            </p>
          </div>

          <p className="mt-8 text-center">
            <Link to="/" className="font-medium text-brand-navy underline-offset-4 hover:underline">
              Voltar para o início
            </Link>
          </p>
        </article>
      </div>
    </SiteLayout>
  )
}
