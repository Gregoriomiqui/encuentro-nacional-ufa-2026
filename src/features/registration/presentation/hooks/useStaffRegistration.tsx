import { useEffect, useMemo, useRef, type FocusEvent } from 'react'
import { useFormik } from 'formik'
import type { FormikErrors } from 'formik'
import toast from 'react-hot-toast'

import { RegistrationDietType } from '@features/registration/domain/entities/registration'
import { STAFF_TYPE_OPTIONS, type StaffRegistrationFormValues } from '@features/registration/domain/entities/staff-registration'
import {
  formatRutIfNeeded,
  formatPhoneIfNeeded,
  buildEmailSuggestions,
  validateParticipantRut,
  validateParticipantName,
  validateParticipantAge,
  validateParticipantContact,
  type ParticipantErrors,
} from '@features/registration/domain/utils/participant-validation'
import { isChurchInDistrict } from '@features/registration/domain/entities/church-directory'
import { submitStaffRegistration } from '@features/registration/application/use-cases/submit-staff-registration.use-case'
import { useState } from 'react'

function validate(values: StaffRegistrationFormValues): FormikErrors<StaffRegistrationFormValues> {
  const errors: FormikErrors<StaffRegistrationFormValues> = {}

  if (!values.districtName.trim()) errors.districtName = 'Debes seleccionar un distrito.'
  if (!values.churchOrigin.trim()) {
    errors.churchOrigin = 'La iglesia de origen es obligatoria.'
  } else if (!isChurchInDistrict(values.districtName, values.churchOrigin)) {
    errors.churchOrigin = 'Selecciona una iglesia válida del distrito elegido.'
  }

  const proxy: ParticipantErrors = {}
  validateParticipantRut(proxy, values.rut.trim())
  validateParticipantName(proxy, 'firstName', values.firstName.trim(), 'El nombre es obligatorio.')
  validateParticipantName(proxy, 'lastName', values.lastName.trim(), 'El apellido es obligatorio.')
  validateParticipantAge(proxy, values.age)
  validateParticipantContact(proxy, values.phone.trim(), values.email.trim())
  if (!values.staffType) errors.staffType = 'Debes seleccionar un tipo de staff.'
  if (!values.dietType) proxy.dietType = 'Debes seleccionar un tipo de alimentación.'

  if (proxy.rut) errors.rut = proxy.rut
  if (proxy.firstName) errors.firstName = proxy.firstName
  if (proxy.lastName) errors.lastName = proxy.lastName
  if (proxy.age) errors.age = proxy.age
  if (proxy.dietType) errors.dietType = proxy.dietType
  if (proxy.phone) errors.phone = proxy.phone
  if (proxy.email) errors.email = proxy.email

  if (!values.staffCode.trim()) errors.staffCode = 'El código de staff es obligatorio.'

  if (!values.acceptsTerms) errors.acceptsTerms = 'Debes aceptar los términos y condiciones.'
  if (!values.acceptsPrivacyPolicy) errors.acceptsPrivacyPolicy = 'Debes aceptar la política de privacidad.'

  return errors
}

const initialValues: StaffRegistrationFormValues = {
  districtName: '',
  churchOrigin: '',
  rut: '',
  firstName: '',
  lastName: '',
  age: '',
  staffType: '',
  dietType: '',
  needsAccommodation: false,
  phone: '',
  email: '',
  staffCode: '',
  acceptsTerms: false,
  acceptsPrivacyPolicy: false,
}

export function useStaffRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessScreenVisible, setIsSuccessScreenVisible] = useState(false)
  const [redirectCountdownSeconds, setRedirectCountdownSeconds] = useState(10)

  const memoInitialValues = useMemo(() => initialValues, [])
  const isSubmittingRef = useRef(false)

  const formik = useFormik<StaffRegistrationFormValues>({
    initialValues: memoInitialValues,
    validateOnBlur: true,
    validateOnChange: false,
    validate,
    onSubmit: async (values, helpers) => {
      if (isSubmittingRef.current) return
      isSubmittingRef.current = true
      setIsLoading(true)
      try {
        const result = await submitStaffRegistration(values)
        toast.success(result.apiResponse.message)
        setIsSuccessScreenVisible(true)
        setRedirectCountdownSeconds(10)
        helpers.resetForm({ values: memoInitialValues })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado al enviar la inscripción.')
      } finally {
        setIsLoading(false)
        isSubmittingRef.current = false
      }
    },
  })

  const onRutBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const formatted = formatRutIfNeeded(event.currentTarget.value)
    if (formatted !== event.currentTarget.value) {
      await formik.setFieldValue('rut', formatted, true)
    } else {
      await formik.setFieldTouched('rut', true, true)
    }
  }

  const onPhoneBlur = async (event: FocusEvent<HTMLInputElement>) => {
    const formatted = formatPhoneIfNeeded(event.currentTarget.value)
    if (formatted !== event.currentTarget.value) {
      await formik.setFieldValue('phone', formatted, true)
    } else {
      await formik.setFieldTouched('phone', true, true)
    }
  }

  useEffect(() => {
    if (!isSuccessScreenVisible) return
    globalThis.window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isSuccessScreenVisible])

  useEffect(() => {
    if (!isSuccessScreenVisible) return
    const timer = globalThis.window.setTimeout(() => {
      setRedirectCountdownSeconds((prev) => {
        if (prev <= 1) { setIsSuccessScreenVisible(false); return 10 }
        return prev - 1
      })
    }, 1000)
    return () => globalThis.window.clearTimeout(timer)
  }, [isSuccessScreenVisible, redirectCountdownSeconds])

  return {
    formik,
    isLoading,
    isSuccessScreenVisible,
    redirectCountdownSeconds,
    onRutBlur,
    onPhoneBlur,
    getEmailSuggestions: buildEmailSuggestions,
    staffTypeOptions: STAFF_TYPE_OPTIONS,
    dietOptions: [
      { value: RegistrationDietType.Traditional, label: 'Alimentación tradicional' },
      { value: RegistrationDietType.Vegetarian, label: 'Alimentación vegetariana' },
    ],
  }
}
