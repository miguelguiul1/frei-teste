/**
 * Limite simples de tentativas no navegador (proteção básica contra spam).
 * Não substitui proteção no servidor, mas evita envios repetidos e cliques acidentais.
 */
const STORAGE_KEY = 'feira-frei:inscricao-tentativas'
const MAX_TENTATIVAS = 3
const JANELA_MS = 10 * 60 * 1000 // 10 minutos

function read(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(list) ? list.filter((t): t is number => typeof t === 'number') : []
  } catch {
    return []
  }
}

function recent(now = Date.now()) {
  return read().filter((t) => now - t < JANELA_MS)
}

/** Retorna em quantos minutos o usuário pode tentar de novo (0 = liberado). */
export function minutesUntilAllowed(now = Date.now()) {
  const list = recent(now)
  if (list.length < MAX_TENTATIVAS) return 0
  const oldest = Math.min(...list)
  return Math.max(1, Math.ceil((JANELA_MS - (now - oldest)) / 60000))
}

export function registerAttempt(now = Date.now()) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...recent(now), now]))
  } catch {
    /* modo privado sem storage: ignora */
  }
}
