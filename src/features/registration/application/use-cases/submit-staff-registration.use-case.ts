import { RegistrationDietType } from '@features/registration/domain/entities/registration'
import {
  STAFF_TYPE_VALUES,
  type StaffRegistrationFormValues,
  type StaffRegistrationPayload,
  type StaffType,
} from '@features/registration/domain/entities/staff-registration'
import { sendStaffRegistration } from '@features/registration/infrastructure/repositories/send-staff-registration.repository'
import type { MakeRegistrationResponse } from '@features/registration/infrastructure/repositories/make-registration.repository'

export type SubmitStaffRegistrationResult = {
  payload: StaffRegistrationPayload
  apiResponse: MakeRegistrationResponse
}

function toDietType(value: StaffRegistrationFormValues['dietType']): RegistrationDietType {
  if (value === RegistrationDietType.Traditional || value === RegistrationDietType.Vegetarian) {
    return value
  }
  throw new Error('Tipo de alimentación inválido.')
}

function toStaffType(value: StaffRegistrationFormValues['staffType']): StaffType {
  if (STAFF_TYPE_VALUES.includes(value as StaffType)) {
    return value as StaffType
  }
  throw new Error('Tipo de staff inválido.')
}

export async function submitStaffRegistration(values: StaffRegistrationFormValues): Promise<SubmitStaffRegistrationResult> {
  const payload: StaffRegistrationPayload = {
    district_name: values.districtName,
    church_origin: values.churchOrigin,
    staff_type: toStaffType(values.staffType),
    staff_code: values.staffCode.trim(),
    accepts_terms: values.acceptsTerms,
    accepts_privacy_policy: values.acceptsPrivacyPolicy,
    registrant: {
      rut: values.rut.trim(),
      first_name: values.firstName.trim(),
      last_name: values.lastName.trim(),
      age: Number(values.age),
      diet_type: toDietType(values.dietType),
      needs_accommodation: values.needsAccommodation,
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
    },
  }

  const apiResponse = await sendStaffRegistration(payload)
  console.log('[staff-registration] payload sent', JSON.stringify(payload, null, 2))
  return { payload, apiResponse }
}
