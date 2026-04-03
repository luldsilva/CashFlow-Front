import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { CreditCard as CreditCardIcon, WalletCards } from 'lucide-react'
import { PanelCard } from '../components/ui/PanelCard'
import { FormField } from '../components/ui/FormField'
import { FieldInput } from '../components/ui/FieldInput'
import { FieldSelect } from '../components/ui/FieldSelect'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import {
  createCreditCard,
  createCreditCardStatement,
  listCreditCards,
  listCreditCardStatements,
} from '../features/financial/api'
import type {
  CreditCardPayload,
  CreditCardStatementPayload,
  CreditCardStatementStatus,
} from '../features/financial/types'
import { formatCurrency, formatShortDate, monthInputFromDate, normalizeMonth } from '../features/financial/utils'
import { useToast } from '../components/toast-provider'

const statementStatusOptions: CreditCardStatementStatus[] = ['Open', 'Closed', 'Paid']

const cardDefaults: CreditCardPayload = {
  name: '',
  brand: '',
  lastFourDigits: '',
  closingDay: 1,
  dueDay: 10,
}

function createStatementDefaults(month: string): CreditCardStatementPayload {
  return {
    creditCardId: 0,
    competenceDate: normalizeMonth(month),
    closingDate: normalizeMonth(month),
    dueDate: normalizeMonth(month),
    totalAmount: 0,
    paidAmount: 0,
    paidDate: null,
    status: 'Open',
  }
}

