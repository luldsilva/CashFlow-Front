import { Controller, type Control, type FieldErrors, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form'
import type { ChangeEvent } from 'react'
import { FieldInput } from '../../../../components/ui/FieldInput'
import { FieldSelect } from '../../../../components/ui/FieldSelect'
import { FieldTextarea } from '../../../../components/ui/FieldTextarea'
import { FormField } from '../../../../components/ui/FormField'
import { PanelCard } from '../../../../components/ui/PanelCard'
import { PrimaryButton } from '../../../../components/ui/PrimaryButton'
import { paymentTypeOptions, type ExpenseDetail } from '../../types'
import type { z } from 'zod'
import { expenseSchema } from '../../../schemas'

type ExpenseFormInput = z.input<typeof expenseSchema>
type ExpenseFormOutput = z.output<typeof expenseSchema>

type ExpenseFormCardProps = {
  editingExpense: ExpenseDetail | null
  attachmentFile: File | null
  errors: FieldErrors<ExpenseFormInput>
  control: Control<ExpenseFormInput, unknown, ExpenseFormOutput>
  register: UseFormRegister<ExpenseFormInput>
  handleSubmit: UseFormHandleSubmit<ExpenseFormInput, ExpenseFormOutput>
  isSubmitting: boolean
  isBusy: boolean
  onSubmit: (values: ExpenseFormOutput) => Promise<void>
  onAttachmentSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onCancelEdit: () => void
}

export function ExpenseFormCard({
  editingExpense,
  attachmentFile,
  errors,
  control,
  register,
  handleSubmit,
  isSubmitting,
  isBusy,
  onSubmit,
  onAttachmentSelect,
  onCancelEdit,
}: ExpenseFormCardProps) {
  return (
    <PanelCard tone="amber">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-amber-600 dark:text-amber-300">
          {editingExpense ? 'Editar despesa' : 'Nova despesa'}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
          {editingExpense ? editingExpense.title : 'Cadastrar uma nova despesa'}
        </h2>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Título" error={errors.title?.message}>
          <FieldInput placeholder="Mercado, Uber, Netflix..." {...register('title')} />
        </FormField>

        <FormField label="Valor" error={errors.amount?.message}>
          <FieldInput step="0.01" type="number" {...register('amount', { valueAsNumber: true })} />
        </FormField>

        <FormField label="Data" error={errors.date?.message}>
          <FieldInput type="date" {...register('date')} />
        </FormField>

        <FormField label="Forma de pagamento" error={errors.paymentType?.message}>
          <Controller
            control={control}
            name="paymentType"
            render={({ field }) => (
              <FieldSelect
                value={Number(field.value ?? 0)}
                onChange={(event) => field.onChange(Number(event.target.value))}
              >
                {paymentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FieldSelect>
            )}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Descrição" error={errors.description?.message}>
            <FieldTextarea placeholder="Contexto rápido sobre essa despesa" {...register('description')} />
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField label={editingExpense ? 'Novo anexo opcional' : 'Anexo opcional'}>
            <label className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-amber-300 bg-[#efe2c8]/72 px-4 py-4 text-sm text-slate-600 transition hover:border-amber-400 hover:bg-[#f3e7cf]/86 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-400/60">
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {attachmentFile
                  ? `Arquivo selecionado: ${attachmentFile.name}`
                  : 'Selecione uma imagem, PDF ou comprovante para vincular à despesa'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                O arquivo será enviado automaticamente após salvar a despesa.
              </span>
              <input className="hidden" onChange={onAttachmentSelect} type="file" />
            </label>
          </FormField>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <PrimaryButton busy={isSubmitting || isBusy} type="submit">
            {editingExpense ? 'Salvar alterações' : 'Criar despesa'}
          </PrimaryButton>

          {editingExpense ? (
            <button
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              onClick={onCancelEdit}
              type="button"
            >
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>
    </PanelCard>
  )
}
