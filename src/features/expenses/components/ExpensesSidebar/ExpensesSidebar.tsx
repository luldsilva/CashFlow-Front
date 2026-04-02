import { LogOut, Moon, Plus, Receipt, SunMedium } from 'lucide-react'
import type { ExpenseListItem } from '../../types'
import { cn } from '../../../../lib/cn'
import { formatCurrency } from '../../utils/formatters'
import { expenseListItemClass } from '../expense-variants'
import { IconButton } from '../../../../components/ui/IconButton'
import { PanelCard } from '../../../../components/ui/PanelCard'

type ExpensesSidebarProps = {
  userName?: string
  theme: 'light' | 'dark'
  totalSpent: number
  expenses: ExpenseListItem[]
  selectedExpenseId: number | null
  isLoading: boolean
  onToggleTheme: () => void
  onLogout: () => void
  onCreateNew: () => void
  onSelectExpense: (id: number) => void
}

export function ExpensesSidebar({
  userName,
  theme,
  totalSpent,
  expenses,
  selectedExpenseId,
  isLoading,
  onToggleTheme,
  onLogout,
  onCreateNew,
  onSelectExpense,
}: ExpensesSidebarProps) {
  return (
    <PanelCard tone="emerald" className="h-fit">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">Workspace</p>
          <h1 className="mt-3 text-2xl font-semibold dark:text-white">CashFlow</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Bem-vindo de volta, <span className="font-semibold text-slate-700 dark:text-slate-200">{userName}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
          </IconButton>
          <IconButton onClick={onLogout} title="Sair">
            <LogOut size={18} />
          </IconButton>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/10 dark:bg-slate-800">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-200">Total gasto</p>
        <p className="mt-3 text-3xl font-semibold">{formatCurrency(totalSpent)}</p>
        <p className="mt-2 text-sm text-slate-300">
          {expenses.length} despesa{expenses.length === 1 ? '' : 's'} registrada{expenses.length === 1 ? '' : 's'}.
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Despesas
          </h2>
          <button
            className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-200"
            onClick={onCreateNew}
            type="button"
            title="Nova despesa"
          >
            <Plus size={14} />
            Nova
          </button>
        </div>

        <div className="grid gap-2">
          {expenses.map((expense) => (
            <button
              className={cn(
                expenseListItemClass.base,
                selectedExpenseId === expense.id ? expenseListItemClass.active : expenseListItemClass.idle,
              )}
              key={expense.id}
              onClick={() => onSelectExpense(expense.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{expense.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <Receipt className="text-slate-400 dark:text-slate-500" size={18} />
              </div>
            </button>
          ))}

          {isLoading ? <p className="text-sm text-slate-500 dark:text-slate-400">Carregando despesas...</p> : null}
          {!isLoading && !expenses.length ? (
            <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Nenhuma despesa ainda. Cadastre a primeira usando o formulário.
            </p>
          ) : null}
        </div>
      </div>
    </PanelCard>
  )
}
