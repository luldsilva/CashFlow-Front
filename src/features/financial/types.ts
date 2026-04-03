export type HouseholdIncomeFrequency = 'Monthly' | 'Biweekly' | 'Weekly' | 'Variable'

export type PlanningModel = 'Balanced' | 'Classic' | 'InvestmentFocused' | 'Custom'

export type IncomeSourceType = 'Salary' | 'Business' | 'Freelance' | 'Investment' | 'Other'

export type FinancialObligationRecurrenceType = 'OneTime' | 'FixedMonthly' | 'VariableMonthly'

export type FinancialObligationStatus = 'Expected' | 'Paid' | 'Adjusted'

export type CreditCardStatementStatus = 'Open' | 'Closed' | 'Paid'

export type IncomeSource = {
  name: string
  type: IncomeSourceType
  amount: number
  isRecurring: boolean
  frequency: HouseholdIncomeFrequency
  expectedDayOfMonth: number | null
}

export type PlanningBucket = {
  code: string
  name: string
  percentage: number
  isActive: boolean
  displayOrder: number
}

export type ExpenseCategory = {
  name: string
  bucketCode: string
}

export type FinancialSetup = {
  householdName: string
  membersCount: number
  hasVariableIncome: boolean
  primaryIncomeFrequency: HouseholdIncomeFrequency
  planningModel: PlanningModel
  incomeSources: IncomeSource[]
  planningBuckets: PlanningBucket[]
  expenseCategories: ExpenseCategory[]
}

export type FinancialObligation = {
  id: number
  title: string
  description: string | null
  categoryName: string
  bucketCode: string
  amount: number
  paidAmount: number
  competenceDate: string
  dueDate: string
  paidDate: string | null
  recurrenceType: FinancialObligationRecurrenceType
  status: FinancialObligationStatus
}

export type FinancialObligationPayload = Omit<FinancialObligation, 'id'>

export type MonthlyBucketSummary = {
  bucketCode: string
  bucketName: string
  plannedAmount: number
  paidAmount: number
  committedAmount: number
  remainingAmount: number
}

export type UpcomingObligation = {
  id: number
  title: string
  categoryName: string
  bucketCode: string
  amount: number
  dueDate: string
  status: FinancialObligationStatus
}

export type MonthlySummary = {
  competenceDate: string
  plannedIncome: number
  paidOutflow: number
  committedOutflow: number
  freeToSpend: number
  freeToInvest: number
  buckets: MonthlyBucketSummary[]
  upcomingObligations: UpcomingObligation[]
}

export type CreditCard = {
  id: number
  name: string
  brand: string
  lastFourDigits: string
  closingDay: number
  dueDay: number
}

export type CreditCardPayload = Omit<CreditCard, 'id'>

export type CreditCardStatement = {
  id: number
  creditCardId: number
  competenceDate: string
  closingDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  paidDate: string | null
  status: CreditCardStatementStatus
}

export type CreditCardStatementPayload = Omit<CreditCardStatement, 'id'>

export type MonthlyClosure = {
  id: number
  competenceDate: string
  plannedIncome: number
  paidOutflow: number
  committedOutflow: number
  freeToSpend: number
  freeToInvest: number
  notes: string
  closedAt: string
}

export type MonthlyReview = {
  competenceDate: string
  summary: MonthlySummary
  closure: MonthlyClosure | null
}

export type MonthlyReviewClosePayload = {
  competenceDate: string
  notes: string
}
