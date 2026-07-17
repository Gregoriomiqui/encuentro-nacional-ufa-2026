import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type FocusEvent, type SetStateAction } from 'react'
import { useFormik } from 'formik'
import type { FormikErrors, FormikProps, FormikTouched } from 'formik'
import toast from 'react-hot-toast'
import imageCompression from 'browser-image-compression'

import {
  MAX_COMPANIONS,
  REGISTRATION_FEE_CLP,
  type RegistrationFormRegistrant,
  type RegistrationFormValues,
  type WorkshopsBySchedule,
} from '@features/registration/domain/entities/registration'
import { isChurchInDistrict } from '@features/registration/domain/entities/church-directory'
import { submitRegistration } from '@features/registration/application/use-cases/submit-registration.use-case'
import { fetchWorkshopOptions } from '@features/registration/infrastructure/repositories/make-registration.repository'

const MAX_TOTAL_PARTICIPANTS = MAX_COMPANIONS + 1
const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_RECEIPT_MIME_TYPES = new Set(['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/heic'])

const PHONE_REGEX = /^\+56\d{9}$/
const NAME_VALIDATION_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
const POPULAR_EMAIL_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'live.com',
  'proton.me',
] as const

function createEmptyRegistrant(): RegistrationFormRegistrant {
  return {
    rut: '',
    firstName: '',
    lastName: '',
    age: '',
    dietType: '',
    needsAccommodation: false,
    workshopAm: '',
    workshopPm: '',
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
  return rawRut.replaceAll('.', '').replaceAll('-', '').trim()
}

function formatRutIfNeeded(rawRut: string): string {
  const normalizedRut = normalizeRut(rawRut)

  if (!/^\d{7,8}[0-9Kk]$/.test(normalizedRut)) {
    return rawRut.trim()
  }

  const rutBody = normalizedRut.slice(0, -1)
  const verifierDigit = normalizedRut.slice(-1).toUpperCase()

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

function isValidEmailFormat(email: string): boolean {
  const trimmed = email.trim()

  if (!trimmed || trimmed.includes(' ')) {
    return false
  }

  const atIndex = trimmed.indexOf('@')
  const lastAtIndex = trimmed.lastIndexOf('@')

  if (atIndex <= 0 || atIndex !== lastAtIndex || atIndex === trimmed.length - 1) {
    return false
  }

  const localPart = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)

  if (!localPart || !domain || domain.startsWith('.') || domain.endsWith('.')) {
    return false
  }

  const domainParts = domain.split('.')

  return domainParts.length >= 2 && domainParts.every((part) => part.length > 0)
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

  if (!/^\d{7,8}[0-9Kk]$/.test(normalizedRut)) {
    return false
  }

  const rutBody = normalizedRut.slice(0, -1)
  const providedVerifier = normalizedRut.slice(-1).toUpperCase()

  return getRutVerifierDigit(rutBody) === providedVerifier
}

function setParticipantError(
  errors: Partial<Record<keyof RegistrationFormRegistrant, string>>,
  field: keyof RegistrationFormRegistrant,
  message: string,
) {
  errors[field] = message
}

function validateParticipantRut(
  errors: Partial<Record<keyof RegistrationFormRegistrant, string>>,
  rut: string,
) {
  if (!rut) {
    setParticipantError(errors, 'rut', 'El RUT es obligatorio.')
    return
  }

  if (!isValidRut(rut)) {
    setParticipantError(errors, 'rut', 'RUT invalido. Verifica formato y digito verificador (ejemplo: 12345678-9).')
  }
}

function validateParticipantName(
  errors: Partial<Record<keyof RegistrationFormRegistrant, string>>,
  field: 'firstName' | 'lastName',
  value: string,
  emptyMessage: string,
) {
  if (!value) {
    setParticipantError(errors, field, emptyMessage)
    return
  }

  if (!NAME_VALIDATION_REGEX.test(value)) {
    setParticipantError(errors, field, 'El nombre solo puede contener letras.')
  }
}

function validateParticipantAge(
  errors: Partial<Record<keyof RegistrationFormRegistrant, string>>,
  ageRaw: string,
) {
  if (!ageRaw.trim()) {
    setParticipantError(errors, 'age', 'La edad es obligatoria.')
    return
  }

  const age = Number(ageRaw)

  if (!Number.isInteger(age) || age < 12 || age > 120) {
    setParticipantError(errors, 'age', 'Ingresa una edad válida entre 12 y 120 años.')
  }
}

function validateParticipantWorkshops(
  errors: Partial<Record<keyof RegistrationFormRegistrant, string>>,
  registrant: RegistrationFormRegistrant,
  workshopsBySchedule: WorkshopsBySchedule,
) {
  if (!registrant.workshopAm) {
    setParticipantError(errors, 'workshopAm', 'Debes seleccionar un taller de la mañana.')
  }

  if (!registrant.workshopPm) {
    setParticipantError(errors, 'workshopPm', 'Debes seleccionar un taller de la tarde.')
    return
  }

  if (!registrant.workshopAm) {
    return
  }

  const amIdWorkshop = workshopsBySchedule.am.find((w) => w.id === registrant.workshopAm)?.idWorkshop
  const pmIdWorkshop = workshopsBySchedule.pm.find((w) => w.id === registrant.workshopPm)?.idWorkshop

  if (amIdWorkshop && pmIdWorkshop && amIdWorkshop === pmIdWorkshop) {
    setParticipantError(errors, 'workshopPm', 'No puedes elegir el mismo taller en la mañana y en la tarde.')
  }
}

function validateParticipantContact(
  errors: Partial<Record<keyof RegistrationFormRegistrant, string>>,
  phone: string,
  email: string,
) {
  if (!phone) {
    setParticipantError(errors, 'phone', 'El telefono es obligatorio.')
  } else if (!PHONE_REGEX.test(formatPhoneIfNeeded(phone))) {
    setParticipantError(errors, 'phone', 'Formato de telefono invalido. Debe ser +56 y 9 digitos (12 caracteres en total).')
  }

  if (!email) {
    setParticipantError(errors, 'email', 'El email es obligatorio.')
  } else if (!isValidEmailFormat(email)) {
    setParticipantError(errors, 'email', 'Ingresa un email valido.')
  }
}

function getParticipantStepErrors(registrant: RegistrationFormRegistrant, workshopsBySchedule: WorkshopsBySchedule) {
  const errors: Partial<Record<keyof RegistrationFormRegistrant, string>> = {}

  const rut = registrant.rut.trim()
  const firstName = registrant.firstName.trim()
  const lastName = registrant.lastName.trim()
  const phone = registrant.phone.trim()
  const email = registrant.email.trim()

  validateParticipantRut(errors, rut)
  validateParticipantName(errors, 'firstName', firstName, 'El nombre es obligatorio.')
  validateParticipantName(errors, 'lastName', lastName, 'El apellido es obligatorio.')
  validateParticipantAge(errors, registrant.age)

  if (!registrant.dietType) {
    setParticipantError(errors, 'dietType', 'Debes seleccionar un tipo de alimentación.')
  }

  validateParticipantWorkshops(errors, registrant, workshopsBySchedule)
  validateParticipantContact(errors, phone, email)

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
            workshopAm: true,
            workshopPm: true,
            phone: true,
            email: true,
          }
        : {},
    ),
  }
}

