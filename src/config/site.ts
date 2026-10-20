export const site = {
  nome: 'Instituto Social Nossa Senhora de Fátima',
  nomeCurto: 'Instituto NSF',
  fundacao: 1971,
  instagram: {
    usuario: 'institutonsfatima',
    url: 'https://www.instagram.com/institutonsfatima/',
  },
  telefones: [
    { numero: '(11) 96398-6252', descricao: 'secretaria - whatsapp', href: 'https://wa.me/5511963986252' },
    { numero: '(11) 3798-5037', descricao: 'secretaria', href: 'tel:+551137985037' },
  ],
} as const

/** Anos de história contados a partir da fundação (55 em 2026). */
export const anosDeHistoria = new Date().getFullYear() - site.fundacao
