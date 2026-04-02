import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../../lib/cn'

type IconButtonVariant = 'neutral' | 'danger'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: IconButtonVariant
}

const variantClasses: Record<IconButtonVariant, string> = {
  neutral:
    'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white',
  danger: 'border-rose-200 text-rose-600 hover:bg-rose-50',
}

export function IconButton({ className, variant = 'neutral', type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'cursor-pointer rounded-xl border p-2 transition',
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    />
  )
}
