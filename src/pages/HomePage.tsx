import { SiteLayout } from '@/components/SiteLayout'
import { eventoEncerrado } from '@/config/evento'
import { usePageTitle } from '@/hooks/usePageTitle'
import { CursosSection } from '@/sections/CursosSection'
import { DepoimentosSection } from '@/sections/DepoimentosSection'
import { HeroSection } from '@/sections/HeroSection'
import { InscricaoSection } from '@/sections/InscricaoSection'
import { InscricoesEncerradasSection } from '@/sections/InscricoesEncerradasSection'
import { InstitutoSection } from '@/sections/InstitutoSection'
import { ParceirosSection } from '@/sections/ParceirosSection'
import { PorQueParticiparSection } from '@/sections/PorQueParticiparSection'
import { ProgramacaoSection } from '@/sections/ProgramacaoSection'
import { UltimaFeiraSection } from '@/sections/UltimaFeiraSection'

export default function HomePage() {
  usePageTitle()

  // Evento encerrado: a galeria e os depoimentos sobem para o centro da página
  // e o formulário dá lugar ao aviso de inscrições encerradas.
  if (eventoEncerrado) {
    return (
      <SiteLayout>
        <HeroSection />
        <UltimaFeiraSection destaque />
        <DepoimentosSection />
        <InstitutoSection />
        <CursosSection />
        <ProgramacaoSection />
        <InscricoesEncerradasSection />
        <PorQueParticiparSection />
        <ParceirosSection />
      </SiteLayout>
    )
  }

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
