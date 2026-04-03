import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { AxiosError } from 'axios'
import { PanelCard } from '../components/ui/PanelCard'
import { FormField } from '../components/ui/FormField'
import { FieldInput } from '../components/ui/FieldInput'
import { FieldSelect } from '../components/ui/FieldSelect'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { getFinancialSetup, updateFinancialSetup } from '../features/financial/api'
import type {
  FinancialSetup,
  HouseholdIncomeFrequency,
  IncomeSourceType,
  PlanningModel,
} from '../features/financial/types'
import { useToast } from '../components/toast-provider'

const frequencyOptions: HouseholdIncomeFrequency[] = ['Monthly', 'Biweekly', 'Weekly', 'Variable']
const planningModelOptions: PlanningModel[] = ['Balanced', 'Classic', 'InvestmentFocused', 'Custom']
const incomeTypeOptions: IncomeSourceType[] = ['Salary', 'Business', 'Freelance', 'Investment', 'Other']

const defaultValues: FinancialSetup = {
  householdName: '',
  membersCount: 3,
  hasVariableIncome: true,
  primaryIncomeFrequency: 'Monthly',
  planningModel: 'Balanced',
  incomeSources: [
    {
      name: 'Renda principal',
      type: 'Business',
      amount: 0,
      isRecurring: true,
      frequency: 'Monthly',
      expectedDayOfMonth: 5,
    },
  ],
  planningBuckets: [
    { code: 'essential', name: 'Essenciais', percentage: 50, isActive: true, displayOrder: 1 },
    { code: 'education', name: 'Educação', percentage: 10, isActive: true, displayOrder: 2 },
    { code: 'investments', name: 'Investimentos', percentage: 20, isActive: true, displayOrder: 3 },
    { code: 'retirement', name: 'Aposentadoria', percentage: 10, isActive: true, displayOrder: 4 },
    { code: 'free', name: 'Livre', percentage: 10, isActive: true, displayOrder: 5 },
  ],
  expenseCategories: [
    { name: 'Aluguel', bucketCode: 'essential' },
    { name: 'Condomínio', bucketCode: 'essential' },
    { name: 'Investimentos mensais', bucketCode: 'investments' },
  ],
}

