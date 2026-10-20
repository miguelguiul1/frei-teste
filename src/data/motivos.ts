import type { IconType } from 'react-icons'
import { MdCastForEducation, MdDiversity3, MdEngineering, MdForum, MdGroups, MdRoute } from 'react-icons/md'

export interface Motivo {
  titulo: string
  texto: string
  icon: IconType
}

/** Cards da seção "Por que participar da Feira?" (textos do Figma). */
export const motivos: Motivo[] = [
  {
    titulo: 'Conheça os cursos',
    texto: 'Explore os cursos oferecidos pela instituição e encontre uma formação alinhada aos seus interesses',
    icon: MdCastForEducation,
  },
  {
    titulo: 'Experimente na prática',
    texto: 'Veja projetos reais, participe de atividades interativas e descubra como a tecnologia transforma ideias em soluções',
    icon: MdEngineering,
  },
  {
    titulo: 'Converse com especialistas',
    texto: 'Tire dúvidas com professores, coordenadores e alunos que podem compartilhar experiências da jornada acadêmica',
    icon: MdForum,
  },
  {
    titulo: 'Crie conexões',
    texto: 'Conheça estudantes, profissionais e pessoas interessadas em tecnologia e inovação.',
    icon: MdDiversity3,
  },
  {
    titulo: 'Prepare seu futuro',
    texto: 'Tenha contato com oportunidades de aprendizado e desenvolvimento profissional',
    icon: MdGroups,
  },
  {
    titulo: 'Descubra seu caminho',
    texto: 'Explore possibilidades profissionais e encontre áreas que combinam com seus objetivos',
    icon: MdRoute,
  },
]
