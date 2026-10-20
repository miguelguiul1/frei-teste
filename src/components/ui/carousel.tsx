import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

type CarouselApi = UseEmblaCarouselType[1]
type CarouselOptions = Parameters<typeof useEmblaCarousel>[0]

interface CarouselProps {
  opts?: CarouselOptions
  /** Rótulo acessível do carrossel (ex.: "Depoimentos de ex-alunos") */
  label: string
  className?: string
  children: React.ReactNode
}

interface CarouselContextValue {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  selectedIndex: number
  slideCount: number
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error('useCarousel deve ser usado dentro de <Carousel />')
  return ctx
}

/**
 * Carrossel acessível (padrão WAI-ARIA "carousel"):
 * - setas ← → navegam quando o foco está dentro do carrossel;
 * - slides fora da tela ficam inertes para leitores de tela e Tab;
 * - região "aria-live" anuncia o slide atual.
 */
function Carousel({ opts, label, className, children }: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel({ align: 'start', ...opts })
  // estado do embla lido como "store externo" (evita setState dentro de efeitos)
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!api) return () => {}
      api.on('select', onChange).on('reInit', onChange)
      return () => {
        api.off('select', onChange).off('reInit', onChange)
      }
    },
    [api],
  )
  const selectedIndex = React.useSyncExternalStore(subscribe, () => api?.selectedScrollSnap() ?? 0)
  const slideCount = React.useSyncExternalStore(subscribe, () => api?.scrollSnapList().length ?? 0)
  const canScrollPrev = React.useSyncExternalStore(subscribe, () => api?.canScrollPrev() ?? false)
  const canScrollNext = React.useSyncExternalStore(subscribe, () => api?.canScrollNext() ?? false)

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api])
  const scrollTo = React.useCallback((i: number) => api?.scrollTo(i), [api])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollNext()
    }
  }

  return (
    <CarouselContext.Provider
      value={{ carouselRef, api, selectedIndex, slideCount, scrollPrev, scrollNext, scrollTo, canScrollPrev, canScrollNext }}
    >
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label={label}
        onKeyDownCapture={handleKeyDown}
        className={cn('relative', className)}
      >
        {children}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {slideCount > 1 ? `Item ${selectedIndex + 1} de ${slideCount}` : ''}
        </p>
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { carouselRef } = useCarousel()
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div className={cn('flex touch-pan-y', className)}>{children}</div>
    </div>
  )
}

function CarouselItem({
  index,
  className,
  children,
}: {
  index: number
  className?: string
  children: React.ReactNode
}) {
  const { selectedIndex, slideCount } = useCarousel()
  const hidden = slideCount > 1 && index !== selectedIndex
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} de ${slideCount || 1}`}
      aria-hidden={hidden || undefined}
      // `inert` remove os slides escondidos da ordem de tabulação
      {...(hidden ? { inert: '' } : {})}
      className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}
    >
      {children}
    </div>
  )
}

/** Indicadores em pontos, como no Figma (ponto ativo em azul-claro). */
function CarouselDots({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const { slideCount, selectedIndex, scrollTo } = useCarousel()
  if (slideCount < 2) return null
  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {Array.from({ length: slideCount }, (_, i) => {
        const active = i === selectedIndex
        return (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Ir para o item ${i + 1}`}
            aria-current={active || undefined}
            className="group grid h-6 w-6 place-items-center rounded-full"
          >
            <span
              className={cn(
                'block h-2 rounded-full transition-all duration-300 ease-out-soft',
                active ? 'w-5 bg-brand-blue-soft' : 'w-2 group-hover:bg-brand-blue',
                !active && (tone === 'dark' ? 'bg-brand-navy' : 'bg-white/70'),
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

function CarouselArrow({ direction, className }: { direction: 'prev' | 'next'; className?: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext, slideCount } = useCarousel()
  if (slideCount < 2) return null
  const isPrev = direction === 'prev'
  const Icon = isPrev ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={isPrev ? scrollPrev : scrollNext}
      disabled={isPrev ? !canScrollPrev : !canScrollNext}
      aria-label={isPrev ? 'Item anterior' : 'Próximo item'}
      className={cn(
        'grid h-11 w-11 place-items-center rounded-full bg-white text-brand-navy shadow-figma transition-all duration-200 ease-out-soft hover:-translate-y-0.5 hover:shadow-card-hover disabled:pointer-events-none disabled:opacity-40',
        className,
      )}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  )
}

export { Carousel, CarouselArrow, CarouselContent, CarouselDots, CarouselItem }
