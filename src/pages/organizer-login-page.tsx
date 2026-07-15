import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '@app/providers/auth-context'

const ORGANIZER_TARGET_PATH = '/equipo-organizador/validacion-registro-fallido'

type OrganizerLoginLocationState = {
  from?: Location
  firebaseConfigured?: boolean
}

export function OrganizerLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { configured, errorMessage, loading, signIn, user } = useAuth()
  const state = location.state as OrganizerLoginLocationState | null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = state?.from?.pathname ?? ORGANIZER_TARGET_PATH

  useEffect(() => {
    if (!loading && user) {
      navigate(redirectTo, { replace: true })
    }
  }, [loading, navigate, redirectTo, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!configured) {
      toast.error('Firebase no está configurado en este entorno.')
      return
    }

    setIsSubmitting(true)

    try {
      await signIn(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No fue posible iniciar sesión.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="main-content registration-main-content">
        <section className="section section-alt registration-content-section">
          <div className="container">
            <div className="inscription-content">
              <div className="registration-card organizer-auth-card">
                <p className="registration-panel-subtitle">Preparando la sesión...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <main className="main-content registration-main-content">
      <section className="document-hero registration-hero">
        <div className="container">
          <h1 className="document-title">Acceso equipo organizador</h1>
        </div>
      </section>

      <section className="section section-alt registration-content-section">
        <div className="container">
          <div className="inscription-content">
            <div className="registration-card organizer-auth-card">
              <p className="failed-validation-internal-badge">Uso exclusivo: equipo organizador</p>
              <p className="registration-panel-subtitle">
                Inicia sesión para acceder a la validación de registros fallidos.
              </p>

              {!configured ? (
                <div className="registration-error organizer-auth-error">
                  Firebase no está configurado. Revisa las variables de entorno VITE_FIREBASE_*.
                </div>
              ) : null}

              {errorMessage ? <div className="registration-error organizer-auth-error">{errorMessage}</div> : null}

              <form onSubmit={handleSubmit} className="organizer-auth-form" noValidate>
                <label className="registration-field" htmlFor="organizerEmail">
                  <span className="registration-label">Correo electrónico</span>
                  <input
                    id="organizerEmail"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    className="registration-input"
                    autoComplete="email"
                    placeholder="correo@organizacion.cl"
                  />
                </label>

                <label className="registration-field" htmlFor="organizerPassword">
                  <span className="registration-label">Contraseña</span>
                  <input
                    id="organizerPassword"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    className="registration-input"
                    autoComplete="current-password"
                    placeholder="Ingresa tu contraseña"
                  />
                </label>

                <div className="registration-actions organizer-auth-actions">
                  <button type="submit" className="button button-primary" disabled={isSubmitting || !configured}>
                    {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
                  </button>
                </div>
              </form>

              <p className="organizer-auth-note">
                ¿No tienes acceso? Vuelve al <Link to="/">inicio del sitio</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
