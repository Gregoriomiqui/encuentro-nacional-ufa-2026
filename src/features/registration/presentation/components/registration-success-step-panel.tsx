type SuccessStepPanelProps = {
  redirectCountdownSeconds: number
}

export function RegistrationSuccessStepPanel({ redirectCountdownSeconds }: Readonly<SuccessStepPanelProps>) {
  return (
    <section className="registration-success-panel" aria-live="polite" aria-labelledby="registration-success-title">
      <span className="registration-success-badge">Inscripción completada</span>
      <h3 id="registration-success-title" className="registration-success-title">
        ¡Registro exitoso!
      </h3>
      <p className="registration-success-text">
        Hemos recibido tu inscripción correctamente.
      </p>
      <p className="registration-success-text">
        En {redirectCountdownSeconds} segundos volverás al inicio del módulo de inscripción.
      </p>
    </section>
  )
}