export function FinancialSetupPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const setupQuery = useQuery({
    queryKey: ['financial-setup'],
    queryFn: getFinancialSetup,
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FinancialSetup>({
    defaultValues,
  })
  const incomeSources = useFieldArray({
    control,
    name: 'incomeSources',
  })
  const planningBuckets = useFieldArray({
    control,
    name: 'planningBuckets',
  })
  const expenseCategories = useFieldArray({
    control,
    name: 'expenseCategories',
  })
  const saveMutation = useMutation({
    mutationFn: updateFinancialSetup,
    onSuccess: async () => {
      pushToast('Setup financeiro salvo com sucesso.', 'success')
      await queryClient.invalidateQueries({ queryKey: ['financial-setup'] })
    },
  })

  useEffect(() => {
    if (setupQuery.data) {
      reset(setupQuery.data)
    }
  }, [reset, setupQuery.data])

  const buckets = watch('planningBuckets')
  const activeBucketPercentage = buckets
    .filter((bucket) => bucket.isActive)
    .reduce((total, bucket) => total + Number(bucket.percentage || 0), 0)

  async function onSubmit(values: FinancialSetup) {
    const activeBuckets = values.planningBuckets.filter((bucket) => bucket.isActive)

    if (!values.incomeSources.length || !activeBuckets.length || !values.expenseCategories.length) {
      pushToast('Inclua ao menos uma fonte de renda, um bucket ativo e uma categoria.', 'error')
      return
    }

    if (activeBucketPercentage !== 100) {
      pushToast('Os buckets ativos precisam somar 100%.', 'error')
      return
    }

    const hasInvalidCategory = values.expenseCategories.some(
      (category) => !activeBuckets.some((bucket) => bucket.code === category.bucketCode),
    )

    if (hasInvalidCategory) {
      pushToast('Cada categoria precisa apontar para um bucket ativo.', 'error')
      return
    }

    try {
      await saveMutation.mutateAsync({
        ...values,
        planningBuckets: values.planningBuckets.map((bucket, index) => ({
          ...bucket,
          displayOrder: index + 1,
        })),
      })
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível salvar o setup.'
          : 'Não foi possível salvar o setup.'
      pushToast(message, 'error')
    }
  }

  return (
    <div className="grid gap-6">
      <PanelCard tone="emerald">
        <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
          Fase 1A
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Setup financeiro inicial</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Esta tela traduz o onboarding principal do backend para o front: composição familiar, padrão de renda,
          modelo de planejamento, buckets percentuais e categorias-base.
        </p>
      </PanelCard>

      <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
        <section className="grid gap-6 xl:grid-cols-2">
          <PanelCard tone="emerald">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Etapa 1. Família e renda</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FormField label="Nome da família">
                <FieldInput placeholder="Família Silva" {...register('householdName')} />
              </FormField>

              <FormField label="Quantidade de membros">
                <FieldInput min={1} type="number" {...register('membersCount', { valueAsNumber: true })} />
              </FormField>

              <FormField label="Periodicidade principal">
                <FieldSelect {...register('primaryIncomeFrequency')}>
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-200">
                <input className="h-4 w-4 accent-emerald-600" type="checkbox" {...register('hasVariableIncome')} />
                A renda principal varia ao longo dos meses
              </label>
            </div>
          </PanelCard>

          <PanelCard tone="sky">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Etapa 2. Modelo de planejamento</h3>
            <div className="mt-5 grid gap-4">
              <FormField label="Modelo base">
                <FieldSelect {...register('planningModel')}>
                  {planningModelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 p-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-300">
                Buckets ativos somando: <strong>{activeBucketPercentage}%</strong>. O backend trata o modelo percentual
                como guia ajustável, não como trava rígida.
              </div>
            </div>
          </PanelCard>
        </section>

        <PanelCard tone="amber">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Etapa 3. Fontes de renda</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Pelo menos uma fonte de renda precisa existir para alimentar o dashboard mensal.
              </p>
            </div>

            <button
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              onClick={() =>
                incomeSources.append({
                  name: '',
                  type: 'Other',
                  amount: 0,
                  isRecurring: true,
                  frequency: 'Monthly',
                  expectedDayOfMonth: null,
                })
              }
              type="button"
            >
              <Plus size={16} />
              Adicionar fonte
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            {incomeSources.fields.map((field, index) => (
              <article
                key={field.id}
                className="grid gap-4 rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
              >
                <FormField label="Nome">
                  <FieldInput {...register(`incomeSources.${index}.name`)} />
                </FormField>

                <FormField label="Tipo">
                  <FieldSelect {...register(`incomeSources.${index}.type`)}>
                    {incomeTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </FieldSelect>
                </FormField>

                <FormField label="Valor">
                  <FieldInput min={0} step="0.01" type="number" {...register(`incomeSources.${index}.amount`, { valueAsNumber: true })} />
                </FormField>

                <FormField label="Frequência">
                  <FieldSelect {...register(`incomeSources.${index}.frequency`)}>
                    {frequencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </FieldSelect>
                </FormField>

                <button
                  className="inline-flex h-11 items-center justify-center self-end rounded-xl border border-rose-200 bg-rose-50 px-3 text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
                  onClick={() => incomeSources.remove(index)}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>

                <FormField label="Dia esperado do mês">
                  <FieldInput
                    max={31}
                    min={1}
                    type="number"
                    {...register(`incomeSources.${index}.expectedDayOfMonth`, { valueAsNumber: true })}
                  />
                </FormField>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-200">
                  <input className="h-4 w-4 accent-emerald-600" type="checkbox" {...register(`incomeSources.${index}.isRecurring`)} />
                  É recorrente
                </label>
              </article>
            ))}
          </div>
        </PanelCard>

        <section className="grid gap-6 xl:grid-cols-2">
          <PanelCard tone="sky">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Etapa 4. Buckets percentuais</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  A soma dos buckets ativos precisa fechar em 100%.
                </p>
              </div>

              <button
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                onClick={() =>
                  planningBuckets.append({
                    code: '',
                    name: '',
                    percentage: 0,
                    isActive: true,
                    displayOrder: planningBuckets.fields.length + 1,
                  })
                }
                type="button"
              >
                <Plus size={16} />
                Novo bucket
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {planningBuckets.fields.map((field, index) => (
                <article
                  key={field.id}
                  className="grid gap-4 rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80 md:grid-cols-[1fr_1fr_140px_auto]"
                >
                  <FormField label="Código">
                    <FieldInput {...register(`planningBuckets.${index}.code`)} />
                  </FormField>

                  <FormField label="Nome">
                    <FieldInput {...register(`planningBuckets.${index}.name`)} />
                  </FormField>

                  <FormField label="%">
                    <FieldInput
                      max={100}
                      min={0}
                      step="0.01"
                      type="number"
                      {...register(`planningBuckets.${index}.percentage`, { valueAsNumber: true })}
                    />
                  </FormField>

                  <button
                    className="inline-flex h-11 items-center justify-center self-end rounded-xl border border-rose-200 bg-rose-50 px-3 text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
                    onClick={() => planningBuckets.remove(index)}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-200 md:col-span-2">
                    <input className="h-4 w-4 accent-emerald-600" type="checkbox" {...register(`planningBuckets.${index}.isActive`)} />
                    Bucket ativo na distribuição atual
                  </label>
                </article>
              ))}
            </div>
          </PanelCard>

          <PanelCard tone="amber">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Etapa 5. Categorias principais</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Cada categoria precisa ser vinculada a um bucket existente.
                </p>
              </div>

              <button
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                onClick={() => expenseCategories.append({ name: '', bucketCode: buckets[0]?.code || '' })}
                type="button"
              >
                <Plus size={16} />
                Nova categoria
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              {expenseCategories.fields.map((field, index) => (
                <article
                  key={field.id}
                  className="grid gap-4 rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80 md:grid-cols-[1fr_220px_auto]"
                >
                  <FormField label="Categoria">
                    <FieldInput {...register(`expenseCategories.${index}.name`)} />
                  </FormField>

                  <FormField label="Bucket">
                    <FieldSelect {...register(`expenseCategories.${index}.bucketCode`)}>
                      {buckets
                        .filter((bucket) => bucket.isActive)
                        .map((bucket) => (
                          <option key={bucket.code} value={bucket.code}>
                            {bucket.name}
                          </option>
                        ))}
                    </FieldSelect>
                  </FormField>

                  <button
                    className="inline-flex h-11 items-center justify-center self-end rounded-xl border border-rose-200 bg-rose-50 px-3 text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
                    onClick={() => expenseCategories.remove(index)}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
          </PanelCard>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/72">
          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Revisão final do setup</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Se o backend responder `404`, esta tela vira criação. Se responder `200`, o mesmo fluxo funciona em modo
              de edição.
            </p>
          </div>

          <PrimaryButton busy={isSubmitting || saveMutation.isPending} type="submit">
            Salvar setup financeiro
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}
