import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/images/marca/logo-feira.webp"
      alt="6ª Feira das Profissões - Instituto Social Nossa Senhora de Fátima"
      width={256}
      height={241}
      decoding="async"
      className={cn('h-16 w-auto', className)}
    />
  )
}
