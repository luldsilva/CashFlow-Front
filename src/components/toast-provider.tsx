import { createContext, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

type ToastKind = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  title: string
  kind: ToastKind
}

type ToastContextValue = {
  pushToast: (title: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const value = useMemo<ToastContextValue>(
    () => ({
      pushToast(title, kind = 'info') {
        const id = Date.now() + Math.floor(Math.random() * 1000)
        setToasts((current) => [...current, { id, title, kind }])

        window.setTimeout(() => {
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }, 3200)
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 grid w-[min(24rem,calc(100vw-2rem))] gap-3">
        {toasts.map((toast) => (
          <article
            className={`rounded-2xl border px-4 py-3 shadow-xl backdrop-blur ${
              toast.kind === 'success'
                ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
                : toast.kind === 'error'
                  ? 'border-rose-200 bg-rose-50/95 text-rose-900'
                  : 'border-slate-200 bg-white/95 text-slate-900'
            }`}
            key={toast.id}
          >
            <p className="text-sm font-semibold">{toast.title}</p>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return context
}
