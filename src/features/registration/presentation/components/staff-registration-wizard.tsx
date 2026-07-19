import { useStaffRegistration } from '../hooks/useStaffRegistration'
import { RegistrationSuccessStepPanel } from './registration-success-step-panel'
import { StaffRegistrationPanel } from './staff-registration-panel'

export function StaffRegistrationWizard() {
  const {
    formik,
    isLoading,
    isSuccessScreenVisible,
    redirectCountdownSeconds,
    onRutBlur,
    onPhoneBlur,
    getEmailSuggestions,
    dietOptions,
  } = useStaffRegistration()

  return (
    <div className="registration-module">
      {isLoading && (
        <div className="registration-overlay" aria-live="assertive" role="alert">
          <div className="registration-overlay-content">
            <div className="registration-spinner" aria-hidden="true" />
            <p className="registration-overlay-title">Procesando tu inscripción...</p>
            <p className="registration-overlay-warning">Por favor no refresques ni cambies de pantalla.</p>
          </div>
        </div>
      )}

      {isSuccessScreenVisible ? (
        <div className="registration-card">
          <RegistrationSuccessStepPanel redirectCountdownSeconds={redirectCountdownSeconds} />
        </div>
      ) : (
        <form className="registration-card" onSubmit={formik.handleSubmit} noValidate>
          <StaffRegistrationPanel
            formik={formik}
            dietOptions={dietOptions}
            onRutBlur={onRutBlur}
            onPhoneBlur={onPhoneBlur}
            getEmailSuggestions={getEmailSuggestions}
          />

          <div className="registration-actions">
            <button type="submit" className="button button-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Enviando...' : 'Enviar inscripción'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
