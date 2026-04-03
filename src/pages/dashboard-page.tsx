import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, ArrowRight, CalendarClock, Landmark, PiggyBank, Wallet } from 'lucide-react'
import { PanelCard } from '../components/ui/PanelCard'
import { getFinancialSetup, getMonthlySummary } from '../features/financial/api'
import { formatCurrency, formatShortDate, getBucketUsagePercent, monthInputFromDate, normalizeMonth } from '../features/financial/utils'

const kpiConfig = [
  { key: 'plannedIncome', label: 'Entrou no mês', tone: 'emerald', icon: Landmark },
  { key: 'paidOutflow', label: 'Saiu no mês', tone: 'amber', icon: Wallet },
  { key: 'committedOutflow', label: 'Comprometido', tone: 'sky', icon: CalendarClock },
  { key: 'freeToSpend', label: 'Livre para gastar', tone: 'emerald', icon: ArrowRight },
  { key: 'freeToInvest', label: 'Livre para investir', tone: 'sky', icon: PiggyBank },
] as const

export function DashboardPage() {
  const month = monthInputFromDate()
  const setupQuery = useQuery({
    queryKey: ['financial-setup'],
    queryFn: getFinancialSetup,
  })
  const summaryQuery = useQuery({
    queryKey: ['monthly-summary', month],
    queryFn: () => getMonthlySummary(normalizeMonth(month)),
    enabled: Boolean(setupQuery.data),
  })

  if (!setupQuery.isLoading && !setupQuery.data) {
    return (
      <PanelCard tone="amber" className="overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
              Fase 1A
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
              Comece pelo setup financeiro da família
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              O backend da Fase 1 já espera household, fontes de renda, buckets percentuais e categorias. Sem isso,
              o dashboard não consegue mostrar o comprometido, o livre e o potencial de investimento do mês.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-11 items-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
                to="/app/setup"
              >
                Configurar setup financeiro
              </Link>
              <Link
                className="inline-flex h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                to="/app/obligations"
              >
                Ver operação mensal
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-5 dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Jornada visual da Fase 1</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                1A. Setup financeiro
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                1B. Obrigações do mês
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                1C. Dashboard operacional
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                1D. Cartões e faturas
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80">
                1E. Fechamento mensal
              </div>
            </div>
          </div>
        </div>
      </PanelCard>
    )
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <PanelCard tone="emerald">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-200">
                Fase 1C
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                Dashboard operacional do mês
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                A home agora foi reposicionada para mostrar o que já saiu, o que ainda está comprometido e quanto
                permanece livre para o mês atual.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/60 bg-white/70 px-4 py-3 text-right dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Competência</p>
              <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{month}</p>
            </div>
          </div>
        </PanelCard>

        <PanelCard tone="sky">
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Leitura principal do produto</p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                O centro da experiência deixa de ser despesa isolada. O foco passa a ser saldo comprometido versus
                saldo livre.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80">
                Próximos vencimentos em destaque
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/80">
                Buckets comparando planejado x pago x comprometido
              </div>
            </div>
          </div>
        </PanelCard>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpiConfig.map((item) => {
          const Icon = item.icon
          const value = summaryQuery.data?.[item.key] ?? 0

          return (
            <PanelCard key={item.key} tone={item.tone}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{formatCurrency(value)}</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 p-3 text-slate-700 dark:border-slate-800 dark:bg-slate-950/75 dark:text-slate-200">
                  <Icon size={18} />
                </div>
              </div>
            </PanelCard>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PanelCard tone="amber">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Próximos vencimentos</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                O backend já entrega `upcomingObligations[]` para priorizar o que vence no mês.
              </p>
            </div>
            <Link className="text-sm font-semibold text-amber-800 dark:text-amber-200" to="/app/obligations">
              Ir para obrigações
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {summaryQuery.data?.upcomingObligations?.length ? (
              summaryQuery.data.upcomingObligations.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {item.categoryName} • {item.bucketCode}
                      </p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
                    <span>Vence em {formatShortDate(item.dueDate)}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
                Nenhuma obrigação retornada para este mês. Cadastre obrigações para alimentar o painel.
              </div>
            )}
          </div>
        </PanelCard>

        <PanelCard tone="sky">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Buckets do planejamento</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Comparação direta entre planejado, pago e comprometido por grupo percentual.
          </p>

          <div className="mt-5 grid gap-4">
            {summaryQuery.data?.buckets?.length ? (
              summaryQuery.data.buckets.map((bucket) => {
                const usagePercent = getBucketUsagePercent(
                  bucket.plannedAmount,
                  bucket.paidAmount,
                  bucket.committedAmount,
                )

                return (
                  <article
                    key={bucket.bucketCode}
                    className="rounded-[1.5rem] border border-white/60 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/80"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{bucket.bucketName}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                          {bucket.bucketCode}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {usagePercent.toFixed(0)}% do planejado
                      </p>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-400"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                      <span>Planejado: {formatCurrency(bucket.plannedAmount)}</span>
                      <span>Pago: {formatCurrency(bucket.paidAmount)}</span>
                      <span>Comprometido: {formatCurrency(bucket.committedAmount)}</span>
                      <span>Restante: {formatCurrency(bucket.remainingAmount)}</span>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400">
                Nenhum bucket consolidado ainda. O setup financeiro e as obrigações do mês alimentam essa leitura.
              </div>
            )}
          </div>
        </PanelCard>
      </section>

      {!summaryQuery.data && !summaryQuery.isLoading ? (
        <PanelCard tone="amber">
          <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <p>
              O dashboard não retornou resumo para o mês atual. Isso normalmente acontece quando o setup existe, mas
              o ciclo ainda não tem obrigações ou dados consolidados.
            </p>
          </div>
        </PanelCard>
      ) : null}
    </div>
  )
}
