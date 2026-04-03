import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { AuthShell } from '../components/layout/AuthShell'
import { FieldInput } from '../components/ui/FieldInput'
import { FormField } from '../components/ui/FormField'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { useToast } from '../components/toast-provider'
import { useAuth } from '../features/auth/auth-context'
import { loginSchema } from '../features/schemas'
import type { LoginPayload } from '../features/auth/types'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { pushToast } = useToast()
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(values: LoginPayload) {
    try {
      setServerError('')
      await login(values)
      pushToast('Login realizado com sucesso.', 'success')
      navigate('/app/dashboard')
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível entrar agora.'
          : 'Não foi possível entrar agora.'
      setServerError(message)
      pushToast(message, 'error')
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto flex max-w-md flex-col gap-8 p-4">
        <header className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-emerald-700">Entrar</span>
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Acesse seu painel operacional</h2>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Faça login para configurar a família, operar o mês financeiro e acompanhar o saldo livre em tempo real.
          </p>
        </header>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="E-mail" error={errors.email?.message}>
            <FieldInput type="email" placeholder="voce@exemplo.com" {...register('email')} />
          </FormField>

          <FormField label="Senha" error={errors.password?.message}>
            <FieldInput type="password" placeholder="Sua senha" {...register('password')} />
          </FormField>

          {serverError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </div>
          ) : null}

          <PrimaryButton type="submit" busy={isSubmitting}>
            Entrar
          </PrimaryButton>
        </form>

        <p className="-mt-3 text-sm text-slate-500 dark:text-slate-400">
          <Link className="cursor-pointer font-semibold text-amber-700 transition hover:text-amber-600" to="/forgot-password">
            Esqueci minha senha
          </Link>
        </p>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ainda não tem conta?{' '}
          <Link className="cursor-pointer font-semibold text-emerald-700 transition hover:text-emerald-600" to="/register">
            Criar conta
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
