import { SiteLayout } from '@/components/SiteLayout'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function HomePage() {
  usePageTitle()
  return (
    <SiteLayout>
      <section id="inicio" className="min-h-[60vh]" />
    </SiteLayout>
  )
}
