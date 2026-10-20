export interface Parceiro {
  nome: string
  logo: string
  site?: string
  /** Aparece na versão resumida da seção */
  destaque?: boolean
}

export const parceiros: Parceiro[] = [
  {
    nome: 'Cidade de São Paulo - Assistência e Desenvolvimento Social',
    logo: '/images/parceiros/cidade-de-sao-paulo.webp',
    destaque: true,
  },
  { nome: 'CM Comandos Lineares', logo: '/images/parceiros/cm-comandos-lineares.webp', destaque: true },
  { nome: 'PWI Sistemas', logo: '/images/parceiros/pwi-sistemas.webp', destaque: true },
  { nome: 'MWM', logo: '/images/parceiros/mwm.webp', destaque: true },
  { nome: 'Casa da Mulher Paulistana', logo: '/images/parceiros/casa-da-mulher-paulistana.webp', destaque: true },
  { nome: 'Viação Grajaú', logo: '/images/parceiros/viacao-grajau.webp' },
]

export const parceirosDestaque = parceiros.filter((p) => p.destaque)
