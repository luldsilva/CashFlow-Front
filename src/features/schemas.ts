import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'A senha é obrigatória'),
})

export const registerSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
})

export const expenseSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string(),
  date: z.string().min(1, 'A data é obrigatória'),
  amount: z.coerce.number().positive('O valor deve ser maior que zero'),
  paymentType: z.coerce.number().int().min(0).max(3),
})
