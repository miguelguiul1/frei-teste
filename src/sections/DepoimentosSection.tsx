import { Quote } from 'lucide-react'

import { Img } from '@/components/Img'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselArrow, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { depoimentos, maisDepoimentosUrl, type Depoimento } from '@/data/depoimentos'
import { cn } from '@/lib/utils'

function DepoimentoCard({ depoimento }: { depoimento: Depoimento }) {
  return (
    <figure className="mx-auto grid max-w-[62rem] items-center gap-0 md:grid-cols-[16.5rem_1fr]">
      {/* Foto: bloco navy de onde o ex-aluno "sai" pela parte de cima */}
      <div className="relative z-10 mx-auto w-52 md:mx-0 md:w-[16.5rem]">
        <div className="relative aspect-[266/250] rounded-card bg-brand-navy shadow-figma">
          {/* recorte: a foto inteira apoiada na base do bloco, com a cabeça acima dele */}
          <div className={cn('absolute inset-x-0 bottom-0', depoimento.fotoRecortada ? 'aspect-[332/488]' : 'top-0')}>
            <Img
              src={depoimento.foto}
              alt={`Foto de ${depoimento.nome}`}
              width={332}
              height={488}
              wrapperClassName={cn('h-full w-full bg-none', !depoimento.fotoRecortada && 'rounded-card')}
              className={cn('object-cover object-top', depoimento.fotoRecortada && 'rounded-b-card')}
            />
          </div>
        </div>
      </div>

      <div className="relative -mt-8 rounded-card-lg bg-white px-6 pb-8 pt-14 shadow-card sm:px-10 md:-ml-14 md:mt-0 md:py-12 md:pl-[6.5rem] md:pr-12">
        <Quote className="absolute left-6 top-6 h-8 w-8 text-brand-sky md:left-[4.5rem] md:top-8" aria-hidden />
        <blockquote className="relative space-y-1 text-[1.0625rem] leading-snug text-brand-ink sm:text-justify md:text-lg">
          {depoimento.texto.map((paragrafo, i) => (
            <p key={i}>
              {i === 0 && '“'}
              {paragrafo}
              {i === depoimento.texto.length - 1 && '”'}
            </p>
          ))}
        </blockquote>
        <figcaption className="mt-6 text-center text-lg font-medium text-brand-navy">
          {depoimento.nome} - {depoimento.descricao}
        </figcaption>
      </div>
    </figure>
  )
}

export function DepoimentosSection() {
  return (
    <section
      id="depoimentos"
      aria-labelledby="depoimentos-titulo"
      className="relative bg-brand-sky py-section shadow-[inset_0_0_80px_rgba(44,94,201,0.12)]"
    >
      <div className="container">
        <SectionHeading id="depoimentos-titulo">Depoimentos</SectionHeading>

        <Reveal className="mt-12 md:mt-16">
          <Carousel label="Depoimentos de ex-alunos" opts={{ loop: true }}>
            <CarouselContent className="pt-14 md:pt-[4.5rem]">
              {depoimentos.map((d, i) => (
                <CarouselItem key={d.id} index={i} className="px-1 pb-4">
                  <DepoimentoCard depoimento={d} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mx-auto mt-8 flex max-w-[62rem] flex-col items-center gap-6 md:flex-row md:justify-between">
              <Button asChild size="lg" className="h-[3.6rem] min-w-[16.5rem] text-lg font-semibold">
                <a href={maisDepoimentosUrl} target="_blank" rel="noopener noreferrer">
                  Mais Depoimentos
                  <span className="sr-only"> (abre o Instagram do Instituto em nova aba)</span>
                </a>
              </Button>
              <div className="flex items-center gap-3">
                <CarouselArrow direction="prev" />
                <CarouselDots />
                <CarouselArrow direction="next" />
              </div>
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  )
}
