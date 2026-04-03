import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react'
import { PanelCard } from '../components/ui/PanelCard'
import { FormField } from '../components/ui/FormField'
import { FieldInput } from '../components/ui/FieldInput'
import { FieldSelect } from '../components/ui/FieldSelect'
import { FieldTextarea } from '../components/ui/FieldTextarea'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import {
  createFinancialObligation,
  deleteFinancialObligation,
  getFinancialSetup,
  listFinancialObligations,
  updateFinancialObligation,
} from '../features/financial/api'
import type {
  FinancialObligation,
  FinancialObligationPayload,
  FinancialObligationRecurrenceType,
  FinancialObligationStatus,
} from '../features/financial/types'
import { dateInputFromDate, formatCurrency, formatShortDate, monthInputFromDate, normalizeMonth } from '../features/financial/utils'
import { useToast } from '../components/toast-provider'

const statusOptions: FinancialObligationStatus[] = ['Expected', 'Paid', 'Adjusted']
const recurrenceOptions: FinancialObligationRecurrenceType[] = ['OneTime', 'FixedMonthly', 'VariableMonthly']

function createDefaultValues(month: string): FinancialObligationPayload {
  return {
    title: '',
    description: '',
    categoryName: '',
    bucketCode: '',
    amount: 0,
    paidAmount: 0,
    competenceDate: normalizeMonth(month),
    dueDate: normalizeMonth(month),
    paidDate: null,
    recurrenceType: 'OneTime',
    status: 'Expected',
  }
}

