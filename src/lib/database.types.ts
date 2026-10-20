/** Tipos da tabela `inscricoes` (ver supabase/migrations). */
export type InscricaoRow = {
  id: string
  created_at: string
  nome: string
  telefone: string
  email: string
  escolaridade: string
  ex_aluno: boolean
  curso_interesse: string
  como_soube: string | null
  previsao_chegada: string | null
  consentimento: boolean
  consentimento_em: string | null
}

export type InscricaoInsert = Omit<InscricaoRow, 'id' | 'created_at' | 'consentimento_em'>

export type Database = {
  public: {
    Tables: {
      inscricoes: {
        Row: InscricaoRow
        Insert: InscricaoInsert
        Update: Partial<InscricaoInsert>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      inscricoes_abertas: { Args: never; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
