import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'

import { AuthContext, type AuthContextValue } from '@app/providers/auth-context'
import { getFirebaseAuth, isFirebaseConfigured } from '@shared/lib/firebase/firebase'

function getAuthErrorMessage(error: unknown): string {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return 'No fue posible iniciar sesión. Intenta nuevamente.'
  }

  const code = String((error as { code?: string }).code ?? '')

  if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
    return 'Correo o contraseña incorrectos.'
  }

  if (code === 'auth/too-many-requests') {
    return 'Demasiados intentos. Espera un momento e intenta nuevamente.'
  }

  return 'No fue posible iniciar sesión. Intenta nuevamente.'
}

export function AuthProvider({ children }: Readonly<PropsWithChildren>) {
  const configured = isFirebaseConfigured()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(configured)
  const [errorMessage, setErrorMessage] = useState<string | null>(configured ? null : 'Faltan variables de entorno de Firebase.')

  useEffect(() => {
    if (!configured) {
      return
    }

    const auth = getFirebaseAuth()
    let unsubscribe = () => {}
    let isActive = true

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        if (!isActive) {
          return
        }

        unsubscribe = onAuthStateChanged(auth, (nextUser) => {
          setUser(nextUser)
          setLoading(false)
        })
      })
      .catch((error) => {
        if (!isActive) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'No fue posible preparar la sesión de Firebase.')
        setLoading(false)
      })

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [configured])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured,
      errorMessage,
      signIn: async (email: string, password: string) => {
        const auth = getFirebaseAuth()

        try {
          await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
          throw new Error(getAuthErrorMessage(error), { cause: error })
        }
      },
      signOut: async () => {
        if (!configured) {
          return
        }

        await signOut(getFirebaseAuth())
      },
    }),
    [configured, errorMessage, loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
