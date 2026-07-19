import type { FocusEvent } from 'react'
import type { FormikProps } from 'formik'

import {
  RegistrationDietType,
  type RegistrationFormRegistrant,
  type RegistrationFormValues,
  type WorkshopsBySchedule,
} from '@features/registration/domain/entities/registration'

const NAME_ALLOWED_INPUT_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*$/
const MIN_RUT_BODY_LENGTH = 7
const MAX_RUT_BODY_LENGTH = 8
const MAX_RUT_LENGTH_WITHOUT_HYPHEN = MAX_RUT_BODY_LENGTH + 1

function isRutDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

function isRutVerifier(char: string): boolean {
  return char === 'k' || char === 'K'
}

function isRutInputAllowed(value: string): boolean {
  const separatorIndex = value.indexOf('-')

  if (separatorIndex !== value.lastIndexOf('-')) {
    return false
  }

  if (separatorIndex === -1) {
    if (value.length === 0) {
      return true
    }

    const lastChar = value.at(-1) ?? ''
    const body = value.slice(0, -1)

    if (isRutVerifier(lastChar)) {
      return (
        body.length >= MIN_RUT_BODY_LENGTH
        && body.length <= MAX_RUT_BODY_LENGTH
        && Array.from(body).every(isRutDigit)
      )
    }

    return value.length <= MAX_RUT_LENGTH_WITHOUT_HYPHEN && Array.from(value).every(isRutDigit)
  }

  const prefix = value.slice(0, separatorIndex)
  const suffix = value.slice(separatorIndex + 1)

  if (
    prefix.length < MIN_RUT_BODY_LENGTH
    || prefix.length > MAX_RUT_BODY_LENGTH
    || !Array.from(prefix).every(isRutDigit)
  ) {
    return false
  }

  if (suffix.length > 1) {
    return false
  }

  if (suffix.length === 0) {
    return true
  }

  const verifier = suffix.at(0)
  if (!verifier) {
    return false
  }
  return isRutDigit(verifier) || isRutVerifier(verifier)
}

const DIET_OPTIONS = [
  { value: RegistrationDietType.Traditional, label: 'Alimentación tradicional' },
  { value: RegistrationDietType.Vegetarian, label: 'Alimentación vegetariana' },
] as const

type ParticipantStepPanelProps = {
  formik: FormikProps<RegistrationFormValues>
  participantIndex: number
  currentStep: number
  showErrors: boolean
  workshopsBySchedule: WorkshopsBySchedule
  workshopsLoading: boolean
  withWorkshops?: boolean
  onParticipantRutBlur: (participant: number, event: FocusEvent<HTMLInputElement>) => Promise<void>
  onParticipantPhoneBlur: (participant: number, event: FocusEvent<HTMLInputElement>) => Promise<void>
  getEmailSuggestions: (rawEmail: string) => string[]
}

type ParticipantFormFieldsProps = {
  formik: FormikProps<RegistrationFormValues>
  participantIndex: number
  showErrors: boolean
  workshopsBySchedule: WorkshopsBySchedule
  workshopsLoading: boolean
  withWorkshops?: boolean
  participantErrors: Partial<Record<keyof RegistrationFormRegistrant, string>> | undefined
  emailSuggestions: string[]
  emailSuggestionsListId: string
  onParticipantRutBlur: (participant: number, event: FocusEvent<HTMLInputElement>) => Promise<void>
  onParticipantPhoneBlur: (participant: number, event: FocusEvent<HTMLInputElement>) => Promise<void>
}

type WorkshopFieldProps = {
  formik: FormikProps<RegistrationFormValues>
  participantIndex: number
  showErrors: boolean
  workshopsBySchedule: WorkshopsBySchedule
  workshopsLoading: boolean
  participantErrors: Partial<Record<keyof RegistrationFormRegistrant, string>> | undefined
}

