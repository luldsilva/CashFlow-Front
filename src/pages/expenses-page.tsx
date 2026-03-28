import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Receipt, LogOut, Plus, Paperclip, Pencil, Trash2, Moon, SunMedium, FileText, FileSpreadsheet } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { useAuth } from '../features/auth/auth-context'
import {
  createExpense,
  deleteExpense,
  downloadExpenseReportExcel,
  downloadExpenseReportPdf,
  getExpense,
  listExpenses,
  updateExpense,
  uploadExpenseAttachment,
} from '../features/expenses/api'
import { expenseSchema } from '../features/schemas'
import type { ExpenseDetail, ExpenseFormValues } from '../features/expenses/types'
import { paymentTypeOptions } from '../features/expenses/types'
import { FieldInput } from '../components/field-input'
import { FieldSelect } from '../components/field-select'
import { FieldTextarea } from '../components/field-textarea'
import { FormField } from '../components/form-field'
import { PrimaryButton } from '../components/primary-button'
import { useToast } from '../components/toast-provider'
import { useTheme } from '../components/theme-provider'

const emptyValues: ExpenseFormValues = {
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  paymentType: 0,
}

type ExpenseFormInput = z.input<typeof expenseSchema>
type ExpenseFormOutput = z.output<typeof expenseSchema>

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function ExpensesPage() {
  const queryClient = useQueryClient()
  const { user, logout } = useAuth()
  const { pushToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null)
  const [editingExpense, setEditingExpense] = useState<ExpenseDetail | null>(null)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7))
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormInput, unknown, ExpenseFormOutput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: emptyValues,
  })

  const expensesQuery = useQuery({
    queryKey: ['expenses'],
    queryFn: listExpenses,
  })

  const selectedExpenseQuery = useQuery({
    queryKey: ['expense', selectedExpenseId],
    queryFn: () => getExpense(selectedExpenseId!),
    enabled: selectedExpenseId !== null,
  })

  useEffect(() => {
    if (!selectedExpenseId && expensesQuery.data?.length) {
      setSelectedExpenseId(expensesQuery.data[0].id)
    }
  }, [expensesQuery.data, selectedExpenseId])

  useEffect(() => {
    if (!editingExpense) {
      reset(emptyValues)
      return
    }

    reset({
      title: editingExpense.title,
      description: editingExpense.description ?? '',
      date: editingExpense.date.slice(0, 10),
      amount: editingExpense.amount,
      paymentType: editingExpense.paymentType,
    })
  }, [editingExpense, reset])

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: async () => {
      reset(emptyValues)
      await queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: ExpenseFormValues }) => updateExpense(id, values),
    onSuccess: async () => {
      setEditingExpense(null)
      pushToast('Despesa atualizada com sucesso.', 'success')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['expense', selectedExpenseId] }),
      ])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: async () => {
      setSelectedExpenseId(null)
      setEditingExpense(null)
      pushToast('Despesa removida com sucesso.', 'success')
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['expenses'] }),
        queryClient.invalidateQueries({ queryKey: ['expense'] }),
      ])
    },
  })

  const attachmentMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => uploadExpenseAttachment(id, file),
    onSuccess: async () => {
      pushToast('Anexo enviado com sucesso.', 'success')
      await queryClient.invalidateQueries({ queryKey: ['expense'] })
    },
  })

  const totalSpent = useMemo(
    () => expensesQuery.data?.reduce((sum, expense) => sum + expense.amount, 0) ?? 0,
    [expensesQuery.data],
  )

  const shellBackground = useMemo(
    () =>
      theme === 'dark'
        ? {
            background:
              'radial-gradient(circle at top left, rgba(45, 212, 191, 0.12), transparent 24%), radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.08), transparent 22%), linear-gradient(180deg, #020617 0%, #0f172a 100%)',
          }
        : {
            background:
              'radial-gradient(circle at top left, rgba(15, 118, 110, 0.18), transparent 22%), radial-gradient(circle at bottom right, rgba(245, 158, 11, 0.16), transparent 24%), linear-gradient(180deg, #e7efe9 0%, #d7e3dd 100%)',
          },
    [theme],
  )

  const reportPdfMutation = useMutation({
    mutationFn: downloadExpenseReportPdf,
  })

  const reportExcelMutation = useMutation({
    mutationFn: downloadExpenseReportExcel,
  })

  function extractError(error: unknown) {
    return error instanceof AxiosError
      ? error.response?.data?.errorMessages?.join(', ') ?? 'Falha inesperada na requisição.'
      : 'Falha inesperada na requisição.'
  }

  function saveBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  async function onSubmit(values: ExpenseFormOutput) {
    try {
      if (editingExpense) {
        await updateMutation.mutateAsync({ id: editingExpense.id, values })

        if (attachmentFile) {
          await attachmentMutation.mutateAsync({ id: editingExpense.id, file: attachmentFile })
          setAttachmentFile(null)
        }

        return
      }

      const createdExpense = await createMutation.mutateAsync(values)

      if (attachmentFile) {
        await attachmentMutation.mutateAsync({ id: createdExpense.id, file: attachmentFile })
      }

      setAttachmentFile(null)
      setSelectedExpenseId(createdExpense.id)
      setEditingExpense(null)
      pushToast('Despesa criada com sucesso.', 'success')
      await queryClient.invalidateQueries({ queryKey: ['expense', createdExpense.id] })
    } catch (error) {
      pushToast(extractError(error), 'error')
    }
  }

  async function handleAttachmentChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !selectedExpenseId) {
      return
    }

    try {
      await attachmentMutation.mutateAsync({ id: selectedExpenseId, file })
    } catch (error) {
      pushToast(extractError(error), 'error')
    } finally {
      event.target.value = ''
    }
  }

  async function handleReportDownload(kind: 'pdf' | 'excel') {
    try {
      const normalizedMonth = `${reportMonth}-01`
      const blob =
        kind === 'pdf'
          ? await reportPdfMutation.mutateAsync(normalizedMonth)
          : await reportExcelMutation.mutateAsync(normalizedMonth)

      saveBlob(blob, kind === 'pdf' ? 'relatorio-despesas.pdf' : 'relatorio-despesas.xlsx')
      pushToast(`Relatório em ${kind.toUpperCase()} gerado com sucesso.`, 'success')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 204) {
        pushToast('Não há dados para gerar relatório no período informado.', 'info')
        return
      }

      pushToast('Não foi possível gerar o relatório agora.', 'error')
    }
  }

  return (
    <main
      className="min-h-screen px-4 py-5 text-slate-900 transition-colors dark:text-slate-100 md:px-6"
      style={shellBackground}
    >
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr_360px]">
        <aside className="rounded-[2rem] border border-emerald-200/80 bg-[#eef6f1]/88 p-5 shadow-lg shadow-emerald-950/5 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">Workspace</p>
              <h1 className="mt-3 text-2xl font-semibold dark:text-white">CashFlow</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Bem-vindo de volta, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.name}</span>.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={toggleTheme}
                type="button"
                title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              >
                {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
              </button>
              <button
                className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={logout}
                type="button"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/10 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Total gasto</p>
            <p className="mt-3 text-3xl font-semibold">{formatCurrency(totalSpent)}</p>
            <p className="mt-2 text-sm text-slate-300">
              {expensesQuery.data?.length ?? 0} despesa{expensesQuery.data?.length === 1 ? '' : 's'} registrada{expensesQuery.data?.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Despesas</h2>
              <button
                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-200"
                onClick={() => {
                  setSelectedExpenseId(null)
                  setEditingExpense(null)
                  setAttachmentFile(null)
                  reset(emptyValues)
                  pushToast('Formulário preparado para uma nova despesa.', 'info')
                }}
                type="button"
                title="Nova despesa"
              >
                <Plus size={14} />
                Nova
              </button>
            </div>

            <div className="grid gap-2">
              {expensesQuery.data?.map((expense) => (
                <button
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedExpenseId === expense.id
                      ? 'border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-950/5 dark:border-emerald-500/60 dark:bg-emerald-500/10'
                      : 'border-slate-200/80 bg-[#f8fbf9]/76 hover:border-slate-300 hover:bg-[#fcfdfc]/92 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                  }`}
                  key={expense.id}
                  onClick={() => {
                    setSelectedExpenseId(expense.id)
                    setEditingExpense(null)
                  }}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{expense.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(expense.amount)}</p>
                    </div>
                    <Receipt className="text-slate-400 dark:text-slate-500" size={18} />
                  </div>
                </button>
              ))}

              {expensesQuery.isLoading ? <p className="text-sm text-slate-500 dark:text-slate-400">Carregando despesas...</p> : null}
              {!expensesQuery.isLoading && !expensesQuery.data?.length ? (
                <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Nenhuma despesa ainda. Cadastre a primeira usando o formulário.
                </p>
              ) : null}
            </div>
          </div>
        </aside>

        <section className="rounded-[2rem] border border-amber-200/80 bg-[#f7f1e6]/88 p-5 shadow-lg shadow-amber-950/5 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/10">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
              {editingExpense ? 'Editar despesa' : 'Nova despesa'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
              {editingExpense ? editingExpense.title : 'Cadastrar uma nova despesa'}
            </h2>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Título" error={errors.title?.message}>
              <FieldInput placeholder="Mercado, Uber, Netflix..." {...register('title')} />
            </FormField>

            <FormField label="Valor" error={errors.amount?.message}>
              <FieldInput step="0.01" type="number" {...register('amount', { valueAsNumber: true })} />
            </FormField>

            <FormField label="Data" error={errors.date?.message}>
              <FieldInput type="date" {...register('date')} />
            </FormField>

            <FormField label="Forma de pagamento" error={errors.paymentType?.message}>
              <Controller
                control={control}
                name="paymentType"
                render={({ field }) => (
                  <FieldSelect
                    value={Number(field.value ?? 0)}
                    onChange={(event) => field.onChange(Number(event.target.value))}
                  >
                    {paymentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FieldSelect>
                )}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Descrição" error={errors.description?.message}>
                <FieldTextarea placeholder="Contexto rápido sobre essa despesa" {...register('description')} />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label={editingExpense ? 'Novo anexo opcional' : 'Anexo opcional'}>
                <label className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-amber-300 bg-[#efe2c8]/72 px-4 py-4 text-sm text-slate-600 transition hover:border-amber-400 hover:bg-[#f3e7cf]/86 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-400/60">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {attachmentFile
                      ? `Arquivo selecionado: ${attachmentFile.name}`
                      : 'Selecione uma imagem, PDF ou comprovante para vincular à despesa'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    O arquivo será enviado automaticamente após salvar a despesa.
                  </span>
                  <input
                    className="hidden"
                    onChange={(event) => setAttachmentFile(event.target.files?.[0] ?? null)}
                    type="file"
                  />
                </label>
              </FormField>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <PrimaryButton
                busy={
                  isSubmitting ||
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  attachmentMutation.isPending
                }
                type="submit"
              >
                {editingExpense ? 'Salvar alterações' : 'Criar despesa'}
              </PrimaryButton>

              {editingExpense ? (
                <button
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  onClick={() => {
                    setEditingExpense(null)
                    setAttachmentFile(null)
                    reset(emptyValues)
                    pushToast('Edição cancelada.', 'info')
                  }}
                  type="button"
                >
                  Cancelar edição
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-sky-200/80 bg-[#edf4f7]/88 p-5 shadow-lg shadow-sky-950/5 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Despesa selecionada</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                {selectedExpenseQuery.data?.title ?? 'Nada selecionado'}
              </h2>
            </div>

            {selectedExpenseQuery.data ? (
              <div className="flex gap-2">
                <button
                  className="cursor-pointer rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
                  onClick={() => setEditingExpense(selectedExpenseQuery.data)}
                  type="button"
                  title="Editar despesa"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="cursor-pointer rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                  onClick={async () => {
                    try {
                      await deleteMutation.mutateAsync(selectedExpenseQuery.data.id)
                    } catch (error) {
                      pushToast(extractError(error), 'error')
                    }
                  }}
                  type="button"
                  title="Excluir despesa"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : null}
          </div>

          {selectedExpenseQuery.isLoading ? <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Carregando detalhes da despesa...</p> : null}

          {selectedExpenseQuery.data ? (
            <div className="mt-6 grid gap-5">
              <dl className="grid gap-3 rounded-3xl border border-slate-200/80 bg-[#f4f8f6]/78 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">Valor</dt>
                  <dd className="font-semibold text-slate-950 dark:text-white">{formatCurrency(selectedExpenseQuery.data.amount)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">Data</dt>
                  <dd className="font-semibold text-slate-950 dark:text-white">{formatDate(selectedExpenseQuery.data.date)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500 dark:text-slate-400">Pagamento</dt>
                  <dd className="font-semibold text-slate-950 dark:text-white">
                    {paymentTypeOptions.find((option) => option.value === selectedExpenseQuery.data.paymentType)?.label}
                  </dd>
                </div>
              </dl>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Descrição</p>
                <p className="mt-2 rounded-3xl border border-slate-200/80 bg-[#f7faf8]/80 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {selectedExpenseQuery.data.description || 'Nenhuma descrição informada.'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-[#f4f8f6]/78 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Anexos</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      Envie comprovantes, prints ou notas para esta despesa.
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                    <Paperclip size={16} />
                    Enviar
                    <input className="hidden" onChange={handleAttachmentChange} type="file" />
                  </label>
                </div>

                <div className="mt-4 grid gap-3">
                  {selectedExpenseQuery.data.attachments.map((attachment) => (
                    <article className="rounded-2xl border border-slate-200/80 bg-[#f8fbf9]/82 px-4 py-3 dark:border-slate-700 dark:bg-slate-900" key={attachment.id}>
                      <p className="font-semibold text-slate-900 dark:text-white">{attachment.fileName}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {attachment.contentType} · {(attachment.sizeInBytes / 1024).toFixed(1)} KB
                      </p>
                    </article>
                  ))}

                  {!selectedExpenseQuery.data.attachments.length ? (
                    <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      Nenhum anexo ainda para esta despesa.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-[#f5f9fa]/80 p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-40 flex-1">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Relatórios</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      Exporte um consolidado mensal em PDF ou Excel.
                    </p>
                  </div>

                  <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                    <span>Mês de referência</span>
                    <input
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10"
                      onChange={(event) => setReportMonth(event.target.value)}
                      type="month"
                      value={reportMonth}
                    />
                  </label>

                  <button
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                    onClick={() => void handleReportDownload('pdf')}
                    type="button"
                  >
                    <FileText size={16} />
                    PDF
                  </button>

                  <button
                    className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                    onClick={() => void handleReportDownload('excel')}
                    type="button"
                  >
                    <FileSpreadsheet size={16} />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Selecione uma despesa na coluna da esquerda para ver detalhes e enviar arquivos.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
