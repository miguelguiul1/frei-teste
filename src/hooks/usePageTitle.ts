import { useEffect } from 'react'

const BASE = '6ª Feira das Profissões do Frei'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} | Instituto Social Nossa Senhora de Fátima`
  }, [title])
}
