import '../styles/registration-stepper.css'

export interface RegistrationStepperProps {
  currentStep: number
  totalSteps: number
}

export function RegistrationStepper({ currentStep, totalSteps }: RegistrationStepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="registration-stepper-container">
      <div className="stepper-progress">
        <span className="step-indicator">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="stepper-steps">
        {steps.map((step) => (
          <div
            key={step}
            className={`stepper-item ${
              step < currentStep ? 'completed' : step === currentStep ? 'active' : ''
            }`}
            aria-label={`Paso ${step}`}
          >
            <div className="stepper-badge">
              {step < currentStep ? <span className="check-mark">✓</span> : step}
            </div>
            <span className="stepper-label">Paso {step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
