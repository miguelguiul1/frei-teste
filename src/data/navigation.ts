import { inscricoesAbertas } from '@/config/evento'

export interface NavItem {
  label: string
  /** id da seção na landing page */
  id: string
  /** só aparece enquanto as inscrições estiverem abertas */
  somenteComInscricoes?: boolean
}

const todos: NavItem[] = [
  { label: 'Início', id: 'inicio' },
  { label: 'Programação', id: 'programacao' },
  { label: 'Cursos', id: 'cursos' },
  { label: 'Inscrição', id: 'inscricao', somenteComInscricoes: true },
  { label: 'Contato', id: 'contato' },
]

export const navItems = todos.filter((item) => inscricoesAbertas || !item.somenteComInscricoes)
