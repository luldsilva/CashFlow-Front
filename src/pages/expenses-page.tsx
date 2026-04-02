import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
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
import { useToast } from '../components/toast-provider'
import { useTheme } from '../components/theme-provider'
import { ExpenseDetailsCard } from '../features/expenses/components/ExpenseDetailsCard'
import { ExpenseFormCard } from '../features/expenses/components/ExpenseFormCard'
import { ExpensesSidebar } from '../features/expenses/components/ExpensesSidebar'
import { expenseShellClass } from '../features/expenses/components/expense-variants'

const emptyValues: ExpenseFormValues = {
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  paymentType: 0,
}

type ExpenseFormInput = z.input<typeof expenseSchema>
type ExpenseFormOutput = z.output<typeof expenseSchema>

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
    <main className={expenseShellClass} style={shellBackground}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr_360px]">
        <ExpensesSidebar
          expenses={expensesQuery.data ?? []}
          isLoading={expensesQuery.isLoading}
          onCreateNew={() => {
            setSelectedExpenseId(null)
            setEditingExpense(null)
            setAttachmentFile(null)
            reset(emptyValues)
            pushToast('Formulário preparado para uma nova despesa.', 'info')
          }}
          onLogout={logout}
          onSelectExpense={(id) => {
            setSelectedExpenseId(id)
            setEditingExpense(null)
          }}
          onToggleTheme={toggleTheme}
          selectedExpenseId={selectedExpenseId}
          theme={theme}
          totalSpent={totalSpent}
          userName={user?.name}
        />

        <ExpenseFormCard
          attachmentFile={attachmentFile}
          control={control}
          editingExpense={editingExpense}
          errors={errors}
          handleSubmit={handleSubmit}
          isBusy={createMutation.isPending || updateMutation.isPending || attachmentMutation.isPending}
          isSubmitting={isSubmitting}
          onAttachmentSelect={(event) => setAttachmentFile(event.target.files?.[0] ?? null)}
          onCancelEdit={() => {
            setEditingExpense(null)
            setAttachmentFile(null)
            reset(emptyValues)
            pushToast('Edição cancelada.', 'info')
          }}
          onSubmit={onSubmit}
          register={register}
        />

        <ExpenseDetailsCard
          expense={selectedExpenseQuery.data}
          isLoading={selectedExpenseQuery.isLoading}
          onAttachmentUpload={handleAttachmentChange}
          onDelete={async () => {
            if (!selectedExpenseQuery.data) {
              return
            }

            try {
              await deleteMutation.mutateAsync(selectedExpenseQuery.data.id)
            } catch (error) {
              pushToast(extractError(error), 'error')
            }
          }}
          onDownloadReport={(kind) => void handleReportDownload(kind)}
          onEdit={() => {
            if (selectedExpenseQuery.data) {
              setEditingExpense(selectedExpenseQuery.data)
            }
          }}
          onReportMonthChange={setReportMonth}
          reportMonth={reportMonth}
        />
      </div>
    </main>
  )
}
