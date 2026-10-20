export interface NavItem {
  label: string
  /** id da seção na landing page */
  id: string
}

export const navItems: NavItem[] = [
  { label: 'Início', id: 'inicio' },
  { label: 'Programação', id: 'programacao' },
  { label: 'Cursos', id: 'cursos' },
  { label: 'Inscrição', id: 'inscricao' },
  { label: 'Contato', id: 'contato' },
]
