import { Link } from 'react-router-dom'

import { SiteLayout } from '@/components/SiteLayout'
import { Button } from '@/components/ui/button'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Página não encontrada')
  return (
    <SiteLayout>
      <section className="grid min-h-[60vh] place-items-center bg-grad-sky px-5 py-section text-center">
        <div>
          <p className="font-display text-title font-bold text-brand-blue">404</p>
          <h1 className="mt-2 text-subtitle font-semibold text-brand-navy">Página não encontrada</h1>
          <p className="mt-3 text-body-lg text-brand-navy/80">O endereço acessado não existe ou foi movido.</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  )
}
