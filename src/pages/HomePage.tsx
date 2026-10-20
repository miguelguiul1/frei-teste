import { SiteLayout } from '@/components/SiteLayout'
import { usePageTitle } from '@/hooks/usePageTitle'
import { CursosSection } from '@/sections/CursosSection'
import { DepoimentosSection } from '@/sections/DepoimentosSection'
import { HeroSection } from '@/sections/HeroSection'
import { InscricaoSection } from '@/sections/InscricaoSection'
import { InstitutoSection } from '@/sections/InstitutoSection'
import { ParceirosSection } from '@/sections/ParceirosSection'
import { PorQueParticiparSection } from '@/sections/PorQueParticiparSection'
import { ProgramacaoSection } from '@/sections/ProgramacaoSection'
import { UltimaFeiraSection } from '@/sections/UltimaFeiraSection'

export default function HomePage() {
  usePageTitle()
  return (
    <SiteLayout>
      <HeroSection />
      <DepoimentosSection />
      <InstitutoSection />
      <CursosSection />
      <ProgramacaoSection />
      <InscricaoSection />
      <PorQueParticiparSection />
      <UltimaFeiraSection />
      <ParceirosSection />
    </SiteLayout>
  )
}
