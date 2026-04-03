import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from './features/auth/auth-context'
import { ThemeProvider } from './components/theme-provider'
import { ToastProvider } from './components/toast-provider'
import { LoginPage } from './pages/login-page'
import { RegisterPage } from './pages/register-page'
import { ForgotPasswordPage } from './pages/forgot-password-page'
import { ResetPasswordPage } from './pages/reset-password-page'
import { FinancialShell } from './features/financial/components/financial-shell'
import { DashboardPage } from './pages/dashboard-page'
import { FinancialSetupPage } from './pages/financial-setup-page'
import { ObligationsPage } from './pages/obligations-page'
import { CreditCardsPage } from './pages/credit-cards-page'
import { MonthlyReviewPage } from './pages/monthly-review-page'
import { SecuritySettingsPage } from './pages/security-settings-page'

function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicOnlyRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPasswordPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <FinancialShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="setup" element={<FinancialSetupPage />} />
          <Route path="obligations" element={<ObligationsPage />} />
          <Route path="credit-cards" element={<CreditCardsPage />} />
          <Route path="monthly-review" element={<MonthlyReviewPage />} />
          <Route path="settings/security" element={<SecuritySettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    [],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
