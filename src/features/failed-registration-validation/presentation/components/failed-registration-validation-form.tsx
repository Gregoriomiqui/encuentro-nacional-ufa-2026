import { useState } from 'react'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'

import type { FailedRegistrationValidationFormValues } from '@features/failed-registration-validation/domain/entities/failed-registration-validation'
import { validateFailedRegistration } from '@features/failed-registration-validation/application/use-cases/validate-failed-registration.use-case'

import '../styles/failed-registration-validation-form.css'

const REGISTRATION_ID_REGEX = /^[A-Za-z0-9-_]{3,64}$/

function validateForm(values: FailedRegistrationValidationFormValues) {
  const errors: Partial<Record<keyof FailedRegistrationValidationFormValues, string>> = {}

  const registrationId = values.registrationId.trim()

  if (!registrationId) {
    errors.registrationId = 'El id de registro es obligatorio.'
  } else if (!REGISTRATION_ID_REGEX.test(registrationId)) {
    errors.registrationId = 'El id de registro solo puede contener letras, numeros, guion y guion bajo.'
  }

  return errors
}

export function FailedRegistrationValidationForm() {
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik<FailedRegistrationValidationFormValues>({
    initialValues: {
      registrationId: '',
    },
    validateOnBlur: true,
    validateOnChange: false,
    validate: validateForm,
    onSubmit: async (values, helpers) => {
      setIsLoading(true)

      try {
        const result = await validateFailedRegistration(values)
        toast.success(result.apiResponse.message)
        helpers.resetForm()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No fue posible validar el registro en este momento.')
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <section className="failed-validation-module" aria-labelledby="failed-validation-title">
      {isLoading && (
        <div className="registration-overlay" aria-live="assertive" role="alert">
          <div className="registration-overlay-content">
            <div className="registration-spinner" aria-hidden="true" />
            <p className="registration-overlay-title">Validando registro...</p>
            <p className="registration-overlay-warning">Por favor no refresques ni cambies de pantalla.</p>
          </div>
        </div>
      )}
      <div className="registration-card failed-validation-card">
        <p className="failed-validation-internal-badge">Uso exclusivo: equipo organizador</p>

        <h3 id="failed-validation-title" className="registration-panel-title">
          Validar registro fallido
        </h3>

        <p className="registration-panel-subtitle">
          Ingresa el id de registro para validar y procesar la inscripcion con incidencia.
        </p>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="registration-grid failed-validation-grid">
            <label className="registration-field" htmlFor="registrationId">
              <span className="registration-label">Id de registro</span>
              <input
                id="registrationId"
                name="registrationId"
                type="text"
                value={formik.values.registrationId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="registration-input"
                placeholder="Ej: REG-2026-001"
                autoComplete="off"
              />
              {formik.touched.registrationId && formik.errors.registrationId ? (
                <span className="registration-error">{formik.errors.registrationId}</span>
              ) : null}
            </label>


          </div>

          <div className="registration-actions failed-validation-actions">
            <button type="submit" className="button button-primary" disabled={isLoading || formik.isSubmitting}>
              {isLoading || formik.isSubmitting ? 'Validando...' : 'Validar registro'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
