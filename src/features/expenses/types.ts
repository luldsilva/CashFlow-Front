export type PaymentType = 0 | 1 | 2 | 3

export type ExpenseFormValues = {
  title: string
  description: string
  date: string
  amount: number
  paymentType: number
}

export type ExpenseListItem = {
  id: number
  title: string
  amount: number
}

export type ExpenseAttachment = {
  id: number
  fileName: string
  contentType: string
  sizeInBytes: number
  uploadedAt: string
}

export type ExpenseDetail = {
  id: number
  title: string
  description: string | null
  date: string
  amount: number
  paymentType: PaymentType
  attachments: ExpenseAttachment[]
}

export const paymentTypeOptions: Array<{ value: PaymentType; label: string }> = [
  { value: 0, label: 'Dinheiro' },
  { value: 1, label: 'Cartão de crédito' },
  { value: 2, label: 'Cartão de débito' },
  { value: 3, label: 'Transferência eletrônica' },
]
