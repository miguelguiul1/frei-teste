import { Img } from '@/components/Img'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { estrutura, freiXavier, institutoTexto } from '@/data/instituto'

export function InstitutoSection() {
  return (
    <section id="instituto" aria-labelledby="instituto-titulo" className="relative isolate pb-44 pt-section lg:pb-52">
      {/* Fundo: azul-claro que se dissolve na fachada do Instituto */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden bg-brand-sky">
        <img
          src="/images/instituto/fachada.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-x-0 bottom-0 h-[78%] w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#D8EFFF_0%,#D8EFFF_22%,rgba(216,239,255,0.55)_45%,rgba(216,239,255,0.1)_70%,rgba(79,113,172,0.55)_88%,#4F71AC_100%)]" />
      </div>

      <div className="container">
        <SectionHeading id="instituto-titulo" highlight="Instituto">
          O nosso
        </SectionHeading>
        <p className="mt-2 text-center text-subtitle font-medium text-brand-navy">Muito mais que uma escola</p>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12 2xl:grid-cols-[minmax(0,36.75rem)_minmax(0,1fr)] 2xl:gap-20">
          <Reveal className="rounded-card bg-white px-6 py-8 shadow-card sm:px-10 sm:py-12 lg:flex lg:items-center lg:px-10 lg:py-14 2xl:px-[3.25rem] 2xl:py-16">
            <p className="hyphens-auto text-lg font-medium leading-[1.3] text-brand-navy sm:text-justify sm:text-xl lg:text-[1.375rem] lg:leading-[1.3] xl:text-2xl 2xl:text-[1.75rem] 2xl:leading-[1.22]">
              {institutoTexto}
            </p>
          </Reveal>

          <div className="flex flex-col gap-10">
            <Reveal delay={100} className="grid items-start gap-5 sm:grid-cols-[15.5rem_1fr] lg:grid-cols-[11rem_1fr] xl:grid-cols-[15.5rem_1fr]">
              <Img
                src={freiXavier.foto}
                alt="Frei Xavier sorrindo, de cabelos brancos, em foto de homenagem"
                width={545}
                height={600}
                wrapperClassName="mx-auto aspect-[246/244] w-56 rounded-card border-4 border-white shadow-figma sm:mx-0 sm:w-full"
                className="object-[center_25%]"
              />
              <div className="flex flex-col gap-4 text-center sm:text-left">
                <p className="text-lg font-semibold leading-snug text-brand-navy sm:mt-2 lg:text-xl">
                  {freiXavier.nome}
                  <br />
                  {freiXavier.apelido}
                  <br />
                  {freiXavier.periodo}
                </p>
                <p className="rounded-card bg-white px-6 py-4 text-base font-medium leading-snug text-brand-navy shadow-figma sm:text-justify lg:px-8 lg:text-xl">
                  {freiXavier.descricao}
                </p>
              </div>
            </Reveal>

            <div>
              <div className="relative isolate">
                {/* desktop: camada azul suave atrás do título para garantir contraste sobre a foto */}
                <span
                  aria-hidden
                  className="absolute -inset-x-4 -inset-y-3 -z-10 hidden rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(4,42,126,0.7)_0%,rgba(4,42,126,0.55)_50%,rgba(4,42,126,0)_80%)] lg:block"
                />
                <h3 className="text-center font-display text-title font-bold text-white [text-shadow:0_4px_12px_rgba(4,42,126,0.45)] lg:[text-shadow:0_2px_10px_rgba(4,42,126,0.7)]">
                  Estrutura
                </h3>
              </div>
              <ul className="mt-6 grid grid-cols-3 gap-3 sm:gap-6 lg:gap-4 xl:gap-6 2xl:gap-14">
                {estrutura.map(({ label, icon: Icon }, i) => (
                  <Reveal as="li" key={label} delay={i * 90}>
                    <div className="group flex h-full flex-col items-center justify-center gap-2 rounded-card bg-white px-2 py-5 text-center shadow-figma transition-transform duration-300 ease-out-soft hover:-translate-y-1 sm:py-6 lg:min-w-0 lg:px-3">
                      <Icon
                        className="h-11 w-11 text-brand-navy transition-transform duration-300 ease-out-soft group-hover:scale-110 sm:h-16 sm:w-16"
                        aria-hidden
                      />
                      <span className="text-sm font-medium leading-tight text-brand-navy sm:text-lg lg:max-w-full lg:text-balance lg:break-words lg:text-base 2xl:text-lg">
                        {label}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
