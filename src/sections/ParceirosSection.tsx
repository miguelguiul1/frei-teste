import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { parceiros, parceirosDestaque, type Parceiro } from '@/data/parceiros'
import { cn } from '@/lib/utils'

function LogoCard({ parceiro, className }: { parceiro: Parceiro; className?: string }) {
  const content = (
    <img
      src={parceiro.logo}
      alt={parceiro.nome}
      width={164}
      height={164}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-contain"
    />
  )
  return (
    <div
      className={cn(
        'grid aspect-square place-items-center overflow-hidden rounded-card bg-white p-3 shadow-figma transition-transform duration-300 ease-out-soft hover:-translate-y-1',
        className,
      )}
    >
      {parceiro.site ? (
        <a href={parceiro.site} target="_blank" rel="noopener noreferrer" className="block h-full w-full rounded-lg">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}

export function ParceirosSection() {
  return (
    <section
      id="parceiros"
      aria-labelledby="parceiros-titulo"
      className="bg-[linear-gradient(180deg,#042A7E_0%,#042A7E_55%,#0B348A_100%)] pb-section pt-4"
    >
      <div className="container">
        <SectionHeading id="parceiros-titulo" tone="light" size="title-sm">
          Nossos Parceiros
        </SectionHeading>

        <ul className="mx-auto mt-12 flex max-w-[71rem] flex-wrap justify-center gap-5 sm:gap-8 lg:justify-between lg:gap-0">
          {parceirosDestaque.map((p, i) => (
            <Reveal as="li" key={p.nome} delay={i * 70} className="w-[8.5rem] sm:w-36">
              <LogoCard parceiro={p} />
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="light-accent" size="lg" className="h-[4.4rem] min-w-[20.5rem] text-2xl font-bold sm:text-[2rem]">
                Lista completa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Todos os nossos parceiros</DialogTitle>
                <DialogDescription>
                  Empresas e instituições que apoiam a formação dos nossos alunos e a Feira das Profissões.
                </DialogDescription>
              </DialogHeader>
              <ul className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {parceiros.map((p) => (
                  <li key={p.nome} className="flex flex-col items-center gap-2 text-center">
                    <LogoCard parceiro={p} className="w-full border border-brand-sky shadow-none" />
                    <span className="text-sm font-medium text-brand-navy">{p.nome}</span>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}
