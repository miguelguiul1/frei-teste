import { Img } from '@/components/Img'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section id="inicio" aria-labelledby="hero-titulo" className="relative overflow-hidden bg-brand-mist">
      {/* Foto dos alunos: à direita no desktop, abaixo do texto no mobile */}
      <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:block">
        <Img
          src="/images/hero/alunos-robotica.webp"
          alt="Dois alunos do Instituto sorrindo e segurando carrinhos de robótica que construíram"
          priority
          width={740}
          height={500}
          wrapperClassName="h-full w-full bg-none bg-brand-mist"
          className="object-[60%_center] animate-in fade-in zoom-in-[1.03] duration-1000"
        />
        {/* degradê que funde a foto ao fundo cinza, como no Figma */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,#F6F6F6_0%,rgba(246,246,246,0.85)_18%,rgba(246,246,246,0)_45%)]"
        />
        <div aria-hidden className="absolute inset-0 bg-white/10" />
      </div>

      <div className="container relative grid items-center pt-12 lg:min-h-[50rem] lg:grid-cols-2 lg:py-20">
        <div className="mx-auto max-w-[40rem] text-center lg:mx-0">
          <h1
            id="hero-titulo"
            className="font-display text-display font-extrabold text-brand-navy animate-in fade-in slide-in-from-bottom-3 duration-700"
          >
            Participe da <br />
            <span className="text-brand-blue">6ª Feira das</span> <br className="hidden sm:inline" />
            <span className="text-brand-blue">Profissões</span> do Frei
          </h1>
          <p className="mx-auto mt-8 max-w-[30rem] text-lead font-medium text-brand-navy animate-in fade-in slide-in-from-bottom-3 duration-700 [animation-delay:120ms] [animation-fill-mode:both]">
            Descubra hoje a profissão do seu amanhã!
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700 [animation-delay:220ms] [animation-fill-mode:both] sm:flex-row sm:gap-11">
            <Button asChild size="lg" className="w-full max-w-[14rem] sm:w-auto">
              <a href="#inscricao">Fazer Inscrição</a>
            </Button>
            <Button asChild variant="light" size="lg" className="w-full max-w-[14rem] sm:w-auto sm:min-w-[13.5rem]">
              <a href="#programacao">Programação</a>
            </Button>
          </div>
        </div>

        <div className="relative -mx-5 mt-12 sm:-mx-6 lg:hidden">
          <Img
            src="/images/hero/alunos-robotica.webp"
            alt="Dois alunos do Instituto sorrindo e segurando carrinhos de robótica que construíram"
            width={740}
            height={500}
            wrapperClassName="aspect-[4/3] w-full sm:aspect-[16/9]"
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-brand-mist to-transparent" />
        </div>
      </div>
    </section>
  )
}
