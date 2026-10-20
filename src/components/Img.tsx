import { ImageOff } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  /** Classes do contêiner (que recebe o placeholder) */
  wrapperClassName?: string
  /** Carrega imediatamente (use em imagens acima da dobra) */
  priority?: boolean
}

/**
 * Imagem com lazy loading e placeholder: mostra um fundo animado enquanto carrega
 * e um ícone neutro caso o arquivo ainda não exista (fotos finais pendentes).
 */
export function Img({ src, alt, className, wrapperClassName, priority, ...props }: ImgProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <span
      className={cn(
        'relative block overflow-hidden bg-gradient-to-br from-brand-sky to-brand-mist',
        status === 'loading' && 'animate-pulse',
        wrapperClassName,
      )}
    >
      {status === 'error' ? (
        <span className="absolute inset-0 grid place-items-center text-brand-navy/40" role="img" aria-label={alt}>
          <ImageOff className="h-8 w-8" aria-hidden />
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // atributo em minúsculas: React 18 não reconhece a prop camelCase
          {...{ fetchpriority: priority ? 'high' : 'auto' }}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500 ease-out-soft',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        />
      )}
    </span>
  )
}
