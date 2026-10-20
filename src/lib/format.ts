const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso))

/** Remove acentos e caixa para buscas tolerantes ("joao" encontra "João"). */
export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
