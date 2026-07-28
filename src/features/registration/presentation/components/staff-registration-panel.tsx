import type { FocusEvent } from 'react'
import type { FormikProps } from 'formik'
import { Link } from 'react-router-dom'

import { DISTRICT_NAMES, getChurchesByDistrict } from '@features/registration/domain/entities/church-directory'
import type { StaffRegistrationFormValues, StaffType } from '@features/registration/domain/entities/staff-registration'
import type { RegistrationDietType } from '@features/registration/domain/entities/registration'

const NAME_ALLOWED_INPUT_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*$/
const MIN_RUT_BODY_LENGTH = 7
const MAX_RUT_BODY_LENGTH = 8

function isRutDigit(char: string): boolean { return char >= '0' && char <= '9' }
function isRutVerifier(char: string): boolean { return char === 'k' || char === 'K' }

function isRutInputAllowed(value: string): boolean {
  const separatorIndex = value.indexOf('-')
  if (separatorIndex !== value.lastIndexOf('-')) return false
  if (separatorIndex === -1) {
    if (value.length === 0) return true
    const lastChar = value.at(-1) ?? ''
    const body = value.slice(0, -1)
    if (isRutVerifier(lastChar)) {
      return body.length >= MIN_RUT_BODY_LENGTH && body.length <= MAX_RUT_BODY_LENGTH && Array.from(body).every(isRutDigit)
    }
    return value.length <= MAX_RUT_BODY_LENGTH + 1 && Array.from(value).every(isRutDigit)
  }
  const prefix = value.slice(0, separatorIndex)
  const suffix = value.slice(separatorIndex + 1)
  if (prefix.length < MIN_RUT_BODY_LENGTH || prefix.length > MAX_RUT_BODY_LENGTH || !Array.from(prefix).every(isRutDigit)) return false
  if (suffix.length > 1) return false
  if (suffix.length === 0) return true
  const verifier = suffix.at(0)
  if (!verifier) return false
  return isRutDigit(verifier) || isRutVerifier(verifier)
}

type StaffRegistrationPanelProps = {
  formik: FormikProps<StaffRegistrationFormValues>
  staffTypeOptions: ReadonlyArray<{ value: StaffType; label: string }>
  dietOptions: ReadonlyArray<{ value: RegistrationDietType; label: string }>
  onRutBlur: (event: FocusEvent<HTMLInputElement>) => Promise<void>
  onPhoneBlur: (event: FocusEvent<HTMLInputElement>) => Promise<void>
  getEmailSuggestions: (rawEmail: string) => string[]
}

