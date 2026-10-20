import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="pt-[4.5rem] outline-none lg:pt-[5.5rem]">
        {children}
      </main>
      <Footer />
    </>
  )
}
