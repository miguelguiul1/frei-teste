import { site } from '@/config/site'

/**
 * Dados da política de privacidade (LGPD).
 * TODO(escola): revisar e confirmar todos os campos abaixo antes da próxima edição.
 */
export const privacidade = {
  /**
   * Controlador: quem decide sobre o uso dos dados.
   * TODO(escola): confirmar a razão social e informar o CNPJ.
   */
  responsavel: {
    nome: site.nome,
    cnpj: '' as string, // TODO(escola): preencher, ex.: "00.000.000/0001-00"
  },
  /**
   * Por quanto tempo as inscrições ficam guardadas.
   * TODO(escola): confirmar o prazo de retenção.
   */
  prazoRetencao: '12 meses após a data da feira',
  /** Data da última revisão do texto (AAAA-MM-DD). */
  atualizadoEm: '2026-10-20',
}
