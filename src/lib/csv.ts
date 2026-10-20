/**
 * Gera CSV compatível com o Excel em português (separador ";" e BOM UTF-8)
 * e protegido contra "CSV injection" (células iniciadas por = + - @).
 */
export interface CsvColumn<T> {
  header: string
  value: (row: T) => string | number | boolean | null | undefined
}

function escapeCell(raw: string | number | boolean | null | undefined) {
  let value = raw === null || raw === undefined ? '' : String(raw)
  if (/^[=+\-@\t\r]/.test(value)) value = `'${value}`
  if (/[";\n\r]/.test(value)) value = `"${value.replace(/"/g, '""')}"`
  return value
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]) {
  const header = columns.map((c) => escapeCell(c.header)).join(';')
  const body = rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(';'))
  return '﻿' + [header, ...body].join('\r\n')
}

export function downloadFile(content: string, filename: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
