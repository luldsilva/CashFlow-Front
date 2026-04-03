import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { ShieldCheck } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { PanelCard } from '../components/ui/PanelCard'
import { FieldInput } from '../components/ui/FieldInput'
import { FormField } from '../components/ui/FormField'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { changePassword } from '../features/auth/api'
import type { ChangePasswordPayload } from '../features/auth/api'
import { changePasswordSchema } from '../features/schemas'
import { useToast } from '../components/toast-provider'

export function SecuritySettingsPage() {
  const { pushToast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordPayload>({
    resolver: zodResolver(changePasswordSchema),
  })
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      })
      pushToast('Senha alterada com sucesso.', 'success')
    },
  })

  async function onSubmit(values: ChangePasswordPayload) {
    try {
      await changePasswordMutation.mutateAsync(values)
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível alterar a senha.'
          : 'Não foi possível alterar a senha.'

      if (message.toLowerCase().includes('current') || message.toLowerCase().includes('atual')) {
        setError('currentPassword', {
          message: 'A senha atual informada não confere.',
        })
      }

      pushToast(message, 'error')
    }
  }

  return (
    <div className="grid gap-6">
      <PanelCard tone="sky">
        <span className="inline-flex rounded-full border border-sky-300 bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100">
          Segurança
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Alterar senha</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Esta área permite trocar a senha dentro do contexto autenticado, sem depender do fluxo por e-mail.
        </p>
      </PanelCard>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard tone="emerald">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-emerald-700 dark:text-emerald-200" />
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Credencial de acesso</h3>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/60 bg-white/70 p-5 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
            Use esta tela para:
            <br />
            validar sua senha atual
            <br />
            definir uma nova senha
            <br />
            confirmar a alteração imediatamente no backend
          </div>
        </PanelCard>

        <PanelCard tone="amber">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Salvar nova senha</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            O backend valida a senha atual antes de aceitar a troca.
          </p>

          <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Senha atual" error={errors.currentPassword?.message}>
              <FieldInput type="password" placeholder="Sua senha atual" {...register('currentPassword')} />
            </FormField>

            <FormField label="Nova senha" error={errors.newPassword?.message}>
              <FieldInput type="password" placeholder="Pelo menos 8 caracteres" {...register('newPassword')} />
            </FormField>

            <FormField label="Confirmar nova senha" error={errors.confirmNewPassword?.message}>
              <FieldInput type="password" placeholder="Repita a nova senha" {...register('confirmNewPassword')} />
            </FormField>

            <PrimaryButton busy={isSubmitting || changePasswordMutation.isPending} type="submit">
              Salvar nova senha
            </PrimaryButton>
          </form>
        </PanelCard>
      </section>
    </div>
  )
}