export function StaffRegistrationPanel({
  formik,
  staffTypeOptions,
  dietOptions,
  onRutBlur,
  onPhoneBlur,
  getEmailSuggestions,
}: Readonly<StaffRegistrationPanelProps>) {
  const churches = getChurchesByDistrict(formik.values.districtName)
  const emailSuggestions = getEmailSuggestions(formik.values.email)
  const { errors, touched } = formik

  function fieldError(field: keyof StaffRegistrationFormValues) {
    return touched[field] && errors[field] ? <span className="registration-error">{errors[field]}</span> : null
  }

  return (
    <section className="registration-panel" aria-labelledby="step-staff-title">
      <h3 id="step-staff-title" className="registration-panel-title">
        Datos del staff
      </h3>
      <p className="registration-panel-subtitle">
        Completa tus datos exactamente como aparecen en los documentos oficiales.
      </p>

      <div className="registration-grid">
        <label className="registration-field" htmlFor="districtName">
          <span className="registration-label">Distrito</span>
          <select
            id="districtName"
            name="districtName"
            autoFocus
            value={formik.values.districtName}
            onChange={(e) => {
              formik.setFieldValue('districtName', e.currentTarget.value, false)
              formik.setFieldValue('churchOrigin', '', false)
            }}
            onBlur={formik.handleBlur}
            className="registration-input"
          >
            <option value="">Selecciona un distrito</option>
            {DISTRICT_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          {fieldError('districtName')}
        </label>

        <label className="registration-field" htmlFor="churchOrigin">
          <span className="registration-label">Iglesia de origen</span>
          <input
            id="churchOrigin"
            name="churchOrigin"
            type="text"
            value={formik.values.churchOrigin}
            onChange={(e) => formik.setFieldValue('churchOrigin', e.currentTarget.value, false)}
            onBlur={formik.handleBlur}
            className="registration-input"
            placeholder={formik.values.districtName ? 'Busca y selecciona tu iglesia' : 'Primero selecciona un distrito'}
            autoComplete="organization"
            list="staff-church-origin-list"
            disabled={!formik.values.districtName}
          />
          <datalist id="staff-church-origin-list">
            {churches.map((church) => <option key={church} value={church} />)}
          </datalist>
          {fieldError('churchOrigin')}
        </label>

        <label className="registration-field" htmlFor="rut">
          <span className="registration-label">RUT</span>
          <input
            id="rut"
            name="rut"
            type="text"
            placeholder="12345678-5"
            value={formik.values.rut}
            onChange={(e) => {
              if (isRutInputAllowed(e.currentTarget.value)) {
                formik.setFieldValue('rut', e.currentTarget.value, true)
              }
            }}
            onBlur={onRutBlur}
            className="registration-input"
            autoComplete="off"
          />
          {fieldError('rut')}
        </label>

        <label className="registration-field" htmlFor="firstName">
          <span className="registration-label">Nombre</span>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Nombre"
            value={formik.values.firstName}
            onChange={(e) => {
              if (NAME_ALLOWED_INPUT_REGEX.test(e.currentTarget.value)) {
                formik.setFieldValue('firstName', e.currentTarget.value, true)
              }
            }}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="given-name"
          />
          {fieldError('firstName')}
        </label>

        <label className="registration-field" htmlFor="lastName">
          <span className="registration-label">Apellido</span>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Apellido"
            value={formik.values.lastName}
            onChange={(e) => {
              if (NAME_ALLOWED_INPUT_REGEX.test(e.currentTarget.value)) {
                formik.setFieldValue('lastName', e.currentTarget.value, true)
              }
            }}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="family-name"
          />
          {fieldError('lastName')}
        </label>

        <label className="registration-field" htmlFor="age">
          <span className="registration-label">Edad</span>
          <input
            id="age"
            name="age"
            type="number"
            min={12}
            max={120}
            placeholder="Edad"
            value={formik.values.age}
            onChange={(e) => formik.setFieldValue('age', e.currentTarget.value, true)}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="off"
          />
          {fieldError('age')}
        </label>

        <label className="registration-field" htmlFor="phone">
          <span className="registration-label">Teléfono</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+56912345678"
            value={formik.values.phone}
            onChange={(e) => formik.setFieldValue('phone', e.currentTarget.value, true)}
            onBlur={onPhoneBlur}
            className="registration-input"
            autoComplete="tel"
          />
          {fieldError('phone')}
        </label>

        <label className="registration-field" htmlFor="email">
          <span className="registration-label">Email</span>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.cl"
            value={formik.values.email}
            onChange={(e) => formik.setFieldValue('email', e.currentTarget.value, true)}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="email"
            list="staff-email-suggestions"
          />
          <datalist id="staff-email-suggestions">
            {emailSuggestions.map((s) => <option key={s} value={s} />)}
          </datalist>
          {fieldError('email')}
        </label>

        <label className="registration-field" htmlFor="staffType">
          <span className="registration-label">Tipo de staff</span>
          <select
            id="staffType"
            name="staffType"
            value={formik.values.staffType}
            onChange={(e) => formik.setFieldValue('staffType', e.currentTarget.value, true)}
            onBlur={formik.handleBlur}
            className="registration-input"
          >
            <option value="">Selecciona un tipo de staff</option>
            {staffTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {fieldError('staffType')}
        </label>

        <fieldset className="registration-field registration-choice-group">
          <legend className="registration-label">Alimentación</legend>
          <div className="registration-radio-group">
            {dietOptions.map((option) => (
              <label key={option.value} className="registration-radio-option" htmlFor={`dietType.${option.value}`}>
                <input
                  id={`dietType.${option.value}`}
                  type="radio"
                  name="dietType"
                  value={option.value}
                  checked={formik.values.dietType === option.value}
                  onChange={(e) => formik.setFieldValue('dietType', e.currentTarget.value, true)}
                  onBlur={formik.handleBlur}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {fieldError('dietType')}
        </fieldset>

        <fieldset className="registration-field registration-choice-group">
          <legend className="registration-label">Alojamiento</legend>
          <label className="registration-checkbox-option" htmlFor="needsAccommodation">
            <input
              id="needsAccommodation"
              name="needsAccommodation"
              type="checkbox"
              checked={formik.values.needsAccommodation}
              onChange={(e) => formik.setFieldValue('needsAccommodation', e.currentTarget.checked, true)}
              onBlur={formik.handleBlur}
            />
            <span>Necesito alojamiento.</span>
          </label>
        </fieldset>

        <label className="registration-field registration-field-wide" htmlFor="staffCode">
          <span className="registration-label">Código de staff</span>
          <input
            id="staffCode"
            name="staffCode"
            type="text"
            placeholder="Ingresa tu código de staff"
            value={formik.values.staffCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="off"
          />
          {fieldError('staffCode')}
        </label>
      </div>

      <div className="registration-consent-group">
        <label className="registration-checkbox-option" htmlFor="acceptsTerms">
          <input
            id="acceptsTerms"
            name="acceptsTerms"
            type="checkbox"
            checked={formik.values.acceptsTerms}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span>
            Acepto los <Link to="/terminos-y-condiciones">Términos y Condiciones</Link> de inscripción.
          </span>
        </label>
        {fieldError('acceptsTerms')}

        <label className="registration-checkbox-option" htmlFor="acceptsPrivacyPolicy">
          <input
            id="acceptsPrivacyPolicy"
            name="acceptsPrivacyPolicy"
            type="checkbox"
            checked={formik.values.acceptsPrivacyPolicy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span>
            Acepto la <Link to="/politica-de-privacidad">Política de Privacidad</Link> y el tratamiento de mis datos personales.
          </span>
        </label>
        {fieldError('acceptsPrivacyPolicy')}
      </div>
    </section>
  )
}
