import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { api, setAuthorizationToken } from '../../lib/api'
import type { AuthUser, LoginPayload, RegisterPayload } from './types'

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<AuthUser>
  register: (payload: RegisterPayload) => Promise<AuthUser>
  logout: () => void
}

const STORAGE_KEY = 'cashflow-front-auth'
const AuthContext = createContext<AuthContextValue | null>(null)

function decodeTokenRole(token: string) {
  try {
    const [, payload] = token.split('.')

    if (!payload) {
      return undefined
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))) as Record<
      string,
      string
    >

    return (
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      decoded.role ??
      decoded.Role
    )
  } catch {
    return undefined
  }
}

function normalizeUser(user: AuthUser) {
  return {
    ...user,
    role: user.role ?? decodeTokenRole(user.token),
  }
}

function persistUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function readPersistedUser() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const persistedUser = readPersistedUser()
    return persistedUser ? normalizeUser(persistedUser) : null
  })

  useEffect(() => {
    setAuthorizationToken(user?.token ?? null)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      async login(payload) {
        const { data } = await api.post<AuthUser>('/Login', payload)
        const normalizedUser = normalizeUser(data)
        setUser(normalizedUser)
        persistUser(normalizedUser)
        setAuthorizationToken(normalizedUser.token)
        return normalizedUser
      },
      async register(payload) {
        const { data } = await api.post<AuthUser>('/User', payload)
        const normalizedUser = normalizeUser(data)
        setUser(normalizedUser)
        persistUser(normalizedUser)
        setAuthorizationToken(normalizedUser.token)
        return normalizedUser
      },
      logout() {
        setUser(null)
        persistUser(null)
        setAuthorizationToken(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
