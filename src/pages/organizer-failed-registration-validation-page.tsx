import { FailedRegistrationValidationForm } from '@features/failed-registration-validation/presentation/components/failed-registration-validation-form'
import { useAuth } from '@app/providers/auth-context'

export function OrganizerFailedRegistrationValidationPage() {
  const { signOut, user } = useAuth()

  return (
    <main className="main-content registration-main-content">
      <section className="document-hero registration-hero">
        <div className="container">
          <h1 className="document-title">Validación interna de registros fallidos</h1>
        </div>
      </section>

      <section className="section section-alt registration-content-section">
        <div className="container">
          <div className="inscription-content">
            <div className="organizer-session-bar">
              <p className="organizer-session-text">Sesión activa como {user?.email ?? 'organizador'}</p>
              <button type="button" className="button button-secondary organizer-signout-button" onClick={() => void signOut()}>
                Cerrar sesión
              </button>
            </div>

            <div className="registration-secondary-module">
              <FailedRegistrationValidationForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
