import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type FocusEvent, type SetStateAction } from 'react'
import { useFormik } from 'formik'
import type { FormikErrors, FormikProps, FormikTouched } from 'formik'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import imageCompression from 'browser-image-compression'

import {
  MAX_COMPANIONS,
  REGISTRATION_FEE_CLP,
  type RegistrationFormRegistrant,
  type RegistrationFormValues,
} from '@features/registration/domain/entities/registration'
import {
  DISTRICT_NAMES,
  getChurchesByDistrict,
  isChurchInDistrict,
} from '@features/registration/domain/entities/church-directory'
import { submitRegistration } from '@features/registration/application/use-cases/submit-registration.use-case'
import { RegistrationStepper } from './registration-stepper'
import { RegistrationWelcome } from './registration-welcome'

const MAX_TOTAL_PARTICIPANTS = MAX_COMPANIONS + 1
const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024

const PHONE_REGEX = /^\+56\d{9}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_ALLOWED_INPUT_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]*$/
const NAME_VALIDATION_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
const RUT_ALLOWED_INPUT_REGEX = /^\d*-?\d*$/
const POPULAR_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'proton.me',
] as const

const DIET_OPTIONS = [
  { value: 'traditional', label: 'Alimentación tradicional' },
  { value: 'vegetarian', label: 'Alimentación vegetariana' },
] as const

const WORKSHOP_OPTIONS = [
  'Huellas de Fe: El legado de las mujeres en el Antiguo y Nuevo Testamento.',
  'Administradoras, transformadas e influyentes',
  'Transformadas para conectar: El arte de ver al prójimo con el Corazón',
  'Mujeres y Sociedad: Siendo Luz en medio del Mundo',
  'Maternidad: cuidando el corazón mientras cuidas de otros.',
  'Acompañando a los adultos mayores, transformando el ambiente para que todos podamos participar.',
  'Las voces que habitan nuestro interior: Aprendiendo a reconocer la voz de la gracia en medio de la crítica y la autoexigencia.',
  'Puentes, no muros',
  'Más que un Trabajo: Un Propósito en Cristo',
  'La comunicación que transforma',
  'Transformando cicatrices en un legado de esperanza',
  'Mujer y cristiana',
  'Transformadas para una misión',
  'La mesa de los olvidados. Creados para la gloria de Dios',
  'Misión, santidad y discernimiento en una era digital',
  'La soledad, enemiga o aliada',
  'Transformadas para reflejar a Cristo en un mundo de exposición',
  'Mujer, adicciones, el camino a la sanidad y transformación.',
  '¡Cuando el corazón se agita, El permanece firme!',
  'Transformadas por la Verdad: El poder de la Palabra de Dios para renovar la vida de la mujer.',
  'Del hogar a la sociedad: mujeres que viven y reflejan el evangelio.',
  'Evangelio y Neurodivergencia: Comprendiendo el reino de Dios frente a la neurodiversidad.',
  'Quién dices que soy',
  'Nuestra identidad por Gracia',
  'Contención emocional y espiritual para la mujer maltratada',
  'Comunicación efectiva y resolución de conflictos: claves para relaciones transformadoras',
] as const

const BANK_INFO = {
  bankName: 'Banco Estado',
  accountType: 'Cuenta Corriente',
  accountNumber: '62900281957',
  holderName: 'Union Femenina Aliancista',
  holderRut: '70017500-6',
  contactEmail: 'tesorera_ufa@acym.cl',
} as const

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

function createEmptyRegistrant(): RegistrationFormRegistrant {
  return {
    rut: '',
    firstName: '',
    lastName: '',
    age: '',
    dietType: '',
    needsAccommodation: false,
    workshops: [],
    phone: '',
    email: '',
  }
}

async function fileToBase64WithPrefix(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('No fue posible leer el archivo.'))
        return
      }

      const base64Content = reader.result.split(',')[1]

      if (!base64Content) {
        reject(new Error('No fue posible procesar el comprobante.'))
        return
      }

      resolve(`base64:${base64Content}`)
    }

    reader.onerror = () => {
      reject(new Error('No fue posible leer el archivo.'))
    }

    reader.readAsDataURL(file)
  })
}

