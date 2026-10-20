import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { FormField } from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { evento } from '@/config/evento'
import { opcoesChegada, opcoesComoSoube, opcoesCurso, opcoesEscolaridade } from '@/data/inscricao'
import {
  inscricaoDefaults,
  inscricaoSchema,
  toInsert,
  type InscricaoFormInput,
  type InscricaoFormValues,
} from '@/lib/inscricaoSchema'
import { errorId } from '@/lib/a11y'
import { formatPhoneBR } from '@/lib/phone'
import { minutesUntilAllowed, registerAttempt } from '@/lib/rateLimit'
import { getSupabase, SupabaseNotConfiguredError } from '@/lib/supabase'

/** Tempo mínimo (ms) entre abrir a página e enviar: humanos levam bem mais que isso. */
const TEMPO_MINIMO_MS = 3000

const fieldA11y = (id: string, error?: string) => ({
  id,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': error ? errorId(id) : undefined,
})

/** Traduz o erro do envio para uma mensagem amigável. */
function mensagemDeErro(err: unknown) {
  if (err instanceof SupabaseNotConfiguredError) {
    return 'O sistema de inscrições ainda não foi configurado. Tente novamente mais tarde.'
  }
  // P0001 = limite antispam do banco (ver supabase/migrations)
  if (typeof err === 'object' && err && 'code' in err && err.code === 'P0001' && 'message' in err) {
    return String(err.message)
  }
  return 'Verifique sua conexão e tente novamente. Se o problema continuar, fale com a secretaria.'
}

type SelectFieldName = 'escolaridade' | 'curso_interesse' | 'como_soube' | 'previsao_chegada'

export function InscricaoForm() {
  const [enviado, setEnviado] = useState(false)
  const montadoEm = useRef(0)
  const sucessoRef = useRef<HTMLDivElement>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<InscricaoFormInput, unknown, InscricaoFormValues>({
    resolver: zodResolver(inscricaoSchema),
    defaultValues: inscricaoDefaults,
    mode: 'onTouched',
  })

  useEffect(() => {
    montadoEm.current = Date.now()
  }, [])

  useEffect(() => {
    if (enviado) sucessoRef.current?.focus()
  }, [enviado])

  const onSubmit = async (values: InscricaoFormValues) => {
    // honeypot preenchido ou envio instantâneo = robô: finge sucesso e não grava nada
    if (values.website || Date.now() - montadoEm.current < TEMPO_MINIMO_MS) {
      setEnviado(true)
      return
    }

    const espera = minutesUntilAllowed()
    if (espera > 0) {
      toast.error('Muitas tentativas seguidas', {
        description: `Aguarde ${espera} minuto${espera > 1 ? 's' : ''} e tente novamente.`,
      })
      return
    }
    registerAttempt()

    try {
      const { error } = await getSupabase().from('inscricoes').insert(toInsert(values))
      if (error) throw error
      setEnviado(true)
      toast.success('Inscrição enviada!', { description: `Esperamos você em ${evento.diaMes}.` })
    } catch (err) {
      console.error('[inscricao]', err)
      toast.error('Não foi possível enviar sua inscrição', { description: mensagemDeErro(err) })
    }
  }

  const novaInscricao = () => {
    reset(inscricaoDefaults)
    montadoEm.current = Date.now()
    setEnviado(false)
    requestAnimationFrame(() => setFocus('nome'))
  }

  if (enviado) {
    return (
      <div
        ref={sucessoRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center py-10 text-center outline-none animate-in fade-in zoom-in-95 duration-500"
      >
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-sky text-brand-navy">
          <CheckCircle2 className="h-11 w-11" aria-hidden />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-brand-navy">Inscrição confirmada!</h3>
        <p className="mt-3 max-w-xs text-base text-brand-ink/80">
          Obrigado! Te esperamos no dia <strong className="text-brand-navy">{evento.diaMes}</strong>, das{' '}
          {evento.horario}, no Instituto Social Nossa Senhora de Fátima.
        </p>
        <Button variant="outline" className="mt-8" onClick={novaInscricao}>
          Fazer outra inscrição
        </Button>
      </div>
    )
  }

  const renderSelect = (
    name: SelectFieldName,
    label: string,
    opcoes: readonly string[],
    { required = false, placeholder = 'Selecione' } = {},
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormField id={`f-${name}`} label={label} required={required} error={errors[name]?.message}>
          <Select value={field.value || undefined} onValueChange={field.onChange} name={field.name}>
            <SelectTrigger
              ref={field.ref}
              onBlur={field.onBlur}
              {...fieldA11y(`f-${name}`, errors[name]?.message)}
              aria-required={required || undefined}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {opcoes.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  )

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} noValidate className="space-y-5" aria-describedby="form-obrigatorios">
      <p id="form-obrigatorios" className="text-sm text-brand-ink/70">
        Campos com * são obrigatórios.
      </p>

      <FormField id="f-nome" label="Nome Completo" required error={errors.nome?.message}>
        <Input
          {...register('nome')}
          {...fieldA11y('f-nome', errors.nome?.message)}
          autoComplete="name"
          aria-required
        />
      </FormField>

      <Controller
        control={control}
        name="telefone"
        render={({ field }) => (
          <FormField id="f-telefone" label="Telefone" required error={errors.telefone?.message}>
            <Input
              {...field}
              {...fieldA11y('f-telefone', errors.telefone?.message)}
              onChange={(e) => field.onChange(formatPhoneBR(e.target.value))}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(11) 91234-5678"
              aria-required
            />
          </FormField>
        )}
      />

      <FormField id="f-email" label="E-mail" required error={errors.email?.message}>
        <Input
          {...register('email')}
          {...fieldA11y('f-email', errors.email?.message)}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nome@email.com"
          aria-required
        />
      </FormField>

      {renderSelect('escolaridade', 'Escolaridade', opcoesEscolaridade, { required: true })}

      <Controller
        control={control}
        name="ex_aluno"
        render={({ field }) => (
          <FormField id="f-ex_aluno" label="Já foi aluno do Frei?" required error={errors.ex_aluno?.message} asFieldset>
            <RadioGroup
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              className="flex gap-8"
              aria-invalid={errors.ex_aluno ? true : undefined}
              aria-describedby={errors.ex_aluno ? errorId('f-ex_aluno') : undefined}
              aria-required
            >
              {(
                [
                  ['sim', 'Sim'],
                  ['nao', 'Não'],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="flex cursor-pointer items-center gap-2 text-base text-brand-ink">
                  <RadioGroupItem value={value} />
                  {label}
                </label>
              ))}
            </RadioGroup>
          </FormField>
        )}
      />

      {renderSelect('curso_interesse', 'Interesse em algum dos cursos?', opcoesCurso, { required: true })}
      {renderSelect('como_soube', 'Como ficou sabendo da feira?', opcoesComoSoube)}
      {renderSelect('previsao_chegada', 'Previsão de chegada à feira', opcoesChegada, {
        placeholder: `Entre ${evento.horaInicio}h e ${evento.horaFim}h`,
      })}

      {/* Honeypot: invisível para pessoas e leitores de tela, atrativo para robôs */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="f-website">Não preencha este campo</label>
        <input id="f-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="flex justify-center pt-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[6.75rem] text-base">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : (
            'Enviar'
          )}
        </Button>
      </div>
    </form>
  )
}
