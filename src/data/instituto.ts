import type { IconType } from 'react-icons'
import { MdCoPresent, MdDesktopWindows, MdLocalLibrary } from 'react-icons/md'

export const institutoTexto =
  'Há mais de 50 anos, o Instituto Social Nossa Senhora de Fátima transforma vidas por meio da educação. Fundado em 1971 pelo Frei Xavier, dedica-se à formação humana e profissional de jovens a partir dos 13 anos, oferecendo cursos técnicos, de qualificação e livres. Com compromisso, excelência e responsabilidade social, constrói oportunidades que fortalecem o desenvolvimento da juventude e da comunidade.'

export const freiXavier = {
  nome: 'Ambrogio Fornasieiro, OFM',
  apelido: 'Frei Xavier',
  periodo: '(1930 - 2026)',
  descricao: 'Idealizador do Instituto Social Nossa Senhora de Fátima e da Paróquia Santa Rita de Cássia',
  foto: '/images/instituto/frei-xavier.webp',
}

export interface ItemEstrutura {
  label: string
  icon: IconType
}

export const estrutura: ItemEstrutura[] = [
  { label: 'Salas estruturadas', icon: MdLocalLibrary },
  { label: 'Laboratórios de Informática', icon: MdDesktopWindows },
  { label: 'Auditório para uso', icon: MdCoPresent },
]
