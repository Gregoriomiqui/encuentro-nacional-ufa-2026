import { useRegistration } from '../hooks'
import { RegistrationCountStepPanel } from './registration-count-step-panel'
import { RegistrationParticipantStepPanel } from './registration-participant-step-panel'
import { RegistrationPaymentStepPanel } from './registration-payment-step-panel'
import { RegistrationStepper } from './registration-stepper'
import { RegistrationSuccessStepPanel } from './registration-success-step-panel'
import { RegistrationWelcome } from './registration-welcome'

export function RegistrationWizard() {
  const {
    formik,
    currentStep,
    finalStep,
    totalParticipants,
    companionCount,
    participantIndex,
    totalAmount,
    isParticipantStep,
    isLoading,
    isSuccessScreenVisible,
    redirectCountdownSeconds,
    showParticipantErrors,
    workshopsBySchedule,
    workshopsRequestState,
    handleReceiptChange,
    getEmailSuggestions,
    setCompanionCount,
    onParticipantRutBlur,
    onParticipantPhoneBlur,
    goToNextStep,
    goToPreviousStep,
  } = useRegistration()

  let currentPanel = <RegistrationPaymentStepPanel formik={formik} totalAmount={totalAmount} onReceiptChange={handleReceiptChange} />

  if (currentStep === 0) {
    currentPanel = (
      <RegistrationCountStepPanel
        formik={formik}
        companionCount={companionCount}
        totalParticipants={totalParticipants}
        totalAmount={totalAmount}
        setCompanionCount={setCompanionCount}
      />
    )
  }

  if (isParticipantStep) {
    currentPanel = (
      <RegistrationParticipantStepPanel
        formik={formik}
        participantIndex={participantIndex}
        currentStep={currentStep}
        showErrors={showParticipantErrors}
        workshopsBySchedule={workshopsBySchedule}
        workshopsLoading={workshopsRequestState === 'loading'}
        onParticipantRutBlur={onParticipantRutBlur}
        onParticipantPhoneBlur={onParticipantPhoneBlur}
        getEmailSuggestions={getEmailSuggestions}
      />
    )
  }

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
        <>
          <RegistrationStepper currentStep={currentStep + 1} totalSteps={finalStep + 1} />

          {currentStep === 0 && <RegistrationWelcome />}

          <form className="registration-card" onSubmit={formik.handleSubmit} noValidate>
            {currentPanel}

            <div className="registration-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  goToPreviousStep()
                }}
                disabled={currentStep === 0 || formik.isSubmitting}
              >
                Anterior
              </button>

              {currentStep < finalStep ? (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    goToNextStep()
                  }}
                  disabled={formik.isSubmitting}
                >
                  Siguiente
                </button>
              ) : (
                <button type="submit" className="button button-primary" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Enviando...' : 'Enviar inscripción'}
                </button>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  )
}
