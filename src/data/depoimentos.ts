export interface Depoimento {
  id: string
  nome: string
  /** Ex.: "Ex-aluno de Informática, 2006" */
  descricao: string
  texto: string[]
  foto: string
  /** Foto recortada (fundo transparente) que "sai" do card azul, como no Figma */
  fotoRecortada?: boolean
}

export const depoimentos: Depoimento[] = [
  {
    id: 'ricardo-hessel',
    nome: 'Ricardo Hessel de Araújo',
    descricao: 'Ex-aluno de Informática, 2006',
    foto: '/images/depoimentos/ricardo-hessel.webp',
    fotoRecortada: true,
    texto: [
      'Estudar aqui foi um divisor de águas na minha vida. A escola não só me deu base técnica, mas contribuiu diretamente para a formação do profissional e do cidadão que sou hoje. Foi aqui que tive meu primeiro direcionamento e minha primeira oportunidade no mercado de trabalho, que marcou o início da minha trajetória.',
      'Hoje, como Diretor Executivo no BTG Pactual, deixo o recado: tenham paciência, foquem no processo e estejam sempre abertos a aprender. O crescimento vem com o tempo e com a capacidade de se adaptar às oportunidades.',
    ],
  },
]

/** Link do botão "Mais Depoimentos" (perfil do Instituto, onde os depoimentos são publicados). */
export const maisDepoimentosUrl = 'https://www.instagram.com/institutonsfatima/'
