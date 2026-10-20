export interface Curso {
  id: string
  nome: string
  descricao: string
  cargaHoraria: string
  duracao: string
  imagem: string
  imagemAlt: string
}

export const cursos: Curso[] = [
  {
    id: 'informatica',
    nome: 'Curso Técnico de Informática',
    descricao: 'Tecnologia da Informação, Programação, Criação de Sites',
    cargaHoraria: '1.000 horas',
    duracao: '1 ano - de segunda a sexta',
    imagem: '/images/cursos/informatica.webp',
    imagemAlt: 'Tela de computador com código de programação',
  },
  {
    id: 'ingles',
    nome: 'Curso Livre de Inglês Básico ao Pré-Intermediário',
    descricao: 'Desenvolvimento da Comunicação, Vocabulário, Gramática e Conversação em Inglês',
    cargaHoraria: '400 horas',
    duracao: '1 ano - Superintensivo de segunda a sexta-feira',
    imagem: '/images/cursos/ingles.webp',
    imagemAlt: 'Estudante sorrindo com livros em uma sala de aula de inglês',
  },
  {
    id: 'eletromecanica',
    nome: 'Eletromecânica de Autos',
    descricao: 'Elétrica Automotiva, Mecânica, Diagnóstico Eletrônico e Manutenção de Veículos',
    cargaHoraria: '880 horas',
    duracao: '1 ano - de segunda a sexta',
    imagem: '/images/cursos/eletromecanica.webp',
    imagemAlt: 'Aluno trabalhando em um painel elétrico automotivo',
  },
  {
    id: 'administracao',
    nome: 'Curso Técnico em Administração',
    descricao: 'Controle de estoques, gestão de recursos humanos, logística, marketing e operações contábeis.',
    cargaHoraria: '1.000 horas',
    duracao: '1 ano - de segunda a sexta',
    imagem: '/images/cursos/administracao.webp',
    imagemAlt: 'Profissionais analisando documentos em um escritório',
  },
]
