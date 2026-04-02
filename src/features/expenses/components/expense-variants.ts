export const expenseShellClass =
  'min-h-screen px-4 py-5 text-slate-900 transition-colors dark:text-slate-100 md:px-6'

export const expenseListItemClass = {
  base: 'cursor-pointer rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md',
  active:
    'border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-950/5 dark:border-emerald-500/60 dark:bg-emerald-500/10',
  idle:
    'border-slate-200/80 bg-[#f8fbf9]/76 hover:border-slate-300 hover:bg-[#fcfdfc]/92 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600',
}

export const subtleInfoCardClass =
  'rounded-3xl border border-slate-200/80 bg-[#f4f8f6]/78 p-4 dark:border-slate-700 dark:bg-slate-800'

export const subtleTextBlockClass =
  'mt-2 rounded-3xl border border-slate-200/80 bg-[#f7faf8]/80 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'

export const dashedEmptyStateClass =
  'rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400'

export const reportActionButtonClass =
  'inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-900'
