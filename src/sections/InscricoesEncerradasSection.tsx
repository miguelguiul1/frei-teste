import { GraduationCap, Phone } from 'lucide-react'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { evento } from '@/config/evento'
import { site } from '@/config/site'

/** Substitui o formulário quando `statusEvento` é "encerrado". */
export function InscricoesEncerradasSection() {
  const [whatsapp, fixo] = site.telefones

  return (
    <section id="inscricao" aria-labelledby="inscricao-titulo" className="relative isolate pb-section pt-6 lg:pt-10">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/instituto/alunos-escadaria.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,rgba(255,255,255,0.75)_15%,rgba(255,255,255,0.3)_45%,rgba(4,42,126,0.35)_100%)]" />
      </div>

      <div className="container">
        <Reveal className="mx-auto max-w-[52rem] rounded-card-lg bg-white/95 px-6 py-10 text-center shadow-card backdrop-blur-md sm:px-12 sm:py-12">
          <p className="mx-auto mb-4 w-fit rounded-full bg-brand-sky px-4 py-1.5 text-sm font-semibold text-brand-navy">
            Inscrições encerradas
          </p>
          <SectionHeading id="inscricao-titulo" highlight="encerradas" size="subtitle">
            As inscrições para a {evento.edicao}ª Feira estão
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-brand-navy/90">
            A feira aconteceu em {evento.dataExtenso}. Obrigado a todos que participaram! Enquanto a próxima edição não
            chega, conheça os cursos do Instituto e fale com a nossa secretaria.
          </p>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <a href="#cursos">
                <GraduationCap className="h-5 w-5" aria-hidden />
                Conheça os cursos
              </a>
            </Button>
          </div>

          <ul className="mt-10 grid gap-3 text-left sm:grid-cols-3" aria-label="Contato da secretaria">
            {[
              { icon: FaWhatsapp, label: 'WhatsApp', valor: whatsapp.numero, href: whatsapp.href, externo: true },
              { icon: Phone, label: 'Telefone', valor: fixo.numero, href: fixo.href, externo: false },
              { icon: FaInstagram, label: 'Instagram', valor: `@${site.instagram.usuario}`, href: site.instagram.url, externo: true },
            ].map(({ icon: Icon, label, valor, href, externo }) => (
              <li key={label}>
                <a
                  href={href}
                  target={externo ? '_blank' : undefined}
                  rel={externo ? 'noopener noreferrer' : undefined}
                  className="flex h-full items-center gap-3 rounded-card border border-brand-sky bg-white px-4 py-3 transition-[transform,box-shadow] duration-200 ease-out-soft hover:-translate-y-0.5 hover:shadow-figma"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-sky text-brand-navy">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm text-brand-navy/70">{label} da secretaria</span>
                    <span className="block font-semibold text-brand-navy">{valor}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
