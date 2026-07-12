import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@app/providers/auth-context'

function OrganizerLoadingState() {
  return (
    <main className="main-content registration-main-content">
      <section className="section section-alt registration-content-section">
        <div className="container">
          <div className="inscription-content">
            <div className="registration-card organizer-auth-card">
              <p className="registration-panel-subtitle">Validando acceso del equipo organizador...</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export function OrganizerRouteGuard({ children }: Readonly<PropsWithChildren>) {
  const location = useLocation()
  const { configured, loading, user } = useAuth()

  if (!configured) {
    return <Navigate to="/equipo-organizador/login" replace state={{ from: location, firebaseConfigured: false }} />
  }

  if (loading) {
    return <OrganizerLoadingState />
  }

  if (!user) {
    return <Navigate to="/equipo-organizador/login" replace state={{ from: location }} />
  }

  return children
}
