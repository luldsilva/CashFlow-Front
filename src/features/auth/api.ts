import { api } from '../../lib/api'

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  token: string
  newPassword: string
  confirmNewPassword: string
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  await api.post('/User/forgot-password', payload, {
    validateStatus: (status) => status === 204,
  })
}

export async function resetPassword(payload: ResetPasswordPayload) {
  await api.post('/User/reset-password', payload)
}

export async function changePassword(payload: ChangePasswordPayload) {
  await api.post('/User/change-password', payload)
}
