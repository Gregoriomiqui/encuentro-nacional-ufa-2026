import { useMemo, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import { useFormik } from 'formik'
import type { FormikErrors, FormikProps, FormikTouched } from 'formik'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import {
  MAX_COMPANIONS,
  REGISTRATION_FEE_CLP,
  type RegistrationFormRegistrant,
  type RegistrationFormValues,
  type RegistrationPayload,
} from '@features/registration/domain/entities/registration'
import {
  DISTRICT_NAMES,
  getChurchesByDistrict,
  isChurchInDistrict,
} from '@features/registration/domain/entities/church-directory'
import { submitRegistration } from '@features/registration/application/use-cases/submit-registration.use-case'

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

const BANK_INFO = {
  bankName: 'Banco de Chile',
  accountType: 'Cuenta Corriente',
  accountNumber: '00123456789',
  holderName: 'Union Femenina Aliancista',
  holderRut: '65.123.456-7',
  contactEmail: 'tesoreria@ufaacym.cl',
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

function buildStepLabels(totalParticipants: number): string[] {
  const participantSteps = Array.from({ length: totalParticipants }, (_, index) => `Participante ${index + 1}`)

  return ['Cantidad', ...participantSteps, 'Pago']
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

  return errors
}

async function advanceStep(
  formik: FormikProps<RegistrationFormValues>,
  currentStep: number,
  totalParticipants: number,
  finalStep: number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
) {
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
      return
    }

    if (!file.type.startsWith('image/')) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      formik.setFieldError('receiptBase64', 'El comprobante debe ser una imagen (JPG, PNG o WEBP).')
      return
    }

    if (file.size > MAX_RECEIPT_SIZE_BYTES) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      formik.setFieldError('receiptBase64', 'El comprobante supera el maximo permitido de 5 MB.')
      return
    }

    try {
      const encoded = await fileToBase64WithPrefix(file)
      await formik.setFieldValue('receiptBase64', encoded, false)
      await formik.setFieldValue('receiptFileName', file.name, false)
      formik.setFieldError('receiptBase64', undefined)
    } catch (error) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
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
}

