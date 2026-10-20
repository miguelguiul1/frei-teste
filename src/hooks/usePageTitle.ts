import { useEffect } from 'react'

import { evento } from '@/config/evento'
import { seo } from '@/config/seo'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${evento.nome}` : seo.title
  }, [title])
}
