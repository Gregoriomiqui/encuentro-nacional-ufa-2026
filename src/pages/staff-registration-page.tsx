import { StaffRegistrationWizard } from '@features/registration/presentation/components/staff-registration-wizard'

export function StaffRegistrationPage() {
  return (
    <main className="main-content registration-main-content">
      <section className="document-hero registration-hero">
        <div className="container">
          <h1 className="document-title">Inscripción Staff — Encuentro Nacional UFA 2026</h1>
        </div>
      </section>

      <section className="section section-alt registration-content-section">
        <div className="container">
          <div className="inscription-content">
            <StaffRegistrationWizard />
          </div>
        </div>
      </section>
    </main>
  )
}
