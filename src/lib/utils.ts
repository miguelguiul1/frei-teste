import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// ensina o tailwind-merge que os tamanhos de fonte do tema são tamanhos (e não cores),
// senão `text-title` seria descartado ao lado de `text-brand-navy`
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'title', 'title-sm', 'subtitle', 'lead', 'body-lg', 'body'] }],
      shadow: [{ shadow: ['figma', 'card', 'card-hover'] }],
      rounded: [{ rounded: ['btn', 'card', 'card-lg', 'icon'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
