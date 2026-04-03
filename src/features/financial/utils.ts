export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
})

export const longDateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value ?? 0)
}

export function formatShortDate(value: string) {
  return shortDateFormatter.format(new Date(value))
}

export function formatDateTime(value: string) {
  return longDateTimeFormatter.format(new Date(value))
}

export function normalizeMonth(month: string) {
  return `${month}-01`
}

export function monthInputFromDate(value?: string) {
  return (value ?? new Date().toISOString()).slice(0, 7)
}

export function dateInputFromDate(value?: string) {
  return (value ?? new Date().toISOString()).slice(0, 10)
}

export function getBucketUsagePercent(plannedAmount: number, paidAmount: number, committedAmount: number) {
  if (plannedAmount <= 0) {
    return 0
  }

  return Math.min(100, ((paidAmount + committedAmount) / plannedAmount) * 100)
}
