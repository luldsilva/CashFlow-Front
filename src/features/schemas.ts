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

export const forgotPasswordSchema = z.object({
  email: z.email('Informe um e-mail válido'),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmNewPassword: z.string().min(8, 'A confirmação deve ter pelo menos 8 caracteres'),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: 'A confirmação da senha precisa ser igual à nova senha',
    path: ['confirmNewPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'A senha atual é obrigatória'),
    newPassword: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres'),
    confirmNewPassword: z.string().min(8, 'A confirmação deve ter pelo menos 8 caracteres'),
  })
  .refine((values) => values.newPassword === values.confirmNewPassword, {
    message: 'A confirmação da senha precisa ser igual à nova senha',
    path: ['confirmNewPassword'],
  })

export const expenseSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string(),
  date: z.string().min(1, 'A data é obrigatória'),
  amount: z.coerce.number().positive('O valor deve ser maior que zero'),
  paymentType: z.coerce.number().int().min(0).max(3),
})
