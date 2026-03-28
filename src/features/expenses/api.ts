import { api } from '../../lib/api'
import type { ExpenseDetail, ExpenseFormValues, ExpenseListItem } from './types'

type ExpensesResponse = {
  expenses: ExpenseListItem[]
}

type CreatedExpenseResponse = {
  id: number
  title: string
}

export async function listExpenses() {
  const response = await api.get<ExpensesResponse>('/Expenses', {
    validateStatus: (status) => status === 200 || status === 204,
  })

  if (response.status === 204) {
    return [] as ExpenseListItem[]
  }

  return response.data.expenses
}

export async function getExpense(id: number) {
  const { data } = await api.get<ExpenseDetail>(`/Expenses/${id}`)
  return data
}

export async function createExpense(payload: ExpenseFormValues) {
  const { data } = await api.post<CreatedExpenseResponse>('/Expenses', {
    ...payload,
    amount: Number(payload.amount),
  })

  return data
}

export async function updateExpense(id: number, payload: ExpenseFormValues) {
  await api.put(`/Expenses/${id}`, {
    ...payload,
    amount: Number(payload.amount),
  })
}

export async function deleteExpense(id: number) {
  await api.delete(`/Expenses/${id}`)
}

export async function uploadExpenseAttachment(id: number, file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(`/Expenses/${id}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

export async function downloadExpenseReportPdf(month: string) {
  const response = await api.get('/Report/pdf', {
    params: { month },
    responseType: 'blob',
  })

  return response.data as Blob
}

export async function downloadExpenseReportExcel(month: string) {
  const response = await api.get('/Report/excel', {
    headers: { month },
    responseType: 'blob',
  })

  return response.data as Blob
}
