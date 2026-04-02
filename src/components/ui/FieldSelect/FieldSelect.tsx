import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'

export const FieldSelect = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function FieldSelect({ className, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-emerald-500 dark:focus:ring-emerald-500/10',
          className,
        )}
        {...props}
      />
    )
  },
)
