import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { CheckCircle2 } from 'lucide-react'
import { PanelCard } from '../components/ui/PanelCard'
import { FieldInput } from '../components/ui/FieldInput'
import { FieldTextarea } from '../components/ui/FieldTextarea'
import { FormField } from '../components/ui/FormField'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { closeMonthlyReview, getMonthlyReview } from '../features/financial/api'
import { formatCurrency, formatDateTime, monthInputFromDate, normalizeMonth } from '../features/financial/utils'
import { useToast } from '../components/toast-provider'

type ReviewFormValues = {
  competenceDate: string
  notes: string
}

export function MonthlyReviewPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const month = monthInputFromDate()
  const reviewQuery = useQuery({
    queryKey: ['monthly-review', month],
    queryFn: () => getMonthlyReview(normalizeMonth(month)),
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ReviewFormValues>({
    defaultValues: {
      competenceDate: normalizeMonth(month),
      notes: '',
    },
  })
  const closeMutation = useMutation({
    mutationFn: closeMonthlyReview,
    onSuccess: async () => {
      pushToast('Mês fechado com sucesso.', 'success')
      await queryClient.invalidateQueries({ queryKey: ['monthly-review', month] })
    },
  })

  useEffect(() => {
    reset({
      competenceDate: reviewQuery.data?.competenceDate ?? normalizeMonth(month),
      notes: reviewQuery.data?.closure?.notes ?? '',
    })
  }, [month, reset, reviewQuery.data])

  async function onSubmit(values: ReviewFormValues) {
    try {
      await closeMutation.mutateAsync(values)
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível fechar o mês.'
          : 'Não foi possível fechar o mês.'
      pushToast(message, 'error')
    }
  }

  return (
    <div className="grid gap-6">
      <PanelCard tone="amber">
        <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
          Fase 1E
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Fechamento e revisão mensal</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          O backend já persiste o snapshot do mês e devolve a revisão consolidada. O front trata o ciclo aberto e o
          ciclo fechado na mesma tela.
        </p>
      </PanelCard>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PanelCard tone="sky">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Resumo do mês</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                A estrutura de `summary` reaproveita a leitura do dashboard mensal.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/60 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Competência</p>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{month}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-sm text-slate-500 dark:text-slate-400">Entrada prevista</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {formatCurrency(reviewQuery.data?.summary?.plannedIncome ?? 0)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-sm text-slate-500 dark:text-slate-400">Saída paga</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {formatCurrency(reviewQuery.data?.summary?.paidOutflow ?? 0)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-sm text-slate-500 dark:text-slate-400">Comprometido</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {formatCurrency(reviewQuery.data?.summary?.committedOutflow ?? 0)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <p className="text-sm text-slate-500 dark:text-slate-400">Livre para investir</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {formatCurrency(reviewQuery.data?.summary?.freeToInvest ?? 0)}
              </p>
            </div>
          </div>
        </PanelCard>

        <PanelCard tone="emerald">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
            {reviewQuery.data?.closure ? 'Mês fechado' : 'Fechar mês'}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Se `closure` vier nulo, o ciclo ainda está aberto. Se vier preenchido, a tela entra em modo revisão.
          </p>

          {reviewQuery.data?.closure ? (
            <div className="mt-5 grid gap-4">
              <div className="flex items-center gap-3 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                <CheckCircle2 size={18} />
                Fechado em {formatDateTime(reviewQuery.data.closure.closedAt)}
              </div>

              <div className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Observações salvas</p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {reviewQuery.data.closure.notes || 'Nenhuma observação registrada para este fechamento.'}
                </p>
              </div>
            </div>
          ) : (
            <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <FormField label="Competência">
                <FieldInput type="date" {...register('competenceDate')} />
              </FormField>

              <FormField label="Observações do ciclo">
                <FieldTextarea
                  placeholder="O que saiu do previsto, o que ficou comprometido e o que precisa ajustar no próximo mês"
                  {...register('notes')}
                />
              </FormField>

              <PrimaryButton busy={isSubmitting || closeMutation.isPending} type="submit">
                Confirmar fechamento
              </PrimaryButton>
            </form>
          )}
        </PanelCard>
      </section>
    </div>
  )
}
