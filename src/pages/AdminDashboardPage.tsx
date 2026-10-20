import type { Session } from '@supabase/supabase-js'
import { Download, Loader2, LogOut, RefreshCw, Search, ShieldAlert, Trash2, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Logo } from '@/components/Logo'
import { RequireAuth } from '@/components/RequireAuth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { opcoesCurso } from '@/data/inscricao'
import { usePageTitle } from '@/hooks/usePageTitle'
import { toCsv, downloadFile, type CsvColumn } from '@/lib/csv'
import type { InscricaoRow } from '@/lib/database.types'
import { formatDateTime, normalize } from '@/lib/format'
import { checkIsAdmin, deleteInscricao, fetchInscricoes } from '@/lib/inscricoes'
import { formatPhoneBR } from '@/lib/phone'
import { getSupabase } from '@/lib/supabase'

const TODOS = '__todos__'

const COLUNAS = [
  'Data',
  'Nome',
  'Telefone',
  'E-mail',
  'Escolaridade',
  'Ex-aluno',
  'Curso de interesse',
  'Como soube',
  'Chegada',
  'Consentimento',
  'Ações',
] as const

type Status = 'loading' | 'ready' | 'error' | 'forbidden'

const csvColumns: CsvColumn<InscricaoRow>[] = [
  { header: 'Data da inscrição', value: (r) => formatDateTime(r.created_at) },
  { header: 'Nome', value: (r) => r.nome },
  { header: 'Telefone', value: (r) => formatPhoneBR(r.telefone) },
  { header: 'E-mail', value: (r) => r.email },
  { header: 'Escolaridade', value: (r) => r.escolaridade },
  { header: 'Já foi aluno', value: (r) => (r.ex_aluno ? 'Sim' : 'Não') },
  { header: 'Curso de interesse', value: (r) => r.curso_interesse },
  { header: 'Como soube', value: (r) => r.como_soube },
  { header: 'Previsão de chegada', value: (r) => r.previsao_chegada },
  { header: 'Consentimento (LGPD)', value: (r) => (r.consentimento ? 'Sim' : 'Não') },
  { header: 'Consentimento em', value: (r) => (r.consentimento_em ? formatDateTime(r.consentimento_em) : '') },
]

