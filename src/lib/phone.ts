export const onlyDigits = (value: string) => value.replace(/\D/g, '')

/** Máscara de telefone BR: (11) 91234-5678 ou (11) 1234-5678. */
export function formatPhoneBR(value: string) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length < 3) return `(${d}`
  const ddd = d.slice(0, 2)
  const rest = d.slice(2)
  if (rest.length <= 4) return `(${ddd}) ${rest}`
  // 11 dígitos = celular (5+4); até 10 = fixo (4+4)
  const split = d.length === 11 ? 5 : 4
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`
}

export function isValidPhoneBR(value: string) {
  const d = onlyDigits(value)
  if (d.length !== 10 && d.length !== 11) return false
  if (Number(d.slice(0, 2)) < 11) return false
  // celulares têm 11 dígitos e começam com 9
  if (d.length === 11 && d[2] !== '9') return false
  return !/^(\d)\1+$/.test(d)
}
