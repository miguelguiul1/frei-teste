import { Clock, Timer } from 'lucide-react'

import { Img } from '@/components/Img'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { Carousel, CarouselArrow, CarouselContent, CarouselDots, CarouselItem } from '@/components/ui/carousel'
import { cursos, type Curso } from '@/data/cursos'

function CursoSlide({ curso }: { curso: Curso }) {
  return (
    <article className="grid items-center gap-6 md:grid-cols-[14.75rem_1fr] md:gap-10">
      <Img
        src={curso.imagem}
        alt={curso.imagemAlt}
        width={800}
        height={534}
        wrapperClassName="mx-auto aspect-[236/220] w-full max-w-[18rem] rounded-card shadow-figma md:max-w-none"
      />
      <div className="flex h-full flex-col text-center md:text-left">
        <h3 className="text-2xl font-semibold leading-tight text-brand-navy md:text-[2rem]">{curso.nome}</h3>
        <p className="mt-3 text-body-lg text-brand-navy">{curso.descricao}</p>
        <ul className="mt-6 space-y-1 text-body-lg text-brand-navy md:mt-auto md:pt-8">
          {(
            [
              ['Carga horária', curso.cargaHoraria, Clock],
              ['Duração', curso.duracao, Timer],
            ] as const
          ).map(([termo, valor, Icon]) => (
            <li key={termo} className="flex items-start justify-center gap-2 md:justify-start">
              <Icon className="mt-[0.2em] h-5 w-5 shrink-0 text-brand-blue" aria-hidden />
              <span>
                {termo}: {valor}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function CursosSection() {
  return (
    <section
      id="cursos"
      aria-labelledby="cursos-titulo"
      className="relative -mt-32 bg-[linear-gradient(180deg,transparent_8rem,#4F71AC_8rem)] lg:-mt-36 lg:bg-[linear-gradient(180deg,transparent_9rem,#4F71AC_9rem)]"
    >
      <div className="container">
        <Reveal className="rounded-card-lg bg-white px-5 pb-6 pt-10 shadow-card sm:px-10 lg:px-28 lg:pb-7 lg:pt-12">
          <SectionHeading id="cursos-titulo" highlight="Cursos">
            Nossos
          </SectionHeading>
          <Carousel label="Cursos oferecidos pelo Instituto" opts={{ loop: true }} className="mt-8 lg:mt-12">
            <div className="flex items-center gap-4">
              <CarouselArrow direction="prev" className="hidden shrink-0 md:grid" />
              <div className="min-w-0 flex-1">
                <CarouselContent>
                  {cursos.map((curso, i) => (
                    <CarouselItem key={curso.id} index={i} className="px-1 py-2">
                      <CursoSlide curso={curso} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
              <CarouselArrow direction="next" className="hidden shrink-0 md:grid" />
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <CarouselArrow direction="prev" className="md:hidden" />
              <CarouselDots />
              <CarouselArrow direction="next" className="md:hidden" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  )
}
