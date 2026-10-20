import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Ao trocar de rota: rola até a âncora (ex.: /#cursos) ou volta ao topo. */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // aguarda a página renderizar antes de procurar a âncora
      const id = decodeURIComponent(hash.slice(1))
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
