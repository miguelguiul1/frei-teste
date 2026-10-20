import { useEffect, useState } from 'react'

/** Retorna o id da seção visível no momento (scrollspy para o menu). */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!elements.length) return

    const visible = new Map<string, boolean>()
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

    const update = () => {
      // no fim da página a última seção (rodapé/contato) nunca chega ao centro da tela
      if (atBottom()) return setActive(ids[ids.length - 1])
      const current = ids.find((id) => visible.get(id))
      if (current) setActive(current)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting))
        update()
      },
      // considera "ativa" a seção que cruza a faixa central da tela
      { rootMargin: '-45% 0px -50% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [ids])

  return active
}
