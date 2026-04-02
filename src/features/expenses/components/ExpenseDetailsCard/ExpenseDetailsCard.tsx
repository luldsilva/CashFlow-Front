import { FileSpreadsheet, FileText, Paperclip, Pencil, Trash2 } from 'lucide-react'
import type { ChangeEvent } from 'react'
import type { ExpenseDetail } from '../../types'
import { paymentTypeOptions } from '../../types'
import { FieldInput } from '../../../../components/ui/FieldInput'
import { IconButton } from '../../../../components/ui/IconButton'
import { PanelCard } from '../../../../components/ui/PanelCard'
import {
  dashedEmptyStateClass,
  reportActionButtonClass,
  subtleInfoCardClass,
  subtleTextBlockClass,
} from '../expense-variants'
import { formatCurrency, formatDate } from '../../utils/formatters'

type ExpenseDetailsCardProps = {
  expense: ExpenseDetail | undefined
  isLoading: boolean
  reportMonth: string
  onEdit: () => void
  onDelete: () => void
  onAttachmentUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onReportMonthChange: (value: string) => void
  onDownloadReport: (kind: 'pdf' | 'excel') => void
}

export function ExpenseDetailsCard({
  expense,
  isLoading,
  reportMonth,
  onEdit,
  onDelete,
  onAttachmentUpload,
  onReportMonthChange,
  onDownloadReport,
}: ExpenseDetailsCardProps) {
  return (
    <PanelCard tone="sky">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            Despesa selecionada
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            {expense?.title ?? 'Nada selecionado'}
          </h2>
        </div>

        {expense ? (
          <div className="flex gap-2">
            <IconButton onClick={onEdit} title="Editar despesa">
              <Pencil size={18} />
            </IconButton>
            <IconButton onClick={onDelete} title="Excluir despesa" variant="danger">
              <Trash2 size={18} />
            </IconButton>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Carregando detalhes da despesa...</p>
      ) : null}

      {expense ? (
        <div className="mt-6 grid gap-5">
          <dl className={subtleInfoCardClass}>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Valor</dt>
              <dd className="font-semibold text-slate-950 dark:text-white">{formatCurrency(expense.amount)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Data</dt>
              <dd className="font-semibold text-slate-950 dark:text-white">{formatDate(expense.date)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500 dark:text-slate-400">Pagamento</dt>
              <dd className="font-semibold text-slate-950 dark:text-white">
                {paymentTypeOptions.find((option) => option.value === expense.paymentType)?.label}
              </dd>
            </div>
          </dl>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Descrição</p>
            <p className={subtleTextBlockClass}>{expense.description || 'Nenhuma descrição informada.'}</p>
          </div>

          <div className={subtleInfoCardClass}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Anexos</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Envie comprovantes, prints ou notas para esta despesa.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">
                <Paperclip size={16} />
                Enviar
                <input className="hidden" onChange={onAttachmentUpload} type="file" />
              </label>
            </div>

            <div className="mt-4 grid gap-3">
              {expense.attachments.map((attachment) => (
                <article
                  className="rounded-2xl border border-slate-200/80 bg-[#f8fbf9]/82 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                  key={attachment.id}
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{attachment.fileName}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {attachment.contentType} · {(attachment.sizeInBytes / 1024).toFixed(1)} KB
                  </p>
                </article>
              ))}

              {!expense.attachments.length ? (
                <p className={dashedEmptyStateClass}>Nenhum anexo ainda para esta despesa.</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-[#f5f9fa]/80 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-40 flex-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Relatórios
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Exporte um consolidado mensal em PDF ou Excel.
                </p>
              </div>

              <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                <span>Mês de referência</span>
                <FieldInput
                  onChange={(event) => onReportMonthChange(event.target.value)}
                  type="month"
                  value={reportMonth}
                />
              </label>

              <button
                className={reportActionButtonClass}
                onClick={() => onDownloadReport('pdf')}
                type="button"
              >
                <FileText size={16} />
                PDF
              </button>

              <button
                className={reportActionButtonClass}
                onClick={() => onDownloadReport('excel')}
                type="button"
              >
                <FileSpreadsheet size={16} />
                Excel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Selecione uma despesa na coluna da esquerda para ver detalhes e enviar arquivos.
        </div>
      )}
    </PanelCard>
  )
}
