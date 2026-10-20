import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/database.types'

const url = import.meta.env.VITE_SUPABASE_URL
// Somente a chave pública (anon). A service role key NUNCA deve ir para o front-end.
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY não definidos. Copie .env.example para .env e preencha.',
  )
}

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'feira-frei-auth' },
    })
  : null

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('O Supabase não está configurado (variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
  }
}

export function getSupabase(): SupabaseClient<Database> {
  if (!supabase) throw new SupabaseNotConfiguredError()
  return supabase
}
