import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** atraso em ms, para escalonar elementos de uma mesma grade */
  delay?: number
  as?: 'div' | 'li' | 'article'
}

/** Faz o conteúdo surgir suavemente quando entra na tela (uma única vez). */
export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out-soft motion-reduce:transform-none motion-reduce:opacity-100',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
