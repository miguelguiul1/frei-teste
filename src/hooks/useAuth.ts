import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

interface AuthState {
  session: Session | null
  /** true enquanto a sessão salva ainda está sendo lida */
  loading: boolean
}

/** Sessão atual do Supabase Auth, atualizada a cada login/logout. */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ session: null, loading: Boolean(supabase) })

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) setState({ session: data.session, loading: false })
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setState({ session, loading: false })
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  return state
}
