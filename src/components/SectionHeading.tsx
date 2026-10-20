import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Parte do título em azul-marinho */
  children: React.ReactNode
  /** Palavra em destaque azul (ex.: "Instituto") */
  highlight?: string
  /** Pontuação após o destaque, mantida na cor base (ex.: "?") */
  suffix?: string
  as?: 'h1' | 'h2' | 'h3'
  id?: string
  tone?: 'dark' | 'light'
  size?: 'title' | 'title-sm' | 'subtitle'
  align?: 'center' | 'left'
  className?: string
}

const sizes = {
  title: 'text-title',
  'title-sm': 'text-title-sm',
  subtitle: 'text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight',
}

/** Título de seção no padrão do Figma: texto navy com uma palavra em azul. */
export function SectionHeading({
  children,
  highlight,
  suffix,
  as: Tag = 'h2',
  id,
  tone = 'dark',
  size = 'title',
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'text-balance font-display font-bold',
        sizes[size],
        align === 'center' ? 'text-center' : 'text-left',
        tone === 'dark' ? 'text-brand-navy' : 'text-white',
        className,
      )}
    >
      {children}
      {highlight && (
        <>
          {' '}
          <span className="text-brand-blue">{highlight}</span>
        </>
      )}
      {suffix}
    </Tag>
  )
}