function MorningWorkshopField({
  formik,
  participantIndex,
  showErrors,
  workshopsBySchedule,
  workshopsLoading,
  participantErrors,
}: Readonly<WorkshopFieldProps>) {
  return (
    <fieldset className="registration-field registration-field-wide registration-choice-group">
      <legend className="registration-label">Taller de la mañana</legend>
      <div className="registration-workshops-grid" aria-label="Talleres disponibles en la mañana">
        {workshopsLoading
          ? Array.from({ length: 3 }, (_, index) => (
              <div key={`am-skeleton-${index + 1}`} className="registration-workshop-skeleton" aria-hidden="true" />
            ))
          : null}

        {!workshopsLoading && workshopsBySchedule.am.length === 0 ? (
          <p className="registration-workshops-empty">No hay talleres disponibles en la mañana</p>
        ) : null}

        {!workshopsLoading
          ? workshopsBySchedule.am.map((option) => {
              const isSelected = formik.values.registrants[participantIndex]?.workshopAm === option.id
              return (
                <label key={option.id} className="registration-workshop-option" htmlFor={`registrants.${participantIndex}.workshopAm.${option.id}`}>
                  <input
                    id={`registrants.${participantIndex}.workshopAm.${option.id}`}
                    type="radio"
                    name={`registrants.${participantIndex}.workshopAm`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => {
                      formik.setFieldValue(`registrants.${participantIndex}.workshopAm`, option.id, true)
                      const currentPmId = formik.values.registrants[participantIndex]?.workshopPm
                      if (currentPmId) {
                        const pmIdWorkshop = workshopsBySchedule.pm.find((w) => w.id === currentPmId)?.idWorkshop
                        if (pmIdWorkshop && pmIdWorkshop === option.idWorkshop) {
                          formik.setFieldValue(`registrants.${participantIndex}.workshopPm`, '', true)
                        }
                      }
                    }}
                    onBlur={() => {
                      formik.setFieldTouched(`registrants.${participantIndex}.workshopAm`, true, true)
                    }}
                  />
                  <span>{option.workshop}</span>
                </label>
              )
            })
          : null}
      </div>
      {showErrors && participantErrors?.workshopAm ? <span className="registration-error">{participantErrors.workshopAm}</span> : null}
    </fieldset>
  )
}

function AfternoonWorkshopField({
  formik,
  participantIndex,
  showErrors,
  workshopsBySchedule,
  workshopsLoading,
  participantErrors,
}: Readonly<WorkshopFieldProps>) {
  const selectedAmIdWorkshop = workshopsBySchedule.am.find(
    (w) => w.id === formik.values.registrants[participantIndex]?.workshopAm,
  )?.idWorkshop

  return (
    <fieldset className="registration-field registration-field-wide registration-choice-group">
      <legend className="registration-label">Taller de la tarde</legend>
      <div className="registration-workshops-grid" aria-label="Talleres disponibles en la tarde">
        {workshopsLoading
          ? Array.from({ length: 3 }, (_, index) => (
              <div key={`pm-skeleton-${index + 1}`} className="registration-workshop-skeleton" aria-hidden="true" />
            ))
          : null}

        {!workshopsLoading && workshopsBySchedule.pm.length === 0 ? (
          <p className="registration-workshops-empty">No hay talleres disponibles en la tarde</p>
        ) : null}

        {!workshopsLoading
          ? workshopsBySchedule.pm.map((option) => {
              const isSelected = formik.values.registrants[participantIndex]?.workshopPm === option.id
              const isDisabled = Boolean(selectedAmIdWorkshop && option.idWorkshop === selectedAmIdWorkshop)

              return (
                <label key={option.id} className={`registration-workshop-option ${isDisabled ? 'is-disabled' : ''}`} htmlFor={`registrants.${participantIndex}.workshopPm.${option.id}`}>
                  <input
                    id={`registrants.${participantIndex}.workshopPm.${option.id}`}
                    type="radio"
                    name={`registrants.${participantIndex}.workshopPm`}
                    value={option.id}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => {
                      formik.setFieldValue(`registrants.${participantIndex}.workshopPm`, option.id, true)
                    }}
                    onBlur={() => {
                      formik.setFieldTouched(`registrants.${participantIndex}.workshopPm`, true, true)
                    }}
                  />
                  <span>{option.workshop}</span>
                </label>
              )
            })
          : null}
      </div>
      {showErrors && participantErrors?.workshopPm ? <span className="registration-error">{participantErrors.workshopPm}</span> : null}
    </fieldset>
  )
}