function ParticipantStepPanel({ formik, participantIndex, currentStep }: Readonly<ParticipantStepProps>) {
  const participantErrors = formik.errors.registrants?.[participantIndex] as
    | Partial<Record<keyof RegistrationFormRegistrant, string>>
    | undefined

  const participantTouched = formik.touched.registrants?.[participantIndex] as
    | Partial<Record<keyof RegistrationFormRegistrant, boolean>>
    | undefined

  const emailSuggestions = buildEmailSuggestions(formik.values.registrants[participantIndex]?.email ?? '')
  const emailSuggestionsListId = `registrants.${participantIndex}.email-suggestions`

  function handleFormattedBlur(
    fieldName: string,
    formatter: (value: string) => string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const formattedValue = formatter(event.currentTarget.value)
    if (formattedValue !== event.currentTarget.value) {
      formik.setFieldValue(fieldName, formattedValue, false)
    }
    formik.handleBlur(event)
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
                formik.setFieldValue(`registrants.${participantIndex}.rut`, nextValue, false)
              }
            }}
            onBlur={(event) => {
              handleFormattedBlur(`registrants.${participantIndex}.rut`, formatRutIfNeeded, event)
            }}
            className="registration-input"
            autoComplete="off"
          />
          {participantTouched?.rut && participantErrors?.rut ? <span className="registration-error">{participantErrors.rut}</span> : null}
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
                formik.setFieldValue(`registrants.${participantIndex}.firstName`, nextValue, false)
              }
            }}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="given-name"
          />
          {participantTouched?.firstName && participantErrors?.firstName ? <span className="registration-error">{participantErrors.firstName}</span> : null}
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
                formik.setFieldValue(`registrants.${participantIndex}.lastName`, nextValue, false)
              }
            }}
            onBlur={formik.handleBlur}
            className="registration-input"
            autoComplete="family-name"
          />
          {participantTouched?.lastName && participantErrors?.lastName ? <span className="registration-error">{participantErrors.lastName}</span> : null}
        </label>

        <label className="registration-field" htmlFor={`registrants.${participantIndex}.phone`}>
          <span className="registration-label">Telefono</span>
          <input
            id={`registrants.${participantIndex}.phone`}
            name={`registrants.${participantIndex}.phone`}
            type="tel"
            placeholder="+56912345678"
            value={formik.values.registrants[participantIndex]?.phone ?? ''}
            onChange={formik.handleChange}
            onBlur={(event) => {
              handleFormattedBlur(`registrants.${participantIndex}.phone`, formatPhoneIfNeeded, event)
            }}
            className="registration-input"
            autoComplete="tel"
          />
          {participantTouched?.phone && participantErrors?.phone ? <span className="registration-error">{participantErrors.phone}</span> : null}
        </label>

        <label className="registration-field registration-field-wide" htmlFor={`registrants.${participantIndex}.email`}>
          <span className="registration-label">Email</span>
          <input
            id={`registrants.${participantIndex}.email`}
            name={`registrants.${participantIndex}.email`}
            type="email"
            placeholder="correo@ejemplo.cl"
            value={formik.values.registrants[participantIndex]?.email ?? ''}
            onChange={formik.handleChange}
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
          {participantTouched?.email && participantErrors?.email ? <span className="registration-error">{participantErrors.email}</span> : null}
        </label>
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
  const [latestPayload, setLatestPayload] = useState<RegistrationPayload | null>(null)

  const initialValues = useMemo<RegistrationFormValues>(
    () => ({
      companionCount: 0,
      districtName: '',
      churchOrigin: '',
      receiptBase64: '',
      receiptFileName: '',
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
      try {
        const totalParticipants = getSafeCompanionCount(values.companionCount) + 1
        const payload = await toast.promise(submitRegistration(values, totalParticipants), {
            loading: 'Enviando inscripción...',
            success: 'Inscripción enviada correctamente.',
          error: (error) =>
              error instanceof Error ? error.message : 'Ocurrio un error inesperado al enviar la inscripción.',
        })
        const payloadPreview: RegistrationPayload = {
          ...payload,
          receipt_base64: payload.receipt_base64 ? `${payload.receipt_base64.slice(0, 42)}...` : '',
        }
        setLatestPayload(payloadPreview)
        helpers.resetForm({ values: initialValues })
        setCurrentStep(0)
      } catch {
        // toast.promise already handles error notification
      }
    },
  })

  const totalParticipants = getSafeCompanionCount(formik.values.companionCount) + 1
  const stepLabels = buildStepLabels(totalParticipants)
  const finalStep = totalParticipants + 1
  const isParticipantStep = currentStep > 0 && currentStep < finalStep
  const participantIndex = currentStep - 1
  const totalAmount = totalParticipants * REGISTRATION_FEE_CLP
  const handleReceiptChange = createReceiptChangeHandler(formik)

  let currentPanel = <PaymentStepPanel formik={formik} totalAmount={totalAmount} onReceiptChange={handleReceiptChange} />

  if (currentStep === 0) {
    currentPanel = <CountStepPanel formik={formik} totalParticipants={totalParticipants} totalAmount={totalAmount} />
  }

  if (isParticipantStep) {
    currentPanel = <ParticipantStepPanel formik={formik} participantIndex={participantIndex} currentStep={currentStep} />
  }

  return (
    <div className="registration-module">
      <div className="registration-stepper" aria-label="Progreso de inscripción">
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep

          return (
            <div
              key={label}
              className={`registration-step ${isCompleted ? 'is-completed' : ''} ${isActive ? 'is-active' : ''}`}
            >
              <span className="registration-step-index" aria-hidden="true">
                {index + 1}
              </span>
              <span className="registration-step-label">{label}</span>
            </div>
          )
        })}
      </div>

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
              onClick={() => advanceStep(formik, currentStep, totalParticipants, finalStep, setCurrentStep)}
              disabled={formik.isSubmitting}
            >
              {currentStep + 1 === finalStep ? 'Ir a pago' : 'Siguiente'}
            </button>
          ) : (
            <button type="submit" className="button button-primary" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Enviando...' : 'Enviar inscripción'}
            </button>
          )}
        </div>

      </form>

      {latestPayload ? (
        <section className="registration-payload" aria-live="polite">
          <h4>Estructura enviada</h4>
          <pre>{JSON.stringify(latestPayload, null, 2)}</pre>
        </section>
      ) : null}
    </div>
  )
}
