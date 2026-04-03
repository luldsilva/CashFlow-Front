import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { AuthShell } from '../components/layout/AuthShell'
import { FieldInput } from '../components/ui/FieldInput'
import { FormField } from '../components/ui/FormField'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { forgotPassword } from '../features/auth/api'
import { forgotPasswordSchema } from '../features/schemas'
import { useToast } from '../components/toast-provider'
import type { ForgotPasswordPayload } from '../features/auth/api'

export function ForgotPasswordPage() {
  const { pushToast } = useToast()
  const [serverError, setServerError] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(values: ForgotPasswordPayload) {
    try {
      setServerError('')
      await forgotPassword(values)
      setSubmittedEmail(values.email)
      pushToast('Se o e-mail estiver cadastrado, o link de redefinição será enviado.', 'success')
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível solicitar a redefinição agora.'
          : 'Não foi possível solicitar a redefinição agora.'
      setServerError(message)
      pushToast(message, 'error')
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto flex max-w-md flex-col gap-8 p-4">
        <header className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-amber-600">Acesso</span>
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Esqueceu sua senha?</h2>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </header>

        {submittedEmail ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            Se o e-mail <strong>{submittedEmail}</strong> estiver cadastrado, você receberá um link para redefinir sua senha.
          </div>
        ) : null}

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="E-mail" error={errors.email?.message}>
            <FieldInput type="email" placeholder="voce@exemplo.com" {...register('email')} />
          </FormField>

          {serverError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </div>
          ) : null}

          <PrimaryButton type="submit" busy={isSubmitting}>
            Enviar link de redefinição
          </PrimaryButton>
        </form>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lembrou a senha?{' '}
          <Link className="cursor-pointer font-semibold text-emerald-700 transition hover:text-emerald-600" to="/login">
            Voltar para login
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