function getSafeCompanionCount(value: unknown): number {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return 0
  }

  const bounded = Math.min(Math.max(Math.trunc(parsed), 0), MAX_COMPANIONS)

  return bounded
}

function normalizeRut(rawRut: string): string {
  return rawRut.replace(/\./g, '').replace(/-/g, '').trim()
}

function formatRutIfNeeded(rawRut: string): string {
  const normalizedRut = normalizeRut(rawRut)

  if (!/^\d{8,9}$/.test(normalizedRut)) {
    return rawRut.trim()
  }

  const rutBody = normalizedRut.slice(0, -1)
  const verifierDigit = normalizedRut.slice(-1)

  return `${rutBody}-${verifierDigit}`
}

function formatPhoneIfNeeded(rawPhone: string): string {
  const onlyDigits = rawPhone.replace(/\D/g, '')

  if (!onlyDigits) {
    return ''
  }

  if (onlyDigits.startsWith('56')) {
    return `+${onlyDigits}`
  }

  return `+56${onlyDigits}`
}

function buildEmailSuggestions(rawEmail: string): string[] {
  const atIndex = rawEmail.indexOf('@')

  if (atIndex < 0) {
    return []
  }

  const localPart = rawEmail.slice(0, atIndex).trim()
  const typedDomain = rawEmail.slice(atIndex + 1).trim().toLowerCase()

  if (!localPart) {
    return []
  }

  return POPULAR_EMAIL_DOMAINS.filter((domain) => domain.startsWith(typedDomain)).map(
    (domain) => `${localPart}@${domain}`,
  )
}

