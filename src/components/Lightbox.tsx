import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { FotoGaleria } from '@/data/galeria'

interface LightboxProps {
  fotos: FotoGaleria[]
  index: number | null
  onIndexChange: (index: number | null) => void
}

/** Visualizador de fotos em tela cheia com navegação por setas (teclado e botões). */
export function Lightbox({ fotos, index, onIndexChange }: LightboxProps) {
  const open = index !== null
  const total = fotos.length
  const go = (delta: number) => index !== null && onIndexChange((index + delta + total) % total)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const foto = index !== null ? fotos[index] : null

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onIndexChange(null)}>
      <DialogContent
        className="max-w-5xl gap-0 bg-transparent p-0 shadow-none"
        closeClassName="right-2 top-2 bg-white/90 shadow-figma sm:-right-3 sm:-top-3"
      >
        {foto && (
          <figure className="relative">
            <img
              key={foto.src}
              src={foto.src}
              alt={foto.alt}
              className="max-h-[80dvh] w-full rounded-card-lg border-[10px] border-white bg-white object-contain animate-in fade-in zoom-in-95 duration-300"
            />
            <figcaption className="mt-3 flex items-center justify-between gap-4 text-white">
              <DialogTitle className="text-base font-medium text-white">{foto.alt}</DialogTitle>
              <DialogDescription className="shrink-0 text-sm text-white/80">
                {index! + 1} / {total}
              </DialogDescription>
            </figcaption>
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto anterior"
                  className="absolute left-3 top-[calc(50%-1.5rem)] grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-navy shadow-figma transition hover:bg-white"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Próxima foto"
                  className="absolute right-3 top-[calc(50%-1.5rem)] grid h-11 w-11 place-items-center rounded-full bg-white/90 text-brand-navy shadow-figma transition hover:bg-white"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden />
                </button>
              </>
            )}
          </figure>
        )}
      </DialogContent>
    </Dialog>
  )
}
