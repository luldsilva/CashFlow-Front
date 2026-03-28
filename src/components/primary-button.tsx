import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  busy?: boolean
}

export function PrimaryButton({ busy, className, children, ...props }: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-400',
        className,
      )}
      disabled={busy || props.disabled}
      {...props}
    >
      {busy ? 'Aguarde...' : children}
    </button>
  )
}
