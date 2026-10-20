import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { navItems } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { cn } from '@/lib/utils'

const sectionIds = navItems.map((item) => item.id)

export function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const activeId = useActiveSection(isHome ? sectionIds : [])
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu mobile: ESC fecha e devolve o foco ao botão; foco vai para o primeiro link ao abrir
  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // fecha o menu ao passar para o layout desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-300',
        scrolled || open ? 'shadow-[0_2px_16px_rgba(4,42,126,0.10)]' : 'shadow-none',
      )}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-brand-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <nav aria-label="Principal" className="container flex h-[4.5rem] items-center justify-between gap-6 lg:h-[5.5rem] xl:px-[3.75rem]">
        <a href={hrefFor('inicio')} className="shrink-0 rounded-full" aria-label="Início - 6ª Feira das Profissões">
          <Logo className="h-12 lg:h-16" />
        </a>

        <ul className="hidden items-center gap-2 lg:flex xl:gap-8">
          {navItems.map((item) => {
            const active = isHome && activeId === item.id
            return (
              <li key={item.id}>
                <a
                  href={hrefFor(item.id)}
                  aria-current={active ? 'location' : undefined}
                  className={cn(
                    'group relative inline-block rounded-md px-3 py-2 text-[1.25rem] font-medium text-brand-navy transition-colors hover:text-brand-blue xl:text-[1.375rem]',
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-full bg-brand-navy transition-transform duration-300 ease-out-soft',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-hover:bg-brand-blue',
                    )}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="md" className="hidden h-11 text-lg sm:inline-flex">
            <Link to="/admin/login">Administrativo</Link>
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-brand-navy transition-colors hover:bg-brand-sky lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="border-t border-brand-sky bg-white lg:hidden"
      >
        <ul className="container flex flex-col py-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={hrefFor(item.id)}
                onClick={() => setOpen(false)}
                aria-current={isHome && activeId === item.id ? 'location' : undefined}
                className="flex items-center justify-between rounded-btn px-3 py-3 text-lg font-medium text-brand-navy hover:bg-brand-sky/60 aria-[current=location]:text-brand-blue"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="mt-2 sm:hidden">
            <Button asChild className="w-full">
              <Link to="/admin/login" onClick={() => setOpen(false)}>
                Administrativo
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
