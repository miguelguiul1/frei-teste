/**
 * Textos de SEO (title, description, Open Graph) derivados do evento.
 * Usado no index.html (injetado no build pelo vite.config.ts) e no título das páginas.
 * Importa só caminhos relativos para poder ser lido também pelo vite.config.ts.
 */
import { evento, eventoEncerrado } from './evento'

const local = `${evento.local.nome} (${evento.local.bairro}, ${evento.local.cidade})`

export const seo = eventoEncerrado
  ? {
      title: `${evento.nome} | Evento realizado em ${evento.dataCurta}`,
      description: `A ${evento.nome} foi realizada em ${evento.dataExtenso}, no ${local}. Veja como foi, os depoimentos de ex-alunos e conheça os cursos do Instituto.`,
      ogTitle: `${evento.nome}: obrigado a todos que participaram!`,
      ogDescription: `Evento realizado em ${evento.dataExtenso}, das ${evento.horario}. Veja as fotos, os depoimentos e conheça os cursos do Instituto Social Nossa Senhora de Fátima.`,
    }
  : {
      title: `${evento.nome} | ${evento.diaMes}, ${evento.horario}`,
      description: `Participe da ${evento.nome}: ${evento.dataExtenso}, das ${evento.horario}, no ${local}. Evento gratuito com cursos, palestras e visitação. Descubra hoje a profissão do seu amanhã!`,
      ogTitle: evento.nome,
      ogDescription: `${evento.dataExtenso}, das ${evento.horario}. Evento gratuito no Instituto Social Nossa Senhora de Fátima. Conheça os cursos, converse com especialistas e descubra hoje a profissão do seu amanhã!`,
    }
