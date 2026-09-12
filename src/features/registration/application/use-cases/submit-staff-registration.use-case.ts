import { RegistrationDietType } from '@features/registration/domain/entities/registration'
import {
  STAFF_TYPE_VALUES,
  type StaffRegistrationFormValues,
  type StaffRegistrationPayload,
  type StaffType,
} from '@features/registration/domain/entities/staff-registration'
import type {
  RegistrationResponse,
  StaffRegistrationPort,
} from '@features/registration/application/ports/registration.port'

export type SubmitStaffRegistrationResult = {
  payload: StaffRegistrationPayload
  apiResponse: RegistrationResponse
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

export async function submitStaffRegistration(
  values: StaffRegistrationFormValues,
  repository: StaffRegistrationPort,
): Promise<SubmitStaffRegistrationResult> {
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

  const apiResponse = await repository.submit(payload)
  return { payload, apiResponse }
}
