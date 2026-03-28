import type { PropsWithChildren } from 'react'

type FormFieldProps = PropsWithChildren<{
  label: string
  error?: string
}>

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  )
}
