export const REGISTRATION_FEE_CLP = 50000
export const MAX_COMPANIONS = 4
export const CHURCH_ORIGIN = 'ACYM_LA_FLORIDA'

export const RegistrationDietType = {
  Traditional: 'TRADICIONAL',
  Vegetarian: 'VEGETARIANA',
} as const

export type RegistrationDietType = (typeof RegistrationDietType)[keyof typeof RegistrationDietType]

export type RegistrationRegistrant = {
  rut: string
  first_name: string
  last_name: string
  age: number
  diet_type: RegistrationDietType
  needs_accommodation: boolean
  workshop_choices: WorkshopChoice[]
  phone: string
  email: string
  is_primary_contact: boolean
}

export interface WorkshopOption {
  id: string
  idWorkshop: string
  workshop: string
  countRegistered: number
  isEnabled: boolean
}

export interface WorkshopsBySchedule {
  am: WorkshopOption[]
  pm: WorkshopOption[]
}

export type WorkshopSchedule = 'am' | 'pm'

export interface WorkshopChoice {
  id: string
  workshop: string
  schedule: WorkshopSchedule
}

export type RegistrationPayload = {
  receipt: {
    base64: string
    mime_type: string
    filename: string
  }
  district_name: string
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
  dietType: '' | RegistrationDietType
  needsAccommodation: boolean
  workshopAm: string
  workshopPm: string
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