function validateCountStep(values: RegistrationFormValues, companionCount: number): FormikErrors<RegistrationFormValues> {
  const errors: FormikErrors<RegistrationFormValues> = {}

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

function validateParticipantStep(
  values: RegistrationFormValues,
  currentStep: number,
  workshopsBySchedule: WorkshopsBySchedule,
): FormikErrors<RegistrationFormValues> {
  const errors: FormikErrors<RegistrationFormValues> = {}
  const participantIndex = currentStep - 1
  const registrant = values.registrants[participantIndex]

  if (!registrant) {
    errors.registrants = [{ rut: 'Participante no encontrado.' }]
    return errors
  }

  const participantErrors = getParticipantStepErrors(registrant, workshopsBySchedule)

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

function validateFinalStep(values: RegistrationFormValues): FormikErrors<RegistrationFormValues> {
  const errors: FormikErrors<RegistrationFormValues> = {}

  if (!values.receiptBase64) {
    errors.receiptBase64 = 'Debes adjuntar el comprobante de pago.'
  }

  if (!values.acceptsTerms) {
    errors.acceptsTerms = 'Debes aceptar los términos y condiciones de inscripción.'
  }

  if (!values.acceptsImageAuthorization) {
    errors.acceptsImageAuthorization = 'Debes autorizar el uso de imagen para completar la inscripción.'
  }

  return errors
}

function validateByStep(values: RegistrationFormValues, currentStep: number, workshopsBySchedule: WorkshopsBySchedule): FormikErrors<RegistrationFormValues> {
  const companionCount = getSafeCompanionCount(values.companionCount)
  const totalParticipants = companionCount + 1
  const finalStep = totalParticipants + 1

  if (currentStep === 0) {
    return validateCountStep(values, companionCount)
  }

  if (currentStep > 0 && currentStep < finalStep) {
    return validateParticipantStep(values, currentStep, workshopsBySchedule)
  }

  if (currentStep === finalStep) {
    return validateFinalStep(values)
  }

  return {}
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

    if (!ALLOWED_RECEIPT_MIME_TYPES.has(file.type)) {
      await formik.setFieldValue('receiptBase64', '', false)
      await formik.setFieldValue('receiptFileName', '', false)
      await formik.setFieldValue('receiptMimeType', '', false)
      formik.setFieldError('receiptBase64', 'El comprobante debe ser un archivo PNG, JPG, JPEG, WEBP o HEIC.')
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

async function handleFormattedBlur(
  formik: FormikProps<RegistrationFormValues>,
  fieldName: string,
  formatter: (value: string) => string,
  event: FocusEvent<HTMLInputElement>,
) {
  const currentValue = event.currentTarget.value
  const formattedValue = formatter(currentValue)

  if (formattedValue !== currentValue) {
    await formik.setFieldValue(fieldName, formattedValue, true)
    return
  }

  await formik.setFieldTouched(fieldName, true, true)
}

export function useRegistration() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessScreenVisible, setIsSuccessScreenVisible] = useState(false)
  const [redirectCountdownSeconds, setRedirectCountdownSeconds] = useState(10)
  const [attemptedSteps, setAttemptedSteps] = useState<Record<number, boolean>>({})
  const [workshopsBySchedule, setWorkshopsBySchedule] = useState<WorkshopsBySchedule>({ am: [], pm: [] })
  const [workshopsRequestState, setWorkshopsRequestState] = useState<'loading' | 'loaded' | 'error'>('loading')

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
    validate: (values) => validateByStep(values, currentStep, workshopsBySchedule),
    onSubmit: async (values, helpers) => {
      setIsLoading(true)
      try {
        const totalParticipants = getSafeCompanionCount(values.companionCount) + 1
        const result = await submitRegistration(values, totalParticipants, workshopsBySchedule)
        toast.success(result.apiResponse.message)
        setIsSuccessScreenVisible(true)
        setRedirectCountdownSeconds(10)
        helpers.resetForm({ values: initialValues })
        setAttemptedSteps({})
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado al enviar la inscripción.')
      } finally {
        setIsLoading(false)
      }
    },
  })

  const totalParticipants = getSafeCompanionCount(formik.values.companionCount) + 1
  const companionCount = getSafeCompanionCount(formik.values.companionCount)
  const finalStep = totalParticipants + 1
  const isParticipantStep = currentStep > 0 && currentStep < finalStep
  const participantIndex = currentStep - 1
  const totalAmount = totalParticipants * REGISTRATION_FEE_CLP
  const handleReceiptChange = createReceiptChangeHandler(formik)
  const showParticipantErrors = Boolean(attemptedSteps[currentStep])

  useEffect(() => {
    if (!isParticipantStep || workshopsRequestState !== 'loading') {
      return
    }

    let isMounted = true

    fetchWorkshopOptions()
      .then((data) => {
        if (!isMounted) {
          return
        }

        setWorkshopsBySchedule({
          am: data.am.filter((o) => o.isEnabled),
          pm: data.pm.filter((o) => o.isEnabled),
        })
        setWorkshopsRequestState('loaded')
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setWorkshopsBySchedule({ am: [], pm: [] })
        setWorkshopsRequestState('error')
      })

    return () => {
      isMounted = false
    }
  }, [isParticipantStep, workshopsRequestState])

  useEffect(() => {
    if (!isSuccessScreenVisible) {
      return
    }

    globalThis.window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isSuccessScreenVisible])

  useEffect(() => {
    if (!isSuccessScreenVisible) {
      return
    }

    const timer = globalThis.window.setTimeout(() => {
      setRedirectCountdownSeconds((previous) => {
        if (previous <= 1) {
          setCurrentStep(0)
          setIsSuccessScreenVisible(false)
          return 10
        }

        return previous - 1
      })
    }, 1000)

    return () => {
      globalThis.window.clearTimeout(timer)
    }
  }, [isSuccessScreenVisible, redirectCountdownSeconds])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth > 768) return
    if (currentStep === 0) return

    const timer = setTimeout(() => {
      const firstInput = document.querySelector('.registration-card input, .registration-card select, .registration-card textarea') as HTMLElement
      if (firstInput) {
        firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstInput.focus()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [currentStep])

  return {
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
    getEmailSuggestions: buildEmailSuggestions,
    setCompanionCount: (value: unknown) => {
      formik.setFieldValue('companionCount', getSafeCompanionCount(value), false)
    },
    onParticipantRutBlur: async (participant: number, event: FocusEvent<HTMLInputElement>) => {
      await handleFormattedBlur(formik, `registrants.${participant}.rut`, formatRutIfNeeded, event)
    },
    onParticipantPhoneBlur: async (participant: number, event: FocusEvent<HTMLInputElement>) => {
      await handleFormattedBlur(formik, `registrants.${participant}.phone`, formatPhoneIfNeeded, event)
    },
    goToNextStep: async () => {
      await advanceStep(formik, currentStep, totalParticipants, finalStep, setAttemptedSteps, setCurrentStep)
    },
    goToPreviousStep: () => {
      retreatStep(setCurrentStep)
    },
  }
}

export default useRegistration
