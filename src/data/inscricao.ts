import { faixasDeChegada } from '@/config/evento'
import { cursos } from '@/data/cursos'

export const opcoesEscolaridade = [
  'Ensino Fundamental (cursando)',
  'Ensino Fundamental (completo)',
  'Ensino Médio (cursando)',
  'Ensino Médio (completo)',
  'Ensino Técnico',
  'Ensino Superior (cursando)',
  'Ensino Superior (completo)',
] as const

export const opcoesCurso = [...cursos.map((c) => c.nome), 'Ainda não sei'] as const

export const opcoesComoSoube = [
  'Instagram',
  'Indicação de amigos ou familiares',
  'Escola onde estudo',
  'Já sou ou fui aluno do Instituto',
  'Paróquia / comunidade',
  'Cartaz ou panfleto',
  'Outro',
] as const

export const opcoesChegada = faixasDeChegada as [string, ...string[]]
