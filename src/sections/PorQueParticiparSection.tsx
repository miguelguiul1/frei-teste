import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { motivos } from '@/data/motivos'

export function PorQueParticiparSection() {
  return (
    <section
      id="por-que-participar"
      aria-labelledby="porque-titulo"
      className="bg-grad-why pb-16 pt-section lg:pb-12"
    >
      <div className="container">
        <SectionHeading id="porque-titulo" highlight="Feira" suffix="?">
          Por que participar da
        </SectionHeading>

        <ul className="mx-auto mt-12 grid max-w-[76rem] gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-12">
          {motivos.map(({ titulo, texto, icon: Icon }, i) => (
            <Reveal as="li" key={titulo} delay={(i % 3) * 90}>
              <article className="group flex h-full flex-col items-center rounded-card bg-white px-7 pb-7 pt-8 text-center shadow-figma transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-card-hover">
                <Icon
                  className="h-14 w-14 text-brand-navy transition-transform duration-500 ease-out-soft group-hover:-rotate-6 group-hover:scale-110"
                  aria-hidden
                />
                <h3 className="mt-3 text-[1.375rem] font-medium text-brand-ink">{titulo}</h3>
                <p className="mt-4 text-lg leading-tight text-brand-ink/90">{texto}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
