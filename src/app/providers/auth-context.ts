import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  configured: boolean
  errorMessage: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }

  return context
}
