import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { FullPageSpinner } from '@/components/RequireAuth'
import { Navbar } from '@/components/Navbar'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { errorId } from '@/lib/a11y'
import { getSupabase, SupabaseNotConfiguredError } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { HeroSection } from '@/sections/HeroSection'

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu e-mail.').pipe(z.email('Informe um e-mail válido.')),
  senha: z.string().min(1, 'Informe sua senha.'),
})
type LoginValues = z.infer<typeof loginSchema>

function traduzErro(err: unknown) {
  if (err instanceof SupabaseNotConfiguredError) return 'O Supabase ainda não foi configurado neste ambiente.'
  const message = err instanceof Error ? err.message : ''
  if (/invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.'
  if (/email not confirmed/i.test(message)) return 'Confirme seu e-mail antes de entrar.'
  if (/rate limit|too many/i.test(message)) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  return 'Não foi possível entrar. Verifique sua conexão e tente novamente.'
}

/** Campo com linha inferior, como no Figma (sobre o vidro). */
const GlassField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string }
>(function GlassField({ id, label, error, ...props }, ref) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        placeholder={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId(id) : undefined}
        className={cn(
          'w-full border-0 border-b-[3px] border-white bg-transparent px-0 pb-2 pt-1 text-lg tracking-wide text-white transition-colors placeholder:text-white/90 focus:border-brand-navy focus:outline-none focus-visible:ring-0 sm:text-[1.375rem]',
          error && 'border-[#ffd2d2]',
        )}
        {...props}
      />
      {error && (
        <p id={errorId(id)} role="alert" className="mt-2 text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(4,42,126,0.6)]">
          {error}
        </p>
      )}
    </div>
  )
})

export default function AdminLoginPage() {
  usePageTitle('Login administrativo')
  const { session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState<string | null>(null)
  const destino = (location.state as { from?: string } | null)?.from ?? '/admin'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', senha: '' } })

  if (loading) return <FullPageSpinner />
  if (session) return <Navigate to={destino} replace />

  const onSubmit = async ({ email, senha }: LoginValues) => {
    setErro(null)
    try {
      const { error } = await getSupabase().auth.signInWithPassword({ email, password: senha })
      if (error) throw error
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(traduzErro(err))
    }
  }

  return (
    <>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="relative pt-[4.5rem] outline-none lg:pt-[5.5rem]">
        {/* fundo: o próprio hero da landing, apenas decorativo */}
        <div aria-hidden {...{ inert: '' }} className="pointer-events-none select-none">
          <HeroSection />
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[4.5rem] grid place-items-center px-4 py-10 lg:top-[5.5rem]">
          <section
            aria-labelledby="login-titulo"
            className="relative w-full max-w-[56rem] overflow-hidden rounded-xl border border-white/40 shadow-[0_8px_32px_rgba(4,42,126,0.25)] animate-in fade-in zoom-in-95 duration-500"
          >
            {/* vidro: desfoque + véu azul com manchas de luz, como no Figma */}
            <div aria-hidden className="absolute inset-0 bg-[#4C6FC2]/70 backdrop-blur-2xl" />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(60%_50%_at_25%_25%,rgba(72,112,204,0.45),transparent_70%),radial-gradient(50%_60%_at_85%_80%,rgba(44,94,201,0.45),transparent_70%)]"
            />

            <div className="relative px-6 py-12 sm:px-16 lg:px-[13rem] lg:py-[4.5rem]">
              <h1
                id="login-titulo"
                className="text-center font-display text-3xl font-bold text-white [text-shadow:0_2px_8px_rgba(4,42,126,0.35)] sm:text-[2.25rem]"
              >
                Administrativo
              </h1>

              <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="mt-12 space-y-10 lg:mt-16">
                <GlassField
                  id="login-email"
                  label="Seu e-mail de acesso"
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <GlassField
                  id="login-senha"
                  label="Digite sua senha"
                  type="password"
                  autoComplete="current-password"
                  error={errors.senha?.message}
                  {...register('senha')}
                />

                {erro && (
                  <p role="alert" className="rounded-btn bg-white/90 px-4 py-3 text-center text-sm font-semibold text-destructive">
                    {erro}
                  </p>
                )}

                <div className="flex flex-col items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-[3.75rem] min-w-[11.6rem] items-center justify-center gap-2 rounded-md bg-white px-6 text-[1.375rem] font-semibold text-[#7F8FBD] shadow-figma transition-all duration-200 ease-out-soft hover:-translate-y-0.5 hover:text-brand-navy hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue disabled:opacity-70"
                  >
                    {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
                    {isSubmitting ? 'Entrando…' : 'Fazer Login'}
                  </button>
                  <Link
                    to="/"
                    className="rounded-md px-2 py-1 text-[1.375rem] text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Voltar
                  </Link>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
