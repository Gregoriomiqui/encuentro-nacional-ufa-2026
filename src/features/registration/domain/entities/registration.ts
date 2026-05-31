export const REGISTRATION_FEE_CLP = 50000
export const MAX_COMPANIONS = 4
export const CHURCH_ORIGIN = 'ACYM_LA_FLORIDA'

export type RegistrationRegistrant = {
  rut: string
  first_name: string
  last_name: string
  phone: string
  email: string
  is_primary_contact: boolean
}

export type RegistrationPayload = {
  receipt_base64: string
  church_origin: string
  registrants: RegistrationRegistrant[]
}

export type RegistrationFormRegistrant = {
  rut: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

export type RegistrationFormValues = {
  companionCount: number
  districtName: string
  churchOrigin: string
  receiptBase64: string
  receiptFileName: string
  registrants: RegistrationFormRegistrant[]
}
