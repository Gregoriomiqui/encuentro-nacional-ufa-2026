import type { RegistrationDietType } from './registration'

export type StaffRegistrationFormValues = {
  districtName: string
  churchOrigin: string
  rut: string
  firstName: string
  lastName: string
  age: string
  dietType: '' | RegistrationDietType
  needsAccommodation: boolean
  phone: string
  email: string
  staffCode: string
  acceptsTerms: boolean
  acceptsPrivacyPolicy: boolean
}

export type StaffRegistrationPayload = {
  district_name: string
  church_origin: string
  staff_code: string
  accepts_terms: boolean
  accepts_privacy_policy: boolean
  registrant: {
    rut: string
    first_name: string
    last_name: string
    age: number
    diet_type: RegistrationDietType
    needs_accommodation: boolean
    phone: string
    email: string
  }
}