export function CreditCardsPage() {
  const queryClient = useQueryClient()
  const { pushToast } = useToast()
  const month = monthInputFromDate()
  const cardsQuery = useQuery({
    queryKey: ['credit-cards'],
    queryFn: listCreditCards,
  })
  const statementsQuery = useQuery({
    queryKey: ['credit-card-statements', month],
    queryFn: () => listCreditCardStatements(normalizeMonth(month)),
  })
  const cardForm = useForm<CreditCardPayload>({
    defaultValues: cardDefaults,
  })
  const statementForm = useForm<CreditCardStatementPayload>({
    defaultValues: createStatementDefaults(month),
  })
  const createCardMutation = useMutation({
    mutationFn: createCreditCard,
    onSuccess: async () => {
      pushToast('Cartão cadastrado com sucesso.', 'success')
      cardForm.reset(cardDefaults)
      await queryClient.invalidateQueries({ queryKey: ['credit-cards'] })
    },
  })
  const createStatementMutation = useMutation({
    mutationFn: createCreditCardStatement,
    onSuccess: async () => {
      pushToast('Fatura registrada com sucesso.', 'success')
      statementForm.reset(createStatementDefaults(month))
      await queryClient.invalidateQueries({ queryKey: ['credit-card-statements', month] })
    },
  })

  async function handleCardSubmit(values: CreditCardPayload) {
    try {
      await createCardMutation.mutateAsync(values)
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível cadastrar o cartão.'
          : 'Não foi possível cadastrar o cartão.'
      pushToast(message, 'error')
    }
  }

  async function handleStatementSubmit(values: CreditCardStatementPayload) {
    try {
      await createStatementMutation.mutateAsync({
        ...values,
        paidDate: values.status === 'Paid' ? values.paidDate : null,
      })
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.errorMessages?.[0] ?? 'Não foi possível registrar a fatura.'
          : 'Não foi possível registrar a fatura.'
      pushToast(message, 'error')
    }
  }

  return (
    <div className="grid gap-6">
      <PanelCard tone="sky">
        <span className="inline-flex rounded-full border border-sky-300 bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100">
          Fase 1D
        </span>
        <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">Cartões e faturas por competência</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          O cartão agora é tratado como domínio próprio, com fechamento, vencimento e leitura do ciclo mensal.
        </p>
      </PanelCard>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PanelCard tone="emerald">
          <div className="flex items-center gap-3">
            <CreditCardIcon size={18} className="text-emerald-700 dark:text-emerald-200" />
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Cadastro de cartão</h3>
          </div>

          <form className="mt-5 grid gap-4" onSubmit={cardForm.handleSubmit(handleCardSubmit)}>
            <FormField label="Nome">
              <FieldInput {...cardForm.register('name')} />
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Bandeira">
                <FieldInput placeholder="Visa, Mastercard..." {...cardForm.register('brand')} />
              </FormField>

              <FormField label="Final">
                <FieldInput maxLength={4} {...cardForm.register('lastFourDigits')} />
              </FormField>

              <FormField label="Dia de fechamento">
                <FieldInput min={1} max={31} type="number" {...cardForm.register('closingDay', { valueAsNumber: true })} />
              </FormField>

              <FormField label="Dia de vencimento">
                <FieldInput min={1} max={31} type="number" {...cardForm.register('dueDay', { valueAsNumber: true })} />
              </FormField>
            </div>

            <PrimaryButton busy={createCardMutation.isPending} type="submit">
              Salvar cartão
            </PrimaryButton>
          </form>
        </PanelCard>

        <PanelCard tone="amber">
          <div className="flex items-center gap-3">
            <WalletCards size={18} className="text-amber-700 dark:text-amber-200" />
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Nova fatura do mês</h3>
          </div>

          <form className="mt-5 grid gap-4" onSubmit={statementForm.handleSubmit(handleStatementSubmit)}>
            <FormField label="Cartão">
              <FieldSelect {...statementForm.register('creditCardId', { valueAsNumber: true })}>
                <option value={0}>Selecione</option>
                {cardsQuery.data?.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name} • {card.lastFourDigits}
                  </option>
                ))}
              </FieldSelect>
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Competência">
                <FieldInput type="date" {...statementForm.register('competenceDate')} />
              </FormField>

              <FormField label="Status">
                <FieldSelect {...statementForm.register('status')}>
                  {statementStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </FieldSelect>
              </FormField>

              <FormField label="Fechamento">
                <FieldInput type="date" {...statementForm.register('closingDate')} />
              </FormField>

              <FormField label="Vencimento">
                <FieldInput type="date" {...statementForm.register('dueDate')} />
              </FormField>

              <FormField label="Valor total">
                <FieldInput min={0} step="0.01" type="number" {...statementForm.register('totalAmount', { valueAsNumber: true })} />
              </FormField>

              <FormField label="Valor pago">
                <FieldInput min={0} step="0.01" type="number" {...statementForm.register('paidAmount', { valueAsNumber: true })} />
              </FormField>
            </div>

            <PrimaryButton busy={createStatementMutation.isPending} type="submit">
              Registrar fatura
            </PrimaryButton>
          </form>
        </PanelCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PanelCard tone="emerald">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Cartões cadastrados</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Área dedicada para não misturar cartão com obrigação comum.
          </p>

          <div className="mt-5 grid gap-4">
            {cardsQuery.data?.length ? (
              cardsQuery.data.map((card) => (
                <article
                  key={card.id}
                  className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{card.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {card.brand} • final {card.lastFourDigits}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
                      ativo
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span>Fecha dia {card.closingDay}</span>
                    <span>Vence dia {card.dueDay}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
                Nenhum cartão cadastrado ainda. O fluxo do backend começa por `POST /api/credit-cards`.
              </div>
            )}
          </div>
        </PanelCard>

        <PanelCard tone="sky">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Faturas por competência</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Visão mensal das faturas abertas, fechadas e pagas.</p>

          <div className="mt-5 grid gap-4">
            {statementsQuery.data?.length ? (
              statementsQuery.data.map((statement) => (
                <article
                  key={statement.id}
                  className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Competência {statement.competenceDate.slice(0, 7)}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Cartão #{statement.creditCardId}
                      </p>
                    </div>
                    <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-100">
                      {statement.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
                    <span>Fechamento: {formatShortDate(statement.closingDate)}</span>
                    <span>Vencimento: {formatShortDate(statement.dueDate)}</span>
                    <span>Total: {formatCurrency(statement.totalAmount)}</span>
                    <span>Pago: {formatCurrency(statement.paidAmount)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
                Nenhuma fatura retornada para esta competência. O backend pode responder `204` quando o mês estiver vazio.
              </div>
            )}
          </div>
        </PanelCard>
      </section>
    </div>
  )
}