function getRutVerifierDigit(rutBody: string): string {
  let sum = 0
  let multiplier = 2

  for (let index = rutBody.length - 1; index >= 0; index -= 1) {
    const digit = Number(rutBody[index])
    sum += digit * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const remainder = 11 - (sum % 11)

  if (remainder === 11) {
    return '0'
  }

  if (remainder === 10) {
    return 'K'
  }

  return String(remainder)
}

function isValidRut(rut: string): boolean {
  const normalizedRut = normalizeRut(rut)

  if (!/^\d{8,9}$/.test(normalizedRut)) {
    return false
  }

  const rutBody = normalizedRut.slice(0, -1)
  const providedVerifier = normalizedRut.slice(-1)

  return getRutVerifierDigit(rutBody) === providedVerifier
}

function getParticipantStepErrors(registrant: RegistrationFormRegistrant) {
  const errors: Partial<Record<keyof RegistrationFormRegistrant, string>> = {}

  const rut = registrant.rut.trim()
  const firstName = registrant.firstName.trim()
  const lastName = registrant.lastName.trim()
  const age = Number(registrant.age)
  const phone = registrant.phone.trim()
  const email = registrant.email.trim()

  if (!rut) {
    errors.rut = 'El RUT es obligatorio.'
  } else if (!isValidRut(rut)) {
    errors.rut = 'RUT invalido. Verifica formato y digito verificador (ejemplo: 12345678-9).'
  }

  if (!firstName) {
    errors.firstName = 'El nombre es obligatorio.'
  } else if (!NAME_VALIDATION_REGEX.test(firstName)) {
    errors.firstName = 'El nombre solo puede contener letras.'
  }

  if (!lastName) {
    errors.lastName = 'El apellido es obligatorio.'
  } else if (!NAME_VALIDATION_REGEX.test(lastName)) {
    errors.lastName = 'El apellido solo puede contener letras.'
  }

  if (!registrant.age.trim()) {
    errors.age = 'La edad es obligatoria.'
  } else if (!Number.isInteger(age) || age < 12 || age > 120) {
    errors.age = 'Ingresa una edad válida entre 12 y 120 años.'
  }

  if (!registrant.dietType) {
    errors.dietType = 'Debes seleccionar un tipo de alimentación.'
  }

  if (registrant.workshops.length < 1 || registrant.workshops.length > 2) {
    errors.workshops = 'Debes seleccionar entre 1 y 2 talleres.'
  }

  if (!phone) {
    errors.phone = 'El telefono es obligatorio.'
  } else if (!PHONE_REGEX.test(formatPhoneIfNeeded(phone))) {
    errors.phone = 'Formato de telefono invalido. Debe ser +56 y 9 digitos (12 caracteres en total).'
  }

  if (!email) {
    errors.email = 'El email es obligatorio.'
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Ingresa un email valido.'
  }

  return errors
}

function getStepTouched(currentStep: number, totalParticipants: number): FormikTouched<RegistrationFormValues> {
  if (currentStep === 0) {
    return {
      districtName: true,
      churchOrigin: true,
      companionCount: true,
    }
  }

  if (currentStep === totalParticipants + 1) {
    return {
      receiptBase64: true,
      acceptsTerms: true,
      acceptsImageAuthorization: true,
    }
  }

  const participantIndex = currentStep - 1

  return {
    registrants: Array.from({ length: MAX_TOTAL_PARTICIPANTS }, (_, index) =>
      index === participantIndex
        ? {
            rut: true,
            firstName: true,
            lastName: true,
            age: true,
            dietType: true,
            needsAccommodation: true,
            workshops: true,
            phone: true,
            email: true,
          }
        : {},
    ),
  }
}

function validateByStep(values: RegistrationFormValues, currentStep: number): FormikErrors<RegistrationFormValues> {
  const errors: FormikErrors<RegistrationFormValues> = {}
  const companionCount = getSafeCompanionCount(values.companionCount)
  const totalParticipants = companionCount + 1
  const finalStep = totalParticipants + 1

  if (currentStep === 0) {
    if (!values.districtName.trim()) {
      errors.districtName = 'Debes seleccionar un distrito.'
    }

    if (!values.churchOrigin.trim()) {
      errors.churchOrigin = 'La iglesia de origen es obligatoria.'
    } else if (!isChurchInDistrict(values.districtName, values.churchOrigin)) {
      errors.churchOrigin = 'Selecciona una iglesia valida del distrito elegido.'
    }

    if (!Number.isInteger(Number(values.companionCount))) {
      errors.companionCount = 'Selecciona una cantidad valida.'
    } else if (companionCount < 0 || companionCount > MAX_COMPANIONS) {
      errors.companionCount = `La cantidad debe estar entre 0 y ${MAX_COMPANIONS}.`
    }

    return errors
  }

  if (currentStep > 0 && currentStep < finalStep) {
    const participantIndex = currentStep - 1
    const registrant = values.registrants[participantIndex]

    if (!registrant) {
      errors.registrants = [{ rut: 'Participante no encontrado.' }]
      return errors
    }

    const participantErrors = getParticipantStepErrors(registrant)

    if (Object.keys(participantErrors).length > 0) {
      const registrantErrors = Array.from(
        { length: MAX_TOTAL_PARTICIPANTS },
        () => ({} as FormikErrors<RegistrationFormRegistrant>),
      )
      registrantErrors[participantIndex] = participantErrors as FormikErrors<RegistrationFormRegistrant>
      errors.registrants = registrantErrors
    }

    return errors
  }

  if (currentStep === finalStep && !values.receiptBase64) {
    errors.receiptBase64 = 'Debes adjuntar el comprobante de pago.'
  }

  if (currentStep === finalStep && !values.acceptsTerms) {
    errors.acceptsTerms = 'Debes aceptar los términos y condiciones de inscripción.'
  }

  if (currentStep === finalStep && !values.acceptsImageAuthorization) {
    errors.acceptsImageAuthorization = 'Debes autorizar el uso de imagen para completar la inscripción.'
  }

  return errors
}

async function advanceStep(
  formik: FormikProps<RegistrationFormValues>,
  currentStep: number,
  totalParticipants: number,
  finalStep: number,
  setAttemptedSteps: Dispatch<SetStateAction<Record<number, boolean>>>,
  setCurrentStep: Dispatch<SetStateAction<number>>,
) {
  setAttemptedSteps((previous) => ({
    ...previous,
    [currentStep]: true,
  }))

  const touched = getStepTouched(currentStep, totalParticipants)
  await formik.setTouched(touched, true)

  const errors = await formik.validateForm()

  if (Object.keys(errors).length > 0) {
    return
  }

  setCurrentStep((previous) => Math.min(previous + 1, finalStep))
}

function retreatStep(setCurrentStep: Dispatch<SetStateAction<number>>) {
  setCurrentStep((previous) => Math.max(previous - 1, 0))
}

function createReceiptChangeHandler(formik: FormikProps<RegistrationFormValues>) {
  return async function handleReceiptChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]

    if (!file) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      await formik.setFieldValue('receiptMimeType', '', false)
      return
    }

    if (!file.type.startsWith('image/')) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      await formik.setFieldValue('receiptMimeType', '', false)
      formik.setFieldError('receiptBase64', 'El comprobante debe ser una imagen (JPG, PNG o WEBP).')
      return
    }

    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      await formik.setFieldValue('receiptMimeType', '', false)
      formik.setFieldError('receiptBase64', 'El comprobante supera el maximo permitido de 5 MB.')
      return
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/jpeg',
      }
      
      const compressedFile = await imageCompression(file, options)
      const encoded = await fileToBase64WithPrefix(compressedFile as File)
      
      await formik.setFieldValue('receiptBase64', encoded, false)
      await formik.setFieldValue('receiptFileName', compressedFile.name || file.name, false)
      await formik.setFieldValue('receiptMimeType', compressedFile.type || 'image/jpeg', false)
      formik.setFieldError('receiptBase64', undefined)
    } catch (error) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      await formik.setFieldValue('receiptMimeType', '', false)
      formik.setFieldError(
        'receiptBase64',
        error instanceof Error ? error.message : 'No fue posible procesar el comprobante.',
      )
    }
  }
}

