import { RegistrationWizard } from '@features/registration/presentation/components/registration-wizard'

export function RegistrationPage() {
  return (
    <main className="main-content registration-main-content">
      <section className="document-hero registration-hero">
        <div className="container">
          <h1 className="document-title">Inscripción Encuentro Nacional UFA 2026</h1>
        </div>
      </section>

      <section className="section section-alt registration-content-section">
        <div className="container">
          <div className="inscription-content">
            <RegistrationWizard />
          </div>
        </div>
      </section>
    </main>
  )
}
