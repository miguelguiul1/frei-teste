import { useEffect, useState } from 'react'

/** Retorna o id da seção visível no momento (scrollspy para o menu). */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (!elements.length) return

    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0))
        // escolhe a primeira seção (na ordem do menu) que está ocupando a faixa central da tela
        const current = ids.find((id) => (visible.get(id) ?? 0) > 0)
        if (current) setActive(current)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.01] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
