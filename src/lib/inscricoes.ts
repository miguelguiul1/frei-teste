import type { InscricaoRow } from '@/lib/database.types'
import { getSupabase } from '@/lib/supabase'

const PAGE = 1000 // limite padrão de linhas por requisição da API do Supabase

/** Busca todas as inscrições (em páginas de 1000), das mais recentes para as mais antigas. */
export async function fetchInscricoes(): Promise<InscricaoRow[]> {
  const supabase = getSupabase()
  const all: InscricaoRow[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('inscricoes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE - 1)
    if (error) throw error
    all.push(...data)
    if (data.length < PAGE) return all
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await getSupabase().rpc('is_admin')
  if (error) throw error
  return Boolean(data)
}
