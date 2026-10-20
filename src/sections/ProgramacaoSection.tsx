import { ExternalLink } from 'lucide-react'
import { MdConfirmationNumber, MdPinDrop } from 'react-icons/md'

import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { evento } from '@/config/evento'
import { programacao } from '@/data/programacao'

/** Ícone de calendário com o dia do evento (vem de src/config/evento.ts). */
function CalendarDayIcon() {
  return (
    <span className="flex h-9 w-9 flex-col overflow-hidden rounded-[5px] border-[3px] border-brand-navy" aria-hidden>
      <span className="h-1.5 bg-brand-navy" />
      <span className="grid flex-1 place-items-center text-[0.8rem] font-bold leading-none text-brand-navy">
        {evento.dia}
      </span>
    </span>
  )
}

function InfoItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex flex-col items-center gap-3 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-md bg-white text-brand-navy shadow-figma">{icon}</span>
      {children}
    </li>
  )
}

function ComoChegarCard() {
  return (
    <aside
      aria-labelledby="como-chegar-titulo"
      className="rounded-card bg-grad-card-blue px-6 pb-10 pt-12 text-white shadow-card lg:px-6"
    >
      <h3 id="como-chegar-titulo" className="text-center text-[2rem] font-semibold leading-tight lg:text-[2.25rem]">
        Como chegar na <span className="text-brand-navy">{evento.edicao}ª Feira das Profissões</span>?
      </h3>

      <div className="mt-10 overflow-hidden rounded-xl bg-white shadow-figma">
        <iframe
          title={`Mapa: ${evento.local.nome}`}
          src={evento.mapsEmbedUrl}
          className="block aspect-[314/260] w-full border-0 md:aspect-[16/7] lg:aspect-[314/260]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={evento.mapsLinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
      >
        Abrir no Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only">(abre em nova aba)</span>
      </a>

      <ul className="mt-10 space-y-10">
        {evento.gratuito && (
          <InfoItem icon={<MdConfirmationNumber className="h-9 w-9" aria-hidden />}>
            <p className="text-[1.625rem] font-medium leading-tight">Evento Gratuito</p>
          </InfoItem>
        )}
        <InfoItem icon={<CalendarDayIcon />}>
          <p className="text-[1.375rem] font-medium leading-tight">
            <time dateTime={evento.data}>{evento.diaMes}</time>
            <br />
            {evento.horario}
          </p>
        </InfoItem>
        <InfoItem icon={<MdPinDrop className="h-9 w-9" aria-hidden />}>
          <address className="text-[1.0625rem] font-semibold not-italic leading-[1.65]">{evento.enderecoCompleto}</address>
        </InfoItem>
      </ul>
    </aside>
  )
}

export function ProgramacaoSection() {
  return (
    <section
      id="programacao"
      aria-labelledby="programacao-titulo"
      className="relative z-10 bg-grad-programacao pb-section pt-section lg:pb-0"
    >
      <div className="container">
        <SectionHeading id="programacao-titulo" highlight="Feira">
          Programação da
        </SectionHeading>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_22.75rem] lg:gap-16">
          <ol className="relative" aria-label="Áreas e salas da feira">
            {programacao.map(({ id, area, icon: Icon, salas }, i) => (
              <Reveal as="li" key={id} delay={i * 80} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-9">
                {/* linha que conecta os ícones */}
                {i < programacao.length - 1 && (
                  <span aria-hidden className="absolute bottom-0 left-[calc(3rem-3px)] top-20 w-1.5 bg-brand-navy" />
                )}
                <span className="relative grid h-[5.625rem] w-24 shrink-0 place-items-center rounded-icon bg-grad-icon text-white shadow-figma">
                  <Icon className="h-12 w-12" aria-hidden />
                </span>
                <div className="pt-4">
                  <h3 className="text-2xl font-bold text-brand-ink lg:text-[1.75rem]">{area}</h3>
                  <ul className="mt-1.5 space-y-0.5 text-base text-brand-ink">
                    {salas.map(({ sala, tema }) => (
                      <li key={sala}>
                        <strong className="font-semibold">{sala}</strong> - {tema}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* No desktop o card avança sobre a seção do formulário, como no Figma */}
          <Reveal delay={150} className="lg:-mb-[26rem]">
            <ComoChegarCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
