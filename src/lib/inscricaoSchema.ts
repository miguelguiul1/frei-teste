import { z } from 'zod'

import { opcoesChegada, opcoesComoSoube, opcoesCurso, opcoesEscolaridade } from '@/data/inscricao'
import { isValidPhoneBR, onlyDigits } from '@/lib/phone'

const opcional = <T extends readonly [string, ...string[]]>(opcoes: T, mensagem: string) =>
  z.union([z.enum(opcoes, { error: mensagem }), z.literal('')])

export const inscricaoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Informe seu nome completo.')
    .min(5, 'O nome está muito curto.')
    .max(120, 'O nome pode ter no máximo 120 caracteres.')
    .refine((v) => v.split(/\s+/).length >= 2, 'Informe nome e sobrenome.'),
  telefone: z
    .string()
    .min(1, 'Informe seu telefone.')
    .refine(isValidPhoneBR, 'Informe um telefone válido com DDD, ex.: (11) 91234-5678.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .max(160, 'O e-mail pode ter no máximo 160 caracteres.')
    .pipe(z.email('Informe um e-mail válido, ex.: nome@email.com.')),
  escolaridade: z.enum(opcoesEscolaridade, { error: 'Selecione sua escolaridade.' }),
  ex_aluno: z.enum(['sim', 'nao'], { error: 'Informe se você já foi aluno do Frei.' }),
  curso_interesse: z.enum(opcoesCurso, { error: 'Selecione o curso de seu interesse.' }),
  como_soube: opcional(opcoesComoSoube, 'Opção inválida.'),
  previsao_chegada: opcional(opcoesChegada, 'Opção inválida.'),
  /** honeypot: campo invisível que só robôs preenchem */
  website: z.string().optional(),
})

export type InscricaoFormInput = z.input<typeof inscricaoSchema>
export type InscricaoFormValues = z.output<typeof inscricaoSchema>

export const inscricaoDefaults: InscricaoFormInput = {
  nome: '',
  telefone: '',
  email: '',
  escolaridade: '' as InscricaoFormInput['escolaridade'],
  ex_aluno: '' as InscricaoFormInput['ex_aluno'],
  curso_interesse: '' as InscricaoFormInput['curso_interesse'],
  como_soube: '',
  previsao_chegada: '',
  website: '',
}

/** Converte os valores do formulário para o formato da tabela `inscricoes`. */
export function toInsert(values: InscricaoFormValues) {
  return {
    nome: values.nome.replace(/\s+/g, ' '),
    telefone: onlyDigits(values.telefone),
    email: values.email.toLowerCase(),
    escolaridade: values.escolaridade,
    ex_aluno: values.ex_aluno === 'sim',
    curso_interesse: values.curso_interesse,
    como_soube: values.como_soube || null,
    previsao_chegada: values.previsao_chegada || null,
  }
}