type CountStepProps = {
  formik: FormikProps<RegistrationFormValues>
  totalParticipants: number
  totalAmount: number
}

function CountStepPanel({ formik, totalParticipants, totalAmount }: Readonly<CountStepProps>) {
  const companionCount = getSafeCompanionCount(formik.values.companionCount)
  const churches = useMemo(() => getChurchesByDistrict(formik.values.districtName), [formik.values.districtName])

  return (
    <section className="registration-panel" aria-labelledby="step-cantidad-title">
      <h3 id="step-cantidad-title" className="registration-panel-title">
        Define cuantas personas se inscribiran contigo
      </h3>
      <p className="registration-panel-subtitle">
        Puedes agregar hasta {MAX_COMPANIONS} personas adicionales. El primer formulario siempre sera para ti.
      </p>

      <label className="registration-field" htmlFor="districtName">
        <span className="registration-label">Distrito</span>
        <select
          id="districtName"
          name="districtName"
          value={formik.values.districtName}
          onChange={(event) => {
            const nextDistrict = event.currentTarget.value
            formik.setFieldValue('districtName', nextDistrict, false)
            formik.setFieldValue('churchOrigin', '', false)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
        >
          <option value="">Selecciona un distrito</option>
          {DISTRICT_NAMES.map((districtName) => (
            <option key={districtName} value={districtName}>
              {districtName}
            </option>
          ))}
        </select>
      </label>

      {formik.touched.districtName && formik.errors.districtName ? (
        <p className="registration-error">{formik.errors.districtName}</p>
      ) : null}

      <label className="registration-field" htmlFor="churchOrigin">
        <span className="registration-label">Iglesia de origen</span>
        <input
          id="churchOrigin"
          name="churchOrigin"
          type="text"
          value={formik.values.churchOrigin}
          onChange={(event) => {
            formik.setFieldValue('churchOrigin', event.currentTarget.value, false)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
          placeholder={formik.values.districtName ? 'Busca y selecciona tu iglesia' : 'Primero selecciona un distrito'}
          autoComplete="organization"
          list="church-origin-list"
          disabled={!formik.values.districtName}
        />
        <datalist id="church-origin-list">
          {churches.map((church) => (
            <option key={church} value={church} />
          ))}
        </datalist>
      </label>

      {formik.touched.churchOrigin && formik.errors.churchOrigin ? (
        <p className="registration-error">{formik.errors.churchOrigin}</p>
      ) : null}

      <label className="registration-field" htmlFor="companionCount">
        <span className="registration-label">Personas adicionales</span>
        <select
          id="companionCount"
          name="companionCount"
          value={companionCount}
          onChange={(event) => {
            formik.setFieldValue('companionCount', getSafeCompanionCount(event.currentTarget.value), false)
          }}
          onBlur={formik.handleBlur}
          className="registration-input"
        >
          <option value={0}>Solo yo</option>
          <option value={1}>Yo + 1 persona</option>
          <option value={2}>Yo + 2 personas</option>
          <option value={3}>Yo + 3 personas</option>
          <option value={4}>Yo + 4 personas</option>
        </select>
      </label>

      {formik.touched.companionCount && formik.errors.companionCount ? (
        <p className="registration-error">{formik.errors.companionCount}</p>
      ) : null}

      <output className="registration-summary-strip">
        <p>Total de participantes: {totalParticipants}</p>
        <p>Total estimado: {currencyFormatter.format(totalAmount)}</p>
      </output>
    </section>
  )
}

type ParticipantStepProps = {
  formik: FormikProps<RegistrationFormValues>
  participantIndex: number
  currentStep: number
  showErrors: boolean
}

function ParticipantStepPanel({ formik, participantIndex, currentStep, showErrors }: Readonly<ParticipantStepProps>) {
  const participantErrors = formik.errors.registrants?.[participantIndex] as
    | Partial<Record<keyof RegistrationFormRegistrant, string>>
    | undefined

  const emailSuggestions = buildEmailSuggestions(formik.values.registrants[participantIndex]?.email ?? '')
  const emailSuggestionsListId = `registrants.${participantIndex}.email-suggestions`

  function toggleWorkshopSelection(workshopName: string) {
    const currentSelection = formik.values.registrants[participantIndex]?.workshops ?? []
    const hasWorkshop = currentSelection.includes(workshopName)

    const nextSelection = hasWorkshop
      ? currentSelection.filter((workshop) => workshop !== workshopName)
      : currentSelection.length < 2
        ? [...currentSelection, workshopName]
        : currentSelection

    formik.setFieldValue(`registrants.${participantIndex}.workshops`, nextSelection, true)
  }

  function handleFormattedBlur(
    fieldName: string,
    formatter: (value: string) => string,
    event: FocusEvent<HTMLInputElement>,
  ) {
    const currentValue = event.currentTarget.value
    const formattedValue = formatter(currentValue)

    if (formattedValue !== currentValue) {
      formik.setFieldValue(fieldName, formattedValue, true)
      return
    }

    formik.setFieldTouched(fieldName, true, true)
  }

  return (
    <section className="registration-panel" aria-labelledby="step-participante-title">
      <h3 id="step-participante-title" className="registration-panel-title">
        {participantIndex === 0 ? 'Datos de la persona principal' : `Datos de la participante ${currentStep}`}
      </h3>
      <p className="registration-panel-subtitle">
        Completa los datos exactamente como aparecen en los documentos oficiales.
      </p>

      <div className="registration-grid">
        <label className="registration-field" htmlFor={`registrants.${participantIndex}.rut`}>
          <span className="registration-label">RUT</span>
          <input
            id={`registrants.${participantIndex}.rut`}
            name={`registrants.${participantIndex}.rut`}
            type="text"
            placeholder="12345678-9"
            value={formik.values.registrants[participantIndex]?.rut ?? ''}
            onChange={(event) => {
              const nextValue = event.currentTarget.value
              if (RUT_ALLOWED_INPUT_REGEX.test(nextValue)) {
                formik.setFieldValue(`registrants.${participantIndex}.rut`, nextValue, true)
              }
            }}
            onBlur={(event) => {
              handleFormattedBlur(`registrants.${participantIndex}.rut`, formatRutIfNeeded, event)
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
              handleFormattedBlur(`registrants.${participantIndex}.phone`, formatPhoneIfNeeded, event)
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
          <label
            className="registration-checkbox-option"
            htmlFor={`registrants.${participantIndex}.needsAccommodation`}
          >
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

        <fieldset className="registration-field registration-field-wide registration-choice-group">
          <legend className="registration-label">Selecciona uno o dos talleres de tu interés</legend>
          <p className="registration-helper-text">Debes elegir entre 1 y 2 talleres para esta participante.</p>
          <div className="registration-workshops-grid" role="group" aria-label="Listado de talleres disponibles">
            {WORKSHOP_OPTIONS.map((workshopName, workshopIndex) => {
              const selectedWorkshops = formik.values.registrants[participantIndex]?.workshops ?? []
              const isSelected = selectedWorkshops.includes(workshopName)
              const disableOption = !isSelected && selectedWorkshops.length >= 2

              return (
                <label key={workshopName} className={`registration-workshop-option ${disableOption ? 'is-disabled' : ''}`} htmlFor={`registrants.${participantIndex}.workshops.${workshopIndex}`}>
                  <input
                    id={`registrants.${participantIndex}.workshops.${workshopIndex}`}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      toggleWorkshopSelection(workshopName)
                    }}
                    onBlur={() => {
                      formik.setFieldTouched(`registrants.${participantIndex}.workshops`, true, true)
                    }}
                    disabled={disableOption}
                  />
                  <span>{workshopName}</span>
                </label>
              )
            })}
          </div>
          <p className="registration-selection-counter">
            Seleccionados: {(formik.values.registrants[participantIndex]?.workshops ?? []).length}/2
          </p>
          {showErrors && participantErrors?.workshops ? <span className="registration-error">{participantErrors.workshops}</span> : null}
        </fieldset>
      </div>
    </section>
  )
}

type PaymentStepProps = {
  formik: FormikProps<RegistrationFormValues>
  totalAmount: number
  onReceiptChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
}

function PaymentStepPanel({ formik, totalAmount, onReceiptChange }: Readonly<PaymentStepProps>) {
  return (
    <section className="registration-panel" aria-labelledby="step-pago-title">
      <h3 id="step-pago-title" className="registration-panel-title">
        Pago y comprobante
      </h3>
      <p className="registration-panel-subtitle">
        Valor por participante: {currencyFormatter.format(REGISTRATION_FEE_CLP)}. Total a transferir:{' '}
        <strong>{currencyFormatter.format(totalAmount)}</strong>.
      </p>

      <div className="bank-card" role="note" aria-label="Datos bancarios">
        <p className="registration-bank-warning">
          Importante: solo se debe transferir a los datos de la cuenta de Banco Estado indicados a continuación.
        </p>
        <p>
          <strong>Banco:</strong> {BANK_INFO.bankName}
        </p>
        <p>
          <strong>Tipo de cuenta:</strong> {BANK_INFO.accountType}
        </p>
        <p>
          <strong>N de cuenta:</strong> {BANK_INFO.accountNumber}
        </p>
        <p>
          <strong>Titular:</strong> {BANK_INFO.holderName}
        </p>
        <p>
          <strong>RUT:</strong> {BANK_INFO.holderRut}
        </p>
        <p>
          <strong>Email:</strong> {BANK_INFO.contactEmail}
        </p>
      </div>

      <label className="registration-field" htmlFor="receiptFile">
        <span className="registration-label">Comprobante de pago (imagen)</span>
        <input
          id="receiptFile"
          name="receiptFile"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onReceiptChange}
          className="registration-input registration-file-input"
        />
      </label>

      {formik.values.receiptFileName ? <p className="registration-file-name">Archivo cargado: {formik.values.receiptFileName}</p> : null}

      {formik.touched.receiptBase64 && formik.errors.receiptBase64 ? (
        <p className="registration-error">{formik.errors.receiptBase64}</p>
      ) : null}

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
          <span>Acepto los términos y condiciones de inscripción.</span>
        </label>
        {formik.touched.acceptsTerms && formik.errors.acceptsTerms ? <p className="registration-error">{formik.errors.acceptsTerms}</p> : null}

        <label className="registration-checkbox-option" htmlFor="acceptsImageAuthorization">
          <input
            id="acceptsImageAuthorization"
            name="acceptsImageAuthorization"
            type="checkbox"
            checked={formik.values.acceptsImageAuthorization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span>Autorizo el uso de mi imagen con fines promocionales, institucionales y de registro del ministerio UFA.</span>
        </label>
        {formik.touched.acceptsImageAuthorization && formik.errors.acceptsImageAuthorization ? (
          <p className="registration-error">{formik.errors.acceptsImageAuthorization}</p>
        ) : null}
      </div>

      <div className="registration-legal-note">
        <p>
          Al enviar la inscripción aceptas los <Link to="/terminos-y-condiciones">Terminos y Condiciones</Link> y la{' '}
          <Link to="/politica-de-privacidad">Politica de Privacidad</Link>.
        </p>
      </div>
    </section>
  )
}

export function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [attemptedSteps, setAttemptedSteps] = useState<Record<number, boolean>>({})

  const initialValues = useMemo<RegistrationFormValues>(
    () => ({
      companionCount: 0,
      districtName: '',
      churchOrigin: '',
      receiptBase64: '',
      receiptFileName: '',
      receiptMimeType: '',
      acceptsTerms: false,
      acceptsImageAuthorization: false,
      registrants: Array.from({ length: MAX_TOTAL_PARTICIPANTS }, () => createEmptyRegistrant()),
    }),
    [],
  )

  const formik = useFormik<RegistrationFormValues>({
    initialValues,
    validateOnBlur: true,
    validateOnChange: false,
    validate: (values) => validateByStep(values, currentStep),
    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
        const totalParticipants = getSafeCompanionCount(values.companionCount) + 1
        const result = await submitRegistration(values, totalParticipants)
        toast.success(result.apiResponse.message)
        helpers.resetForm({ values: initialValues })
        setAttemptedSteps({})
        setCurrentStep(0)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado al enviar la inscripción.')
      } finally {
        setIsLoading(false)
      }
    },
  })

  const totalParticipants = getSafeCompanionCount(formik.values.companionCount) + 1
  const finalStep = totalParticipants + 1
  const isParticipantStep = currentStep > 0 && currentStep < finalStep
  const participantIndex = currentStep - 1
  const totalAmount = totalParticipants * REGISTRATION_FEE_CLP
  const handleReceiptChange = createReceiptChangeHandler(formik)
  const showParticipantErrors = Boolean(attemptedSteps[currentStep])

  // Auto-scroll to first input on step change in mobile
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth > 768) return
    if (currentStep === 0) return

    // Small delay to allow DOM to update
    const timer = setTimeout(() => {
      const firstInput = document.querySelector('.registration-card input, .registration-card select, .registration-card textarea') as HTMLElement
      if (firstInput) {
        firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstInput.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [currentStep])

  let currentPanel = <PaymentStepPanel formik={formik} totalAmount={totalAmount} onReceiptChange={handleReceiptChange} />

  if (currentStep === 0) {
    currentPanel = <CountStepPanel formik={formik} totalParticipants={totalParticipants} totalAmount={totalAmount} />
  }

  if (isParticipantStep) {
    currentPanel = (
      <ParticipantStepPanel
        formik={formik}
        participantIndex={participantIndex}
        currentStep={currentStep}
        showErrors={showParticipantErrors}
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
      
      <RegistrationStepper currentStep={currentStep + 1} totalSteps={finalStep + 1} />

      {currentStep === 0 && <RegistrationWelcome />}

      <form className="registration-card" onSubmit={formik.handleSubmit} noValidate>
        {currentPanel}

        <div className="registration-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              retreatStep(setCurrentStep)
            }}
            disabled={currentStep === 0 || formik.isSubmitting}
          >
            Anterior
          </button>

          {currentStep < finalStep ? (
            <button
              type="button"
              className="button button-primary"
              onClick={() => advanceStep(formik, currentStep, totalParticipants, finalStep, setAttemptedSteps, setCurrentStep)}
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


    </div>
  )
}
