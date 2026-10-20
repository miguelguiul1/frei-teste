import { evento } from '@/config/evento'
import { site } from '@/config/site'
import { navItems } from '@/data/navigation'

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-xl font-medium leading-tight">
      {children}
      <span aria-hidden className="mt-2 block h-px w-12 bg-white" />
    </h2>
  )
}

export function Footer() {
  return (
    <footer id="contato" className="bg-brand-blue font-footer text-white">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[auto_1.3fr_1.3fr_0.8fr_1fr] lg:gap-8 lg:py-16">
        <img
          src="/images/marca/instituto-logo.webp"
          alt="Logotipo do Instituto Social Nossa Senhora de Fátima, desde 1971"
          width={145}
          height={169}
          loading="lazy"
          className="h-auto w-28 rounded-md shadow-figma lg:w-[9rem]"
        />

        <div>
          <h2 className="mb-4 text-xl font-medium leading-tight">
            Instituto Social Nossa
            <br />
            Senhora De Fátima
            <span aria-hidden className="mt-2 block h-px w-12 bg-white" />
          </h2>
          <p className="max-w-xs text-sm leading-7 text-white/90">
            Descubra seu <strong className="font-semibold text-white">futuro</strong> na Feira de Profissões{' '}
            {evento.ano} — conecte-se com o <strong className="font-semibold text-white">mercado</strong> e encontre o
            caminho ideal para sua carreira!
          </p>
        </div>

        <div>
          <FooterHeading>Horários e Endereço</FooterHeading>
          <p className="mb-3 text-sm font-semibold">
            {evento.dataExtenso} das {evento.horario}
          </p>
          <address className="max-w-[15rem] text-sm not-italic leading-7 text-white/90">
            <a href={evento.mapsLinkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {evento.enderecoCompleto}
              <span className="sr-only"> (abre o mapa em nova aba)</span>
            </a>
          </address>
        </div>

        <nav aria-label="Links rápidos">
          <FooterHeading>Links Rápidos</FooterHeading>
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  className="inline-block py-0.5 text-lg text-white/90 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterHeading>Contato</FooterHeading>
          <ul className="space-y-2 text-base text-white/90">
            <li>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">
                <span className="sr-only">Instagram: </span>
                {site.instagram.usuario}
              </a>
            </li>
            {site.telefones.map((tel) => (
              <li key={tel.numero}>
                <a
                  href={tel.href}
                  target={tel.href.startsWith('http') ? '_blank' : undefined}
                  rel={tel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="hover:text-white hover:underline"
                >
                  {tel.numero} - {tel.descricao}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <p className="container py-5 text-center text-sm text-white/90">
          © {evento.ano} Todos os direitos reservados para {site.nome}.
        </p>
      </div>
    </footer>
  )
}
