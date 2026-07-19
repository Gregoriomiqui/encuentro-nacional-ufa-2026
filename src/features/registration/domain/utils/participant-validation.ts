import type { RegistrationFormRegistrant } from '@features/registration/domain/entities/registration'

const PHONE_REGEX = /^\+56\d{9}$/
const NAME_VALIDATION_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/
const POPULAR_EMAIL_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'live.com', 'proton.me'] as const

export function normalizeRut(rawRut: string): string {
  return rawRut.replaceAll('.', '').replaceAll('-', '').trim()
}

export function formatRutIfNeeded(rawRut: string): string {
  const normalizedRut = normalizeRut(rawRut)
  if (!/^\d{7,8}[0-9Kk]$/.test(normalizedRut)) return rawRut.trim()
  const rutBody = normalizedRut.slice(0, -1)
  const verifierDigit = normalizedRut.slice(-1).toUpperCase()
  return `${rutBody}-${verifierDigit}`
}

export function formatPhoneIfNeeded(rawPhone: string): string {
  const onlyDigits = rawPhone.replace(/\D/g, '')
  if (!onlyDigits) return ''
  if (onlyDigits.startsWith('56')) return `+${onlyDigits}`
  return `+56${onlyDigits}`
}

export function buildEmailSuggestions(rawEmail: string): string[] {
  const atIndex = rawEmail.indexOf('@')
  if (atIndex < 0) return []
  const localPart = rawEmail.slice(0, atIndex).trim()
  const typedDomain = rawEmail.slice(atIndex + 1).trim().toLowerCase()
  if (!localPart) return []
  return POPULAR_EMAIL_DOMAINS.filter((domain) => domain.startsWith(typedDomain)).map((domain) => `${localPart}@${domain}`)
}

export function isValidEmailFormat(email: string): boolean {
  const trimmed = email.trim()
  if (!trimmed || trimmed.includes(' ')) return false
  const atIndex = trimmed.indexOf('@')
  const lastAtIndex = trimmed.lastIndexOf('@')
  if (atIndex <= 0 || atIndex !== lastAtIndex || atIndex === trimmed.length - 1) return false
  const localPart = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)
  if (!localPart || !domain || domain.startsWith('.') || domain.endsWith('.')) return false
  const domainParts = domain.split('.')
  return domainParts.length >= 2 && domainParts.every((part) => part.length > 0)
}

function getRutVerifierDigit(rutBody: string): string {
  let sum = 0
  let multiplier = 2
  for (let index = rutBody.length - 1; index >= 0; index -= 1) {
    sum += Number(rutBody[index]) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }
  const remainder = 11 - (sum % 11)
  if (remainder === 11) return '0'
  if (remainder === 10) return 'K'
  return String(remainder)
}

export function isValidRut(rut: string): boolean {
  const normalizedRut = normalizeRut(rut)
  if (!/^\d{7,8}[0-9Kk]$/.test(normalizedRut)) return false
  const rutBody = normalizedRut.slice(0, -1)
  const providedVerifier = normalizedRut.slice(-1).toUpperCase()
  return getRutVerifierDigit(rutBody) === providedVerifier
}

export type ParticipantErrors = Partial<Record<keyof RegistrationFormRegistrant, string>>

function setError(errors: ParticipantErrors, field: keyof RegistrationFormRegistrant, message: string) {
  errors[field] = message
}

export function validateParticipantRut(errors: ParticipantErrors, rut: string) {
  if (!rut) { setError(errors, 'rut', 'El RUT es obligatorio.'); return }
  if (!isValidRut(rut)) setError(errors, 'rut', 'RUT invalido. Verifica formato y digito verificador (ejemplo: 12345678-9).')
}

export function validateParticipantName(errors: ParticipantErrors, field: 'firstName' | 'lastName', value: string, emptyMessage: string) {
  if (!value) { setError(errors, field, emptyMessage); return }
  if (!NAME_VALIDATION_REGEX.test(value)) setError(errors, field, 'El nombre solo puede contener letras.')
}

export function validateParticipantAge(errors: ParticipantErrors, ageRaw: string) {
  if (!ageRaw.trim()) { setError(errors, 'age', 'La edad es obligatoria.'); return }
  const age = Number(ageRaw)
  if (!Number.isInteger(age) || age < 12 || age > 120) setError(errors, 'age', 'Ingresa una edad válida entre 12 y 120 años.')
}

export function validateParticipantContact(errors: ParticipantErrors, phone: string, email: string) {
  if (!phone) {
    setError(errors, 'phone', 'El telefono es obligatorio.')
  } else if (!PHONE_REGEX.test(formatPhoneIfNeeded(phone))) {
    setError(errors, 'phone', 'Formato de telefono invalido. Debe ser +56 y 9 digitos (12 caracteres en total).')
  }
  if (!email) {
    setError(errors, 'email', 'El email es obligatorio.')
  } else if (!isValidEmailFormat(email)) {
    setError(errors, 'email', 'Ingresa un email valido.')
  }
}
