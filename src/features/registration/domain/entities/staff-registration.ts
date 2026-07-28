import type { RegistrationDietType } from './registration'

export const STAFF_TYPE_VALUES = [
  'ALOJAMIENTO',
  'SEGURIDAD',
  'ACREDITACION',
  'ALABANZA',
  'EQUIPO_DE_SALUD',
  'TALLERISTA',
  'EXPOSITORES',
  'DIRECTORIO_NACIONAL',
  'COORDINADORA_DE_TALLERES',
  'COORDINADORA_DE_PISO',
  'OTRO',
] as const

export type StaffType = (typeof STAFF_TYPE_VALUES)[number]

export const STAFF_TYPE_OPTIONS: ReadonlyArray<{ value: StaffType; label: string }> = [
  { value: 'ALOJAMIENTO', label: 'Alojamiento' },
  { value: 'SEGURIDAD', label: 'Seguridad' },
  { value: 'ACREDITACION', label: 'Acreditación' },
  { value: 'ALABANZA', label: 'Alabanza' },
  { value: 'EQUIPO_DE_SALUD', label: 'Equipo de salud' },
  { value: 'TALLERISTA', label: 'Tallerista' },
  { value: 'EXPOSITORES', label: 'Expositores' },
  { value: 'DIRECTORIO_NACIONAL', label: 'Directorio nacional' },
  { value: 'COORDINADORA_DE_TALLERES', label: 'Coordinadora de Talleres' },
  { value: 'COORDINADORA_DE_PISO', label: 'Coordinadora de piso' },
  { value: 'OTRO', label: 'Otro' },
]

export type StaffRegistrationFormValues = {
  districtName: string
  churchOrigin: string
  rut: string
  firstName: string
  lastName: string
  age: string
  staffType: '' | StaffType
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
  staff_type: StaffType
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