/** Confirmação antes de apagar uma inscrição (pedido de exclusão). */
function ConfirmarExclusao({
  inscricao,
  onCancel,
  onConfirm,
}: {
  inscricao: InscricaoRow | null
  onCancel: () => void
  onConfirm: (inscricao: InscricaoRow) => Promise<void>
}) {
  const [apagando, setApagando] = useState(false)

  const confirmar = async () => {
    if (!inscricao) return
    setApagando(true)
    try {
      await onConfirm(inscricao)
    } finally {
      setApagando(false)
    }
  }

  return (
    <Dialog open={inscricao !== null} onOpenChange={(open) => !open && !apagando && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apagar inscrição?</DialogTitle>
          <DialogDescription>
            A inscrição de <strong className="text-brand-navy">{inscricao?.nome}</strong> ({inscricao?.email}) será
            apagada permanentemente. Use esta opção para atender pedidos de exclusão de dados. Não é possível desfazer.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={apagando}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => void confirmar()} disabled={apagando}>
            {apagando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Trash2 className="h-4 w-4" aria-hidden />}
            {apagando ? 'Apagando…' : 'Apagar inscrição'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatCard({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="rounded-card bg-white px-5 py-4 shadow-figma">
      <p className="text-sm font-medium text-brand-navy/70">{label}</p>
      <p className={`mt-1 font-display font-bold text-brand-navy ${small ? 'text-xl leading-tight' : 'text-3xl'}`}>{value}</p>
    </div>
  )
}

function Dashboard({ session }: { session: Session }) {
  usePageTitle('Painel de inscrições')
  const [status, setStatus] = useState<Status>('loading')
  const [rows, setRows] = useState<InscricaoRow[]>([])
  const [busca, setBusca] = useState('')
  const [curso, setCurso] = useState(TODOS)
  const [paraApagar, setParaApagar] = useState<InscricaoRow | null>(null)

  const apagar = async (inscricao: InscricaoRow) => {
    try {
      await deleteInscricao(inscricao.id)
      setRows((atual) => atual.filter((r) => r.id !== inscricao.id))
      setParaApagar(null)
      toast.success(`Inscrição de ${inscricao.nome} apagada.`)
    } catch (err) {
      console.error('[admin] apagar', err)
      toast.error('Não foi possível apagar a inscrição.', {
        description: err instanceof Error ? err.message : undefined,
      })
    }
  }

  const carregar = useCallback(async () => {
    setStatus('loading')
    try {
      if (!(await checkIsAdmin())) return setStatus('forbidden')
      setRows(await fetchInscricoes())
      setStatus('ready')
    } catch (err) {
      console.error('[admin]', err)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    // carregamento inicial dos dados (assíncrono, fora do ciclo de render)
    const id = setTimeout(() => void carregar(), 0)
    return () => clearTimeout(id)
  }, [carregar])

  const filtradas = useMemo(() => {
    const termo = normalize(busca.trim())
    const termoDigitos = busca.replace(/\D/g, '')
    return rows.filter((r) => {
      if (curso !== TODOS && r.curso_interesse !== curso) return false
      if (!termo) return true
      return (
        normalize(r.nome).includes(termo) ||
        r.email.includes(termo) ||
        (termoDigitos.length >= 3 && r.telefone.includes(termoDigitos))
      )
    })
  }, [rows, busca, curso])

  const exAlunos = useMemo(() => rows.filter((r) => r.ex_aluno).length, [rows])
  const cursoMaisProcurado = useMemo(() => {
    const contagem = new Map<string, number>()
    rows.forEach((r) => contagem.set(r.curso_interesse, (contagem.get(r.curso_interesse) ?? 0) + 1))
    return [...contagem.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  }, [rows])

  const exportar = () => {
    if (!filtradas.length) return toast.info('Nenhuma inscrição para exportar com os filtros atuais.')
    const hoje = new Date().toISOString().slice(0, 10)
    downloadFile(toCsv(filtradas, csvColumns), `inscricoes-feira-${hoje}.csv`)
    toast.success(`${filtradas.length} inscrição(ões) exportada(s).`)
  }

  const sair = async () => {
    await getSupabase().auth.signOut()
    toast.success('Você saiu do painel.')
  }

  return (
    <div className="min-h-dvh bg-grad-sky">
      <header className="sticky top-0 z-30 border-b border-brand-sky bg-white/95 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 rounded-md" aria-label="Voltar para o site">
            <Logo className="h-11" />
            <span className="hidden font-display text-lg font-bold text-brand-navy sm:inline">Painel administrativo</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[16rem] truncate text-sm text-brand-navy/70 md:inline" title={session.user.email}>
              {session.user.email}
            </span>
            <Button variant="outline" size="sm" onClick={() => void sair()}>
              <LogOut className="h-4 w-4" aria-hidden />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main id="conteudo" className="container py-8 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-brand-navy sm:text-4xl">
              Inscrições <span className="text-brand-blue">recebidas</span>
            </h1>
            <p className="mt-1 text-brand-navy/70">Acompanhe e exporte as inscrições da Feira das Profissões.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void carregar()} disabled={status === 'loading'}>
            <RefreshCw className={status === 'loading' ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden />
            Atualizar
          </Button>
        </div>

        {status === 'forbidden' ? (
          <div className="mt-10 flex flex-col items-center rounded-card bg-white px-6 py-14 text-center shadow-figma">
            <ShieldAlert className="h-12 w-12 text-brand-blue" aria-hidden />
            <h2 className="mt-4 text-xl font-bold text-brand-navy">Acesso não autorizado</h2>
            <p className="mt-2 max-w-md text-brand-navy/70">
              Sua conta entrou, mas não tem permissão de administrador. Peça para incluir seu usuário na tabela{' '}
              <code className="rounded bg-brand-sky px-1">admins</code> do Supabase.
            </p>
          </div>
        ) : (
          <>
            <section aria-label="Resumo" className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard label="Total de inscrições" value={status === 'ready' ? rows.length : '…'} />
              <StatCard label="Já foram alunos" value={status === 'ready' ? exAlunos : '…'} />
              <StatCard label="Curso mais procurado" value={status === 'ready' ? cursoMaisProcurado : '…'} small />
            </section>

            <section aria-labelledby="tabela-titulo" className="mt-8 rounded-card bg-white p-4 shadow-figma sm:p-6">
              <h2 id="tabela-titulo" className="sr-only">
                Lista de inscrições
              </h2>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-navy/50" aria-hidden />
                  <label htmlFor="busca" className="sr-only">
                    Buscar por nome, e-mail ou telefone
                  </label>
                  <Input
                    id="busca"
                    type="search"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por nome, e-mail ou telefone"
                    className="pl-9"
                  />
                </div>
                <div className="lg:w-80">
                  <Select value={curso} onValueChange={setCurso}>
                    <SelectTrigger aria-label="Filtrar por curso de interesse">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TODOS}>Todos os cursos</SelectItem>
                      {opcoesCurso.map((op) => (
                        <SelectItem key={op} value={op}>
                          {op}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={exportar} disabled={status !== 'ready'} className="h-10">
                  <Download className="h-4 w-4" aria-hidden />
                  Exportar CSV
                </Button>
              </div>

              <p className="mt-4 text-sm text-brand-navy/70" aria-live="polite">
                {status === 'ready' && `${filtradas.length} de ${rows.length} inscrição(ões)`}
              </p>

              <div className="mt-2 overflow-x-auto rounded-lg border border-brand-sky">
                <table className="w-full min-w-[72rem] border-collapse text-left text-sm">
                  <thead className="bg-brand-sky/60 text-brand-navy">
                    <tr>
                      {COLUNAS.map((h) => (
                        <th key={h} scope="col" className="whitespace-nowrap px-3 py-3 font-semibold">
                          {h === 'Ações' ? <span className="sr-only">Ações</span> : h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-sky">
                    {status === 'loading' &&
                      Array.from({ length: 5 }, (_, i) => (
                        <tr key={i}>
                          <td colSpan={COLUNAS.length} className="px-3 py-3">
                            <span className="block h-4 animate-pulse rounded bg-brand-sky/70" />
                          </td>
                        </tr>
                      ))}
                    {status === 'error' && (
                      <tr>
                        <td colSpan={COLUNAS.length} className="px-3 py-10 text-center text-destructive">
                          Não foi possível carregar as inscrições.{' '}
                          <button type="button" className="font-semibold underline" onClick={() => void carregar()}>
                            Tentar novamente
                          </button>
                        </td>
                      </tr>
                    )}
                    {status === 'ready' && filtradas.length === 0 && (
                      <tr>
                        <td colSpan={COLUNAS.length} className="px-3 py-12 text-center text-brand-navy/70">
                          <Users className="mx-auto mb-2 h-8 w-8 text-brand-blue/60" aria-hidden />
                          {rows.length === 0 ? 'Nenhuma inscrição recebida ainda.' : 'Nenhuma inscrição encontrada com esses filtros.'}
                        </td>
                      </tr>
                    )}
                    {status === 'ready' &&
                      filtradas.map((r) => (
                        <tr key={r.id} className="text-brand-ink transition-colors hover:bg-brand-sky/30">
                          <td className="whitespace-nowrap px-3 py-2.5 text-brand-navy/80">{formatDateTime(r.created_at)}</td>
                          <th scope="row" className="px-3 py-2.5 font-medium">
                            {r.nome}
                          </th>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <a href={`https://wa.me/55${r.telefone}`} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue hover:underline">
                              {formatPhoneBR(r.telefone)}
                            </a>
                          </td>
                          <td className="px-3 py-2.5">
                            <a href={`mailto:${r.email}`} className="hover:text-brand-blue hover:underline">
                              {r.email}
                            </a>
                          </td>
                          <td className="px-3 py-2.5">{r.escolaridade}</td>
                          <td className="px-3 py-2.5">{r.ex_aluno ? 'Sim' : 'Não'}</td>
                          <td className="px-3 py-2.5">{r.curso_interesse}</td>
                          <td className="px-3 py-2.5">{r.como_soube ?? '—'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">{r.previsao_chegada ?? '—'}</td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            {r.consentimento ? (
                              <span title={r.consentimento_em ? `Aceito em ${formatDateTime(r.consentimento_em)}` : undefined}>
                                Sim
                                {r.consentimento_em && (
                                  <span className="block text-xs text-brand-navy/60">{formatDateTime(r.consentimento_em)}</span>
                                )}
                              </span>
                            ) : (
                              <span className="text-brand-navy/60">Não</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => setParaApagar(r)}
                              aria-label={`Apagar inscrição de ${r.nome}`}
                              className="grid h-9 w-9 place-items-center rounded-full text-brand-navy/60 transition-colors hover:bg-red-50 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <ConfirmarExclusao inscricao={paraApagar} onCancel={() => setParaApagar(null)} onConfirm={apagar} />
    </div>
  )
}

export default function AdminDashboardPage() {
  return <RequireAuth>{(session) => <Dashboard session={session} />}</RequireAuth>
}
