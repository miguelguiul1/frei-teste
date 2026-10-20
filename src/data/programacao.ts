import type { IconType } from 'react-icons'
import { MdCarRepair, MdPalette, MdPerson, MdPrecisionManufacturing, MdTerminal } from 'react-icons/md'

export interface AtividadeSala {
  sala: string
  tema: string
}

export interface AreaProgramacao {
  id: string
  area: string
  icon: IconType
  salas: AtividadeSala[]
}

export const programacao: AreaProgramacao[] = [
  {
    id: 'informatica',
    area: 'Informática',
    icon: MdTerminal,
    salas: [
      { sala: 'Sala 25', tema: 'Cibersegurança, Redes e Infraestrutura' },
      { sala: 'Sala 26', tema: 'Desenvolvimento de Software e Banco de Dados' },
    ],
  },
  {
    id: 'administracao',
    area: 'Administração',
    icon: MdPerson,
    salas: [{ sala: 'Sala 27', tema: 'Logística, Legislação' }],
  },
  {
    id: 'comunicacao-visual',
    area: 'Comunicação Visual',
    icon: MdPalette,
    salas: [{ sala: 'Sala 24', tema: 'CorelDraw, Photoshop e Caricaturas' }],
  },
  {
    id: 'eletromecanica',
    area: 'Eletromecânica de Autos',
    icon: MdCarRepair,
    salas: [{ sala: 'Sala 3', tema: 'Estrutura de automóveis, engrenagens' }],
  },
  {
    id: 'robotica',
    area: 'Robótica',
    icon: MdPrecisionManufacturing,
    salas: [{ sala: 'Sala 2', tema: 'Sistemas elétricos de robótica' }],
  },
]