function ParticipantFormFields({
  formik,
  participantIndex,
  showErrors,
  workshopsBySchedule,
  workshopsLoading,
  withWorkshops = true,
  participantErrors,
  emailSuggestions,
  emailSuggestionsListId,
  onParticipantRutBlur,
  onParticipantPhoneBlur,
}: Readonly<ParticipantFormFieldsProps>) {
  return (
    <div className="registration-grid">
      <label className="registration-field" htmlFor={`registrants.${participantIndex}.rut`}>
        <span className="registration-label">RUT</span>
        <input
          id={`registrants.${participantIndex}.rut`}
          name={`registrants.${participantIndex}.rut`}
          type="text"
          placeholder="12345678-9"
          autoFocus
          value={formik.values.registrants[participantIndex]?.rut ?? ''}
          onChange={(event) => {
            const nextValue = event.currentTarget.value
            if (isRutInputAllowed(nextValue)) {
              formik.setFieldValue(`registrants.${participantIndex}.rut`, nextValue, true)
            }
          }}
          onBlur={(event) => {
            onParticipantRutBlur(participantIndex, event)
          }}
          className="registration-input"
          autoComplete="off"
        />
        {showErrors && participantErrors?.rut ? <span className="registration-error">{participantErrors.rut}</span> : null}
      </label>

      <label className="registration-field" htmlFor={`registrants.${participantIndex}.firstName`}>
        <span className="registration-label">Nombre</span>
        <input
          id={`registrants.${participantIndex}.firstName`}
          name={`registrants.${participantIndex}.firstName`}
          type="text"
          placeholder="Nombre"
          value={formik.values.registrants[participantIndex]?.firstName ?? ''}
          onChange={(event) => {
            const nextValue = event.currentTarget.value
            if (NAME_ALLOWED_INPUT_REGEX.test(nextValue)) {
              formik.setFieldValue(`registrants.${participantIndex}.firstName`, nextValue, true)
            }
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
          autoComplete="given-name"
        />
        {showErrors && participantErrors?.firstName ? <span className="registration-error">{participantErrors.firstName}</span> : null}
      </label>

      <label className="registration-field" htmlFor={`registrants.${participantIndex}.lastName`}>
        <span className="registration-label">Apellido</span>
        <input
          id={`registrants.${participantIndex}.lastName`}
          name={`registrants.${participantIndex}.lastName`}
          type="text"
          placeholder="Apellido"
          value={formik.values.registrants[participantIndex]?.lastName ?? ''}
          onChange={(event) => {
            const nextValue = event.currentTarget.value
            if (NAME_ALLOWED_INPUT_REGEX.test(nextValue)) {
              formik.setFieldValue(`registrants.${participantIndex}.lastName`, nextValue, true)
            }
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
          autoComplete="family-name"
        />
        {showErrors && participantErrors?.lastName ? <span className="registration-error">{participantErrors.lastName}</span> : null}
      </label>

      <label className="registration-field" htmlFor={`registrants.${participantIndex}.age`}>
        <span className="registration-label">Edad</span>
        <input
          id={`registrants.${participantIndex}.age`}
          name={`registrants.${participantIndex}.age`}
          type="number"
          min={12}
          max={120}
          placeholder="Edad"
          value={formik.values.registrants[participantIndex]?.age ?? ''}
          onChange={(event) => {
            formik.setFieldValue(`registrants.${participantIndex}.age`, event.currentTarget.value, true)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
          autoComplete="off"
        />
        {showErrors && participantErrors?.age ? <span className="registration-error">{participantErrors.age}</span> : null}
      </label>

      <label className="registration-field" htmlFor={`registrants.${participantIndex}.phone`}>
        <span className="registration-label">Telefono</span>
        <input
          id={`registrants.${participantIndex}.phone`}
          name={`registrants.${participantIndex}.phone`}
          type="tel"
          placeholder="+56912345678"
          value={formik.values.registrants[participantIndex]?.phone ?? ''}
          onChange={(event) => {
            formik.setFieldValue(`registrants.${participantIndex}.phone`, event.currentTarget.value, true)
          }}
          onBlur={(event) => {
            onParticipantPhoneBlur(participantIndex, event)
          }}
          className="registration-input"
          autoComplete="tel"
        />
        {showErrors && participantErrors?.phone ? <span className="registration-error">{participantErrors.phone}</span> : null}
      </label>

      <label className="registration-field" htmlFor={`registrants.${participantIndex}.email`}>
        <span className="registration-label">Email</span>
        <input
          id={`registrants.${participantIndex}.email`}
          name={`registrants.${participantIndex}.email`}
          type="email"
          placeholder="correo@ejemplo.cl"
          value={formik.values.registrants[participantIndex]?.email ?? ''}
          onChange={(event) => {
            formik.setFieldValue(`registrants.${participantIndex}.email`, event.currentTarget.value, true)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
          autoComplete="email"
          list={emailSuggestionsListId}
        />
        <datalist id={emailSuggestionsListId}>
          {emailSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        {showErrors && participantErrors?.email ? <span className="registration-error">{participantErrors.email}</span> : null}
      </label>

      <fieldset className="registration-field registration-choice-group">
        <legend className="registration-label">Alimentación</legend>
        <div className="registration-radio-group">
          {DIET_OPTIONS.map((dietOption) => (
            <label key={dietOption.value} className="registration-radio-option" htmlFor={`registrants.${participantIndex}.dietType.${dietOption.value}`}>
              <input
                id={`registrants.${participantIndex}.dietType.${dietOption.value}`}
                type="radio"
                name={`registrants.${participantIndex}.dietType`}
                value={dietOption.value}
                checked={formik.values.registrants[participantIndex]?.dietType === dietOption.value}
                onChange={(event) => {
                  formik.setFieldValue(`registrants.${participantIndex}.dietType`, event.currentTarget.value, true)
                }}
                onBlur={formik.handleBlur}
              />
              <span>{dietOption.label}</span>
            </label>
          ))}
        </div>
        {showErrors && participantErrors?.dietType ? <span className="registration-error">{participantErrors.dietType}</span> : null}
      </fieldset>

      <fieldset className="registration-field registration-choice-group">
        <legend className="registration-label">Alojamiento</legend>
        <label className="registration-checkbox-option" htmlFor={`registrants.${participantIndex}.needsAccommodation`}>
          <input
            id={`registrants.${participantIndex}.needsAccommodation`}
            name={`registrants.${participantIndex}.needsAccommodation`}
            type="checkbox"
            checked={formik.values.registrants[participantIndex]?.needsAccommodation ?? false}
            onChange={(event) => {
              formik.setFieldValue(
                `registrants.${participantIndex}.needsAccommodation`,
                event.currentTarget.checked,
                true,
              )
            }}
            onBlur={formik.handleBlur}
          />
          <span>La participante necesita alojamiento.</span>
        </label>
      </fieldset>

      {withWorkshops && (
        <>
          <MorningWorkshopField
            formik={formik}
            participantIndex={participantIndex}
            showErrors={showErrors}
            workshopsBySchedule={workshopsBySchedule}
            workshopsLoading={workshopsLoading}
            participantErrors={participantErrors}
          />
          <AfternoonWorkshopField
            formik={formik}
            participantIndex={participantIndex}
            showErrors={showErrors}
            workshopsBySchedule={workshopsBySchedule}
            workshopsLoading={workshopsLoading}
            participantErrors={participantErrors}
          />
        </>
      )}
    </div>
  )
}

export function RegistrationParticipantStepPanel({
  formik,
  participantIndex,
  currentStep,
  showErrors,
  workshopsBySchedule,
  workshopsLoading,
  withWorkshops = true,
  onParticipantRutBlur,
  onParticipantPhoneBlur,
  getEmailSuggestions,
}: Readonly<ParticipantStepPanelProps>) {
  const participantErrors = formik.errors.registrants?.[participantIndex] as
    | Partial<Record<keyof RegistrationFormRegistrant, string>>
    | undefined

  const emailSuggestions = getEmailSuggestions(formik.values.registrants[participantIndex]?.email ?? '')
  const emailSuggestionsListId = `registrants.${participantIndex}.email-suggestions`

  return (
    <section className="registration-panel" aria-labelledby="step-participante-title">
      <h3 id="step-participante-title" className="registration-panel-title">
        {participantIndex === 0 ? 'Datos de la persona principal' : `Datos de la participante ${currentStep}`}
      </h3>
      <p className="registration-panel-subtitle">
        Completa los datos exactamente como aparecen en los documentos oficiales.
      </p>
      <ParticipantFormFields
        formik={formik}
        participantIndex={participantIndex}
        showErrors={showErrors}
        workshopsBySchedule={workshopsBySchedule}
        workshopsLoading={workshopsLoading}
        withWorkshops={withWorkshops}
        participantErrors={participantErrors}
        emailSuggestions={emailSuggestions}
        emailSuggestionsListId={emailSuggestionsListId}
        onParticipantRutBlur={onParticipantRutBlur}
        onParticipantPhoneBlur={onParticipantPhoneBlur}
      />
    </section>
  )
}
