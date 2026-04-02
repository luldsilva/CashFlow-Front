import type { PropsWithChildren } from 'react'
import { cn } from '../../../lib/cn'

type PanelTone = 'emerald' | 'amber' | 'sky'

type PanelCardProps = PropsWithChildren<{
  tone: PanelTone
  className?: string
}>

const toneClasses: Record<PanelTone, string> = {
  emerald:
    'border-emerald-200/80 bg-[#eef6f1]/88 shadow-emerald-950/5 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/10',
  amber:
    'border-amber-200/80 bg-[#f7f1e6]/88 shadow-amber-950/5 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/10',
  sky: 'border-sky-200/80 bg-[#edf4f7]/88 shadow-sky-950/5 dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/10',
}

export function PanelCard({ tone, className, children }: PanelCardProps) {
  return (
    <section
      className={cn(
        'rounded-[2rem] border p-5 shadow-lg backdrop-blur transition-colors',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </section>
  )
}
