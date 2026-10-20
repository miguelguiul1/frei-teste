import { lazy, Suspense } from 'react'
import { MdCheckBox } from 'react-icons/md'

import { Logo } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { beneficios } from '@/data/beneficios'

// formulário (zod, react-hook-form, Supabase) carregado sob demanda: deixa a primeira dobra mais leve
const InscricaoForm = lazy(() => import('@/components/InscricaoForm').then((m) => ({ default: m.InscricaoForm })))

function FormSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Carregando formulário">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="space-y-2">
          <span className="block h-4 w-40 animate-pulse rounded bg-brand-sky" />
          <span className="block h-10 animate-pulse rounded-md bg-brand-sky/60" />
        </div>
      ))}
    </div>
  )
}

function OQueVoceGanha() {
  return (
    <div className="relative rounded-card-lg bg-white px-6 pb-10 pt-8 shadow-card sm:px-10 lg:px-[5.5rem]">
      <SectionHeading as="h3" highlight="ganha" suffix=":" size="subtitle">
        O que você
      </SectionHeading>
      <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:pr-12">
        {beneficios.map((item) => (
          <li key={item} className="flex items-center gap-3 text-base font-medium leading-tight text-brand-ink">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white shadow-figma">
              <MdCheckBox className="h-7 w-7 text-brand-navy" aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <Logo className="absolute bottom-3 right-4 hidden h-14 sm:block" />
    </div>
  )
}

export function InscricaoSection() {
  return (
    <section id="inscricao" aria-labelledby="inscricao-titulo" className="relative isolate pb-section pt-6 lg:pt-10">
      {/* Fundo: alunos na escadaria do Instituto, fundindo com o branco no topo */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/instituto/alunos-escadaria.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_0%,rgba(255,255,255,0.75)_12%,rgba(255,255,255,0.25)_35%,rgba(255,255,255,0.1)_100%)]" />
      </div>

      <div className="container grid gap-10 lg:grid-cols-[32.25rem_minmax(0,1fr)] lg:gap-[4.5rem]">
        <Reveal className="rounded-card-lg bg-white/90 px-6 py-8 shadow-card backdrop-blur-md sm:px-12 sm:py-10 lg:px-[3rem]">
          <SectionHeading
            id="inscricao-titulo"
            highlight="Inscrição"
            size="subtitle"
            align="left"
            className="mb-6 text-[clamp(1.75rem,1.3rem+1.5vw,2.25rem)]"
          >
            Formulário de
          </SectionHeading>
          <Suspense fallback={<FormSkeleton />}>
            <InscricaoForm />
          </Suspense>
        </Reveal>

        {/* espaço reservado para o card "Como chegar", que vem da seção anterior no desktop */}
        <div className="flex flex-col justify-end lg:pt-[27.5rem]">
          <Reveal delay={120}>
            <OQueVoceGanha />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
