import { AlertCircle } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { errorId } from '@/lib/a11y'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  /** quando o controle não é um input nativo (radio), o rótulo vira legenda */
  asFieldset?: boolean
  className?: string
  labelClassName?: string
  children: React.ReactNode
}

/** Rótulo + controle + mensagem de erro com os atributos de acessibilidade corretos. */
export function FormField({
  id,
  label,
  required,
  error,
  asFieldset,
  className,
  labelClassName,
  children,
}: FormFieldProps) {
  const labelText = (
    <>
      {label}
      {required && (
        <>
          <span aria-hidden>*</span>
          <span className="sr-only"> (obrigatório)</span>
        </>
      )}
    </>
  )

  const message = error ? (
    <p id={errorId(id)} role="alert" className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {error}
    </p>
  ) : null

  if (asFieldset) {
    return (
      <fieldset className={cn('space-y-2', className)}>
        <legend className={cn('mb-2 text-base font-medium text-brand-ink', labelClassName)}>{labelText}</legend>
        {children}
        {message}
      </fieldset>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={labelClassName}>
        {labelText}
      </Label>
      {children}
      {message}
    </div>
  )
}