export function ObligationsPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const month = monthInputFromDate()
  const [editingObligation, setEditingObligation] = useState<FinancialObligation | null>(null)
  const setupQuery = useQuery({
    queryKey: ['financial-setup'],
    queryFn: getFinancialSetup,
  })
  const obligationsQuery = useQuery({
    queryKey: ['financial-obligations', month],
    queryFn: () => listFinancialObligations(normalizeMonth(month)),
  })
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FinancialObligationPayload>({
    defaultValues: createDefaultValues(month),
  })
  const createMutation = useMutation({
    mutationFn: createFinancialObligation,
    onSuccess: async () => {
      pushToast('Obrigação financeira criada com sucesso.', 'success')
      reset(createDefaultValues(month))
      await queryClient.invalidateQueries({ queryKey: ['financial-obligations', month] })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FinancialObligationPayload }) =>
      updateFinancialObligation(id, payload),
    onSuccess: async () => {
      pushToast('Obrigação atualizada com sucesso.', 'success')
      setEditingObligation(null)
      reset(createDefaultValues(month))
      await queryClient.invalidateQueries({ queryKey: ['financial-obligations', month] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteFinancialObligation,
    onSuccess: async () => {
      pushToast('Obrigação removida com sucesso.', 'success')
      setEditingObligation(null)
      reset(createDefaultValues(month))
      await queryClient.invalidateQueries({ queryKey: ['financial-obligations', month] })
    },
  })

  useEffect(() => {
    if (!editingObligation) {
      reset(createDefaultValues(month))
      return
    }

    reset({
      ...editingObligation,
      description: editingObligation.description ?? '',
      paidDate: editingObligation.paidDate,
    })
  }, [editingObligation, month, reset])

  const selectedStatus = watch('status')
  const bucketOptions = setupQuery.data?.planningBuckets.filter((bucket) => bucket.isActive) ?? []
  const categoryOptions = setupQuery.data?.expenseCategories ?? []
  const totals = useMemo(
    () => ({
      total: obligationsQuery.data?.reduce((sum, item) => sum + item.amount, 0) ?? 0,
      paid: obligationsQuery.data?.reduce((sum, item) => sum + item.paidAmount, 0) ?? 0,
    }),
    [obligationsQuery.data],
  )

  async function onSubmit(values: FinancialObligationPayload) {
    try {
      const payload = {
        ...values,
        description: values.description || null,
        paidDate: values.status === 'Paid' ? values.paidDate || dateInputFromDate() : null,
        paidAmount: values.status === 'Paid' ? Number(values.paidAmount || values.amount) : Number(values.paidAmount || 0),
      }

      if (editingObligation) {
        await updateMutation.mutateAsync({ id: editingObligation.id, payload })
        return
      }

      await createMutation.mutateAsync(payload)
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível salvar a obrigação.'
          : 'Não foi possível salvar a obrigação.'
      pushToast(message, 'error')
    }
  }

  return (
    <div className="grid gap-6">
      <PanelCard tone="amber">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
              Fase 1B
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Motor de compromissos do mês</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Esta área operacionaliza o ciclo mensal real: vencimentos, recorrência, competência e status de previsto,
              pago ou ajustado.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/60 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Competência</p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{month}</p>
          </div>
        </div>
      </PanelCard>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <section className="grid gap-4 md:grid-cols-2">
            <PanelCard tone="emerald">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total previsto</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{formatCurrency(totals.total)}</p>
            </PanelCard>
            <PanelCard tone="sky">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total pago</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{formatCurrency(totals.paid)}</p>
            </PanelCard>
          </section>

          <PanelCard tone="sky">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Lista mensal de obrigações</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  A leitura favorece operação por vencimento, status e valor.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {obligationsQuery.data?.length ? (
                obligationsQuery.data.map((item) => {
                  const isOverdue = item.status !== 'Paid' && new Date(item.dueDate) < new Date()

                  return (
                    <article
                      key={item.id}
                      className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.categoryName} • {item.bucketCode} • {item.recurrenceType}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            {item.status}
                          </span>
                          {isOverdue ? (
                            <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                              Atrasada
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-300">
                        <span>Vence em {formatShortDate(item.dueDate)}</span>
                        <span>{formatCurrency(item.amount)}</span>
                        {item.paidAmount > 0 ? <span>Pago: {formatCurrency(item.paidAmount)}</span> : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                          onClick={() => setEditingObligation(item)}
                          type="button"
                        >
                          <Pencil size={15} />
                          Editar
                        </button>
                        <button
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
                          onClick={() => deleteMutation.mutate(item.id)}
                          type="button"
                        >
                          <Trash2 size={15} />
                          Excluir
                        </button>
                      </div>
                    </article>
                  )
                })
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
                  Nenhuma obrigação cadastrada para este mês. O backend prevê `204` para competência sem dados.
                </div>
              )}
            </div>
          </PanelCard>
        </div>

        <PanelCard tone="amber">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                {editingObligation ? 'Editar obrigação' : 'Nova obrigação'}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                O CTA de marcar como pago é tratado via edição de status, valor pago e data efetiva.
              </p>
            </div>
            <button
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              onClick={() => setEditingObligation(null)}
              type="button"
            >
              <Plus size={16} />
              Novo
            </button>
          </div>

          <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Título">
              <FieldInput {...register('title')} />
            </FormField>

            <FormField label="Descrição">
              <FieldTextarea placeholder="Conta fixa, assinatura ou compromisso variável" {...register('description')} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Categoria">
                <FieldSelect {...register('categoryName')}>
                  <option value="">Selecione</option>
                  {categoryOptions.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <FormField label="Bucket">
                <FieldSelect {...register('bucketCode')}>
                  <option value="">Selecione</option>
                  {bucketOptions.map((bucket) => (
                    <option key={bucket.code} value={bucket.code}>
                      {bucket.name}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <FormField label="Valor previsto">
                <FieldInput min={0} step="0.01" type="number" {...register('amount', { valueAsNumber: true })} />
              </FormField>

              <FormField label="Status">
                <FieldSelect {...register('status')}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <FormField label="Competência">
                <FieldInput type="date" {...register('competenceDate')} />
              </FormField>

              <FormField label="Vencimento">
                <FieldInput type="date" {...register('dueDate')} />
              </FormField>

              <FormField label="Recorrência">
                <FieldSelect {...register('recurrenceType')}>
                  {recurrenceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <FormField label="Valor pago">
                <FieldInput min={0} step="0.01" type="number" {...register('paidAmount', { valueAsNumber: true })} />
              </FormField>
            </div>

            {selectedStatus === 'Paid' ? (
              <FormField label="Data de pagamento">
                <FieldInput type="date" {...register('paidDate')} />
              </FormField>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                <CalendarClock size={15} />
                Trilha operacional do mês atual
              </div>

              <PrimaryButton busy={isSubmitting || createMutation.isPending || updateMutation.isPending} type="submit">
                {editingObligation ? 'Salvar ajustes' : 'Cadastrar obrigação'}
              </PrimaryButton>
            </div>
          </form>
        </PanelCard>
      </section>
    </div>
  )
}
