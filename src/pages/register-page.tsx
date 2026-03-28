import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { AuthShell } from '../components/auth-shell'
import { FieldInput } from '../components/field-input'
import { FormField } from '../components/form-field'
import { PrimaryButton } from '../components/primary-button'
import { useToast } from '../components/toast-provider'
import { useAuth } from '../features/auth/auth-context'
import { registerSchema } from '../features/schemas'
import type { RegisterPayload } from '../features/auth/types'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { pushToast } = useToast()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(values: RegisterPayload) {
    try {
      setServerError('')
      await registerUser(values)
      pushToast('Conta criada com sucesso.', 'success')
      navigate('/app')
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível criar sua conta agora.'
          : 'Não foi possível criar sua conta agora.'
      setServerError(message)
      pushToast(message, 'error')
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto flex max-w-md flex-col gap-8 p-4">
        <header className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-amber-600">Cadastro</span>
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Crie sua conta no CashFlow</h2>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Comece com um espaço pessoal simples e mantenha todos os registros financeiros em um só lugar.
          </p>
        </header>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Nome" error={errors.name?.message}>
            <FieldInput placeholder="Seu nome completo" {...register('name')} />
          </FormField>

          <FormField label="E-mail" error={errors.email?.message}>
            <FieldInput type="email" placeholder="voce@exemplo.com" {...register('email')} />
          </FormField>

          <FormField label="Senha" error={errors.password?.message}>
            <FieldInput type="password" placeholder="Pelo menos 8 caracteres" {...register('password')} />
          </FormField>

          {serverError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </div>
          ) : null}

          <PrimaryButton type="submit" busy={isSubmitting}>
            Criar conta
          </PrimaryButton>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Já tem cadastro?{' '}
          <Link className="cursor-pointer font-semibold text-emerald-700 transition hover:text-emerald-600" to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
