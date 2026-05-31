import { RegistrationWizard } from '@features/registration/presentation/components/registration-wizard'

export function RegistrationPage() {
  return (
    <main className="main-content">
      <section className="document-hero">
        <div className="container">
          <h1 className="document-title">Inscripción Encuentro Nacional UFA 2026</h1>
          <p className="document-subtitle">Completa tus datos, carga comprobante y confirma tu participacion</p>
          <p className="document-date">Valor por participante: $50.000 CLP</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="inscription-content">
            <RegistrationWizard />
          </div>
        </div>
      </section>
    </main>
  )
}
