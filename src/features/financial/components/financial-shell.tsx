import { LogOut, Menu, Moon, SunMedium } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../auth/auth-context'
import { useTheme } from '../../../components/theme-provider'
import { getFinancialSetup } from '../api'
import { cn } from '../../../lib/cn'

const navigation = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/setup', label: 'Setup' },
  { to: '/app/obligations', label: 'Obrigações' },
  { to: '/app/credit-cards', label: 'Cartões' },
  { to: '/app/monthly-review', label: 'Fechamento' },
  { to: '/app/settings/security', label: 'Segurança' },
]

export function FinancialShell() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const setupQuery = useQuery({
    queryKey: ['financial-setup'],
    queryFn: getFinancialSetup,
  })

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_24%),linear-gradient(180deg,_#edf2ee_0%,_#e4ece7_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.1),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(245,158,11,0.08),_transparent_24%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-5 lg:flex-row lg:px-6">
        <aside className="w-full rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/72 lg:w-[290px] lg:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                CashFlow
              </span>
              <h1 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
                Planejamento financeiro familiar
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                O foco agora é operar o mês, entender o comprometido e separar o livre.
              </p>
            </div>

            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 lg:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
              type="button"
            >
              <Menu size={18} />
            </button>
          </div>

          <div
            className={cn(
              'mt-6 grid gap-4 lg:block',
              mobileMenuOpen ? 'block' : 'hidden lg:block',
            )}
          >
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-800 dark:bg-slate-900/85">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Espaço ativo
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                {setupQuery.data?.householdName || 'Família em configuração'}
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {setupQuery.data
                  ? `${setupQuery.data.membersCount} pessoas e modelo ${setupQuery.data.planningModel}.`
                  : 'Complete o setup financeiro para ativar o fluxo principal.'}
              </p>
            </div>

            <nav className="grid gap-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl border px-4 py-3 text-sm font-medium transition',
                      isActive
                        ? 'border-slate-950 bg-slate-950 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950'
                        : 'border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-slate-300 dark:hover:border-slate-800 dark:hover:bg-slate-900',
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="grid gap-3 rounded-[1.5rem] border border-amber-200/80 bg-amber-50/90 p-4 dark:border-amber-400/15 dark:bg-amber-500/10">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-200">
                Particularidade do front
              </p>
              <p className="text-sm leading-6 text-amber-900 dark:text-amber-100">
                A fase mobile entra depois do MVP web. Nesta rodada, a prioridade é responsividade sólida e leitura
                clara do mês no navegador.
              </p>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/82 p-4 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/72 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Usuário ativo</p>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{user?.name}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                onClick={toggleTheme}
                type="button"
              >
                {theme === 'dark' ? <SunMedium size={17} /> : <Moon size={17} />}
                {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
              </button>

              <button
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
                onClick={logout}
                type="button"
              >
                <LogOut size={17} />
                Sair
              </button>
            </div>
          </header>

          <div className="mt-6">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}
