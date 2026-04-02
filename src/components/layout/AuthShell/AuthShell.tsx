import type { PropsWithChildren } from 'react'
import { Moon, SunMedium } from 'lucide-react'
import { useTheme } from '../../theme-provider'

export function AuthShell({ children }: PropsWithChildren) {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.16),_transparent_25%),linear-gradient(180deg,_#f7faf9_0%,_#eef3f1_100%)] px-4 py-10 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.08),_transparent_25%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/50 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-emerald-950/15 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-full flex-col justify-between gap-12">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
                  CashFlow
                </span>
                <button
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  onClick={toggleTheme}
                  title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                  type="button"
                >
                  {theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight">
                Controle financeiro pessoal com um fluxo simples no dia a dia.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Comece com um MVP prático: faça login, registre despesas, acompanhe valores e mantenha
                comprovantes anexados a cada lançamento.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">API</p>
                <p className="mt-2">Autenticação JWT com rotas protegidas para despesas.</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">Arquivos</p>
                <p className="mt-2">Anexos armazenados com MinIO e vinculados às despesas.</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">Evolução</p>
                <p className="mt-2">Frontend preparado para evoluir para mobile depois.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 dark:shadow-black/10">
          {children}
        </section>
      </div>
    </main>
  )
}
