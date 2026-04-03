import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { AuthShell } from '../components/layout/AuthShell'
import { FieldInput } from '../components/ui/FieldInput'
import { FormField } from '../components/ui/FormField'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { resetPassword } from '../features/auth/api'
import { resetPasswordSchema } from '../features/schemas'
import { useToast } from '../components/toast-provider'

type ResetPasswordFormValues = {
  newPassword: string
  confirmNewPassword: string
}

export function ResetPasswordPage() {
  const { pushToast } = useToast()
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams])
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      setServerError('O link de redefinição está inválido ou incompleto.')
      return
    }

    try {
      setServerError('')
      await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      })
      setIsSuccess(true)
      pushToast('Senha redefinida com sucesso.', 'success')
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível redefinir a senha.'
          : 'Não foi possível redefinir a senha.'
      setServerError(message)
      pushToast(message, 'error')
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto flex max-w-md flex-col gap-8 p-4">
        <header className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-emerald-700">Acesso</span>
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">Redefinir senha</h2>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
            Defina uma nova senha para voltar ao painel do CashFlow.
          </p>
        </header>

        {!token ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-700">
            O token de redefinição não foi encontrado na URL. Abra novamente o link enviado por e-mail.
          </div>
        ) : null}

        {isSuccess ? (
          <div className="grid gap-4">
            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
              Sua senha foi redefinida com sucesso. Você já pode entrar com a nova credencial.
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
              to="/login"
            >
              Ir para login
            </Link>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Nova senha" error={errors.newPassword?.message}>
              <FieldInput type="password" placeholder="Pelo menos 8 caracteres" {...register('newPassword')} />
            </FormField>

            <FormField label="Confirmar nova senha" error={errors.confirmNewPassword?.message}>
              <FieldInput type="password" placeholder="Repita a nova senha" {...register('confirmNewPassword')} />
            </FormField>

            {serverError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {serverError}
              </div>
            ) : null}

            <PrimaryButton type="submit" busy={isSubmitting || !token}>
              Redefinir senha
            </PrimaryButton>
          </form>
        )}

        <p className="text-sm text-slate-500 dark:text-slate-400">
          <Link className="cursor-pointer font-semibold text-emerald-700 transition hover:text-emerald-600" to="/login">
            Voltar para login
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
