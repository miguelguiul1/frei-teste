/**
 * Configuração única do evento.
 * Para mudar a data, o horário ou o local da feira, altere APENAS este arquivo:
 * todo o site (hero, programação, footer, horários do formulário) lê daqui.
 */

const EVENTO = {
  edicao: 6,
  nome: '6ª Feira das Profissões do Frei',
  /** Data no formato AAAA-MM-DD */
  data: '2026-09-19',
  /** Horário em horas cheias (24h) */
  horaInicio: 9,
  horaFim: 16,
  gratuito: true,
  local: {
    nome: 'Instituto Social Nossa Senhora de Fátima',
    logradouro: 'Av. Cel. Octaviano de Freitas Costa, 463',
    bairro: 'Veleiros',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '04773-000',
  },
} as const

const [ano, mes, dia] = EVENTO.data.split('-').map(Number)
const dataEvento = new Date(ano, mes - 1, dia)

const mesExtenso = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(dataEvento)
const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1)

const enderecoCompleto = `${EVENTO.local.nome}, ${EVENTO.local.logradouro} ${EVENTO.local.bairro} - ${EVENTO.local.cidade} - ${EVENTO.local.uf} ${EVENTO.local.cep}`
const enderecoBusca = `${EVENTO.local.nome}, ${EVENTO.local.logradouro}, ${EVENTO.local.cidade} - ${EVENTO.local.uf}, ${EVENTO.local.cep}`

export const evento = {
  ...EVENTO,
  dataObj: dataEvento,
  dia,
  /** "19 de Setembro" */
  diaMes: `${dia} de ${mesCapitalizado}`,
  /** "19 de Setembro de 2026" */
  dataExtenso: `${dia} de ${mesCapitalizado} de ${ano}`,
  /** "9h às 16h" */
  horario: `${EVENTO.horaInicio}h às ${EVENTO.horaFim}h`,
  ano,
  enderecoCompleto,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(enderecoBusca)}&output=embed`,
  mapsLinkUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoBusca)}`,
} as const

/** Faixas de chegada de hora em hora entre o início e o fim do evento ("9h às 10h", ...). */
export const faixasDeChegada = Array.from(
  { length: EVENTO.horaFim - EVENTO.horaInicio },
  (_, i) => `${EVENTO.horaInicio + i}h às ${EVENTO.horaInicio + i + 1}h`,
)
