import { Expand } from 'lucide-react'
import { useRef, useState } from 'react'

import { Img } from '@/components/Img'
import { Lightbox } from '@/components/Lightbox'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { anosDeHistoria } from '@/config/site'
import { evento } from '@/config/evento'
import { fotoTradicao, galeria, type FotoGaleria } from '@/data/galeria'
import { cn } from '@/lib/utils'

function TradicaoBanner() {
  return (
    <Reveal className="relative overflow-hidden rounded-card-lg bg-white shadow-card">
      <img
        src={fotoTradicao.src}
        alt={fotoTradicao.alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-y-0 right-0 h-full w-full object-cover object-center lg:w-[66%]"
      />
      {/* degradê branco que revela a foto da equipe à direita */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#FFFFFF_38%,rgba(255,255,255,0.6)_55%,rgba(255,255,255,0)_80%)] lg:bg-[linear-gradient(90deg,#FFFFFF_36%,rgba(255,255,255,0.75)_46%,rgba(255,255,255,0)_70%)]"
      />
      <div className="relative px-6 pb-48 pt-10 sm:px-14 sm:pb-64 lg:py-16">
        <h2 className="font-display text-[clamp(1.875rem,1.4rem+1.6vw,2.625rem)] font-bold leading-[1.3] text-brand-navy">
          Tradição que
          <br />
          atravessa <span className="text-brand-blue">gerações</span>!
        </h2>
        <p className="mt-4 text-lg font-medium text-brand-navy sm:text-[1.375rem]">
          {anosDeHistoria} anos de inúmeras histórias de sucesso!
        </p>
      </div>
    </Reveal>
  )
}

interface MiniaturaProps {
  foto: FotoGaleria
  onOpen: (el: HTMLButtonElement) => void
  className?: string
  imgClassName?: string
}

/** Foto clicável em moldura branca que abre o lightbox. */
function Miniatura({ foto, onOpen, className, imgClassName }: MiniaturaProps) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      className={cn(
        'group relative block rounded-card bg-white p-3 shadow-figma transition-transform duration-300 ease-out-soft hover:-translate-y-1.5 hover:rotate-[-0.6deg] sm:p-[0.85rem]',
        className,
      )}
      aria-label={`Ampliar foto: ${foto.alt}`}
    >
      <Img
        src={foto.src}
        alt=""
        width={740}
        height={500}
        wrapperClassName={cn('w-full rounded-[1.1rem]', imgClassName)}
        className="transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
      />
      <span
        aria-hidden
        className="absolute right-6 top-6 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-navy opacity-0 shadow-figma transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <Expand className="h-4 w-4" />
      </span>
    </button>
  )
}

/**
 * Galeria "Nossa última Feira" + banner "Tradição".
 * Com o evento encerrado ela vira o destaque da página: vem logo após o hero,
 * com título primeiro e as fotos em mosaico grande.
 */
export function UltimaFeiraSection({ destaque = false }: { destaque?: boolean }) {
  const [aberta, setAberta] = useState<number | null>(null)
  const miniaturaRef = useRef<HTMLButtonElement | null>(null)

  const abrir = (i: number) => (el: HTMLButtonElement) => {
    miniaturaRef.current = el
    setAberta(i)
  }

  return (
    <section
      id="ultima-feira"
      aria-labelledby="ultima-feira-titulo"
      className={cn('overflow-hidden bg-brand-navy pb-section', destaque ? 'pt-section' : 'pt-6')}
    >
      {destaque ? (
        <div className="container">
          <SectionHeading id="ultima-feira-titulo" tone="light">
            Nossa última Feira
          </SectionHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-body-lg text-white/85">
            Reveja os melhores momentos da {evento.edicao}ª Feira das Profissões. Clique em uma foto para ampliar.
          </p>

          {/* Mosaico: primeira foto grande, demais ao redor */}
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:grid-rows-2">
            {galeria.map((foto, i) => (
              <Reveal
                as="li"
                key={foto.src}
                delay={i * 80}
                className={i === 0 ? 'col-span-2 lg:row-span-2' : undefined}
              >
                <Miniatura
                  foto={foto}
                  onOpen={abrir(i)}
                  className="h-full w-full"
                  imgClassName={i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/3]'}
                />
              </Reveal>
            ))}
          </ul>

          <div className="mt-section">
            <TradicaoBanner />
          </div>
        </div>
      ) : (
        <>
          <div className="container">
            <TradicaoBanner />
            <SectionHeading id="ultima-feira-titulo" tone="light" size="title-sm" className="mt-section">
              Nossa última Feira
            </SectionHeading>
          </div>

          {/* Fileira de fotos que "vaza" pelas laterais, como no Figma */}
          <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] sm:px-6 lg:justify-center lg:overflow-visible lg:px-0">
            {galeria.map((foto, i) => (
              <li key={foto.src} className="shrink-0 snap-center">
                <Miniatura foto={foto} onOpen={abrir(i)} className="w-[17rem] sm:w-[21.25rem]" imgClassName="aspect-[311/210]" />
              </li>
            ))}
          </ul>
        </>
      )}

      <Lightbox fotos={galeria} index={aberta} onIndexChange={setAberta} returnFocusTo={miniaturaRef} />
    </section>
  )
}
