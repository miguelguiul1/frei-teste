import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[transform,box-shadow,background-color,color] duration-200 ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // botão azul-marinho com sombra do Figma
        primary:
          'bg-brand-navy text-white shadow-figma hover:-translate-y-0.5 hover:bg-[#06338f] hover:shadow-card-hover',
        // botão branco com texto navy (ex.: "Programação" no hero)
        light: 'bg-white text-brand-navy shadow-figma hover:-translate-y-0.5 hover:shadow-card-hover',
        // botão branco com texto azul (ex.: "Lista completa")
        'light-accent':
          'bg-white text-brand-blue shadow-figma hover:-translate-y-0.5 hover:text-brand-navy hover:shadow-card-hover',
        ghost: 'text-brand-navy hover:bg-brand-sky/60',
        outline: 'border border-brand-navy/30 bg-white text-brand-navy hover:border-brand-navy hover:bg-brand-sky/40',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-brand-blue underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 rounded-btn px-4 text-sm',
        md: 'h-11 rounded-btn px-6 text-base',
        lg: 'h-14 rounded-btn px-6 text-lg sm:text-[1.375rem]',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
