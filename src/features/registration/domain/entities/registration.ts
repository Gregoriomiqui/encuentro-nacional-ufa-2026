export const REGISTRATION_FEE_CLP = 50000
export const MAX_COMPANIONS = 4
export const CHURCH_ORIGIN = 'ACYM_LA_FLORIDA'

export type RegistrationRegistrant = {
  rut: string
  first_name: string
  last_name: string
  age: number
  diet_type: 'traditional' | 'vegetarian'
  workshop_choices: string[]
  phone: string
  email: string
  is_primary_contact: boolean
}

export type RegistrationPayload = {
  receipt: {
    base64: string
    mime_type: string
    filename: string
  }
  church_origin: string
  accepts_terms: boolean
  accepts_image_authorization: boolean
  registrants: RegistrationRegistrant[]
}

export type RegistrationFormRegistrant = {
  rut: string
  firstName: string
  lastName: string
  age: string
  dietType: '' | 'traditional' | 'vegetarian'
  workshops: string[]
  phone: string
  email: string
}

export type RegistrationFormValues = {
  companionCount: number
  districtName: string
  churchOrigin: string
  receiptBase64: string
  receiptFileName: string
  receiptMimeType: string
  acceptsTerms: boolean
  acceptsImageAuthorization: boolean
  registrants: RegistrationFormRegistrant[]
}
