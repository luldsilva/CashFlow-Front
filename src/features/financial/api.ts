import { api } from '../../lib/api'
import type {
  CreditCard,
  CreditCardPayload,
  CreditCardStatement,
  CreditCardStatementPayload,
  FinancialObligation,
  FinancialObligationPayload,
  FinancialSetup,
  MonthlyReview,
  MonthlyReviewClosePayload,
  MonthlySummary,
} from './types'

function unwrapListResponse<T>(data: unknown, fallbackKey: string): T[] {
  if (Array.isArray(data)) {
    return data as T[]
  }

  if (data && typeof data === 'object' && fallbackKey in data) {
    const nested = (data as Record<string, unknown>)[fallbackKey]
    return Array.isArray(nested) ? (nested as T[]) : []
  }

  return []
}

export async function getFinancialSetup() {
  const response = await api.get<FinancialSetup>('/financial-setup', {
    validateStatus: (status) => status === 200 || status === 404,
  })

  return response.status === 404 ? null : response.data
}

export async function updateFinancialSetup(payload: FinancialSetup) {
  const { data } = await api.put<FinancialSetup>('/financial-setup', payload)
  return data
}

export async function listFinancialObligations(month: string) {
  const response = await api.get('/financial-obligations', {
    params: { month },
    validateStatus: (status) => status === 200 || status === 204,
  })

  if (response.status === 204) {
    return [] as FinancialObligation[]
  }

  return unwrapListResponse<FinancialObligation>(response.data, 'financialObligations')
}

export async function getFinancialObligation(id: number) {
  const { data } = await api.get<FinancialObligation>(`/financial-obligations/${id}`)
  return data
}

export async function createFinancialObligation(payload: FinancialObligationPayload) {
  const { data } = await api.post<FinancialObligation>('/financial-obligations', payload)
  return data
}

export async function updateFinancialObligation(id: number, payload: FinancialObligationPayload) {
  const { data } = await api.put<FinancialObligation>(`/financial-obligations/${id}`, payload)
  return data
}

export async function deleteFinancialObligation(id: number) {
  await api.delete(`/financial-obligations/${id}`)
}

export async function getMonthlySummary(month: string) {
  const { data } = await api.get<MonthlySummary>('/dashboard/monthly-summary', {
    params: { month },
  })

  return data
}

export async function listCreditCards() {
  const response = await api.get('/credit-cards', {
    validateStatus: (status) => status === 200 || status === 204,
  })

  if (response.status === 204) {
    return [] as CreditCard[]
  }

  return unwrapListResponse<CreditCard>(response.data, 'creditCards')
}

export async function createCreditCard(payload: CreditCardPayload) {
  const { data } = await api.post<CreditCard>('/credit-cards', payload)
  return data
}

export async function listCreditCardStatements(month: string) {
  const response = await api.get('/credit-cards/statements', {
    params: { month },
    validateStatus: (status) => status === 200 || status === 204,
  })

  if (response.status === 204) {
    return [] as CreditCardStatement[]
  }

  return unwrapListResponse<CreditCardStatement>(response.data, 'statements')
}

export async function createCreditCardStatement(payload: CreditCardStatementPayload) {
  const { data } = await api.post<CreditCardStatement>('/credit-cards/statements', payload)
  return data
}

export async function getMonthlyReview(month: string) {
  const { data } = await api.get<MonthlyReview>('/monthly-review', {
    params: { month },
  })

  return data
}

export async function closeMonthlyReview(payload: MonthlyReviewClosePayload) {
  const { data } = await api.post<MonthlyReview>('/monthly-review/close', payload)
  return data
}
