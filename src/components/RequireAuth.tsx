import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import type { Session } from '@supabase/supabase-js'

export function FullPageSpinner({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-mist" role="status">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-sky border-t-brand-navy" />
        <span className="text-sm font-medium text-brand-navy">{label}</span>
      </div>
    </div>
  )
}

/** Protege rotas: sem sessão, redireciona para o login guardando o destino. */
export function RequireAuth({ children }: { children: (session: Session) => React.ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageSpinner label="Verificando acesso…" />
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <>{children(session)}</>
}
