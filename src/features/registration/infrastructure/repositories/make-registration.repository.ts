import { env } from '@shared/config/env'
import { supabase } from '@shared/lib/supabase/supabase'
import type { RegistrationPayload, WorkshopOption, WorkshopsBySchedule } from '@features/registration/domain/entities/registration'

const MAKE_REGISTRATION_PATH = '/ycww8er2htyap4dikfsqdk6xwy9o5ut6'
const DEFAULT_SUPABASE_WORKSHOPS_AM_TABLE = 'workshops_am'
const DEFAULT_SUPABASE_WORKSHOPS_PM_TABLE = 'workshops_pm'

export type MakeRegistrationResponse = {
  success: boolean
  message: string
}

export class RegistrationApiError extends Error {
  readonly statusCode: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'RegistrationApiError'
    this.statusCode = statusCode
  }
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value === 1
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on'
  }

  return false
}

function normalizeCount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return 0
}

function normalizeWorkshopOption(raw: unknown): WorkshopOption | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const candidate = raw as Record<string, unknown>
  const id = candidate.id
  const idWorkshop = candidate.idWorshop ?? candidate.idWorkshop ?? candidate.id_workshop
  const workshop = candidate.workshop
  const countRegistered = candidate.countRegistered ?? candidate.count_registered
  const isEnabled = candidate.isEnabled ?? candidate.is_enabled

  if (
    typeof id !== 'string' ||
    typeof idWorkshop !== 'string' ||
    typeof workshop !== 'string'
  ) {
    return null
  }

  return {
    id,
    idWorkshop,
    workshop,
    countRegistered: normalizeCount(countRegistered),
    isEnabled: normalizeBoolean(isEnabled),
  }
}

export async function fetchWorkshopOptions(): Promise<WorkshopsBySchedule> {
  const amTable = env.supabaseWorkshopsAmTable || DEFAULT_SUPABASE_WORKSHOPS_AM_TABLE
  const pmTable = env.supabaseWorkshopsPmTable || DEFAULT_SUPABASE_WORKSHOPS_PM_TABLE
  const [amResult, pmResult] = await Promise.all([
    supabase.from(amTable).select('*').eq('isEnabled', true),
    supabase.from(pmTable).select('*').eq('isEnabled', true),
  ])

  if (amResult.error || pmResult.error) {
    const error = amResult.error || pmResult.error
    throw new RegistrationApiError(error?.code ? Number(error.code) || 400 : 400, 'No se pudo obtener la lista de talleres.')
  }

  return {
    am: amResult.data.map(normalizeWorkshopOption).filter((option): option is WorkshopOption => option !== null),
    pm: pmResult.data.map(normalizeWorkshopOption).filter((option): option is WorkshopOption => option !== null),
  }
}

export async function sendRegistration(payload: RegistrationPayload): Promise<MakeRegistrationResponse> {
  if (!env.makeWebhookUrl || !env.makeWebhookApiKey) {
    throw new Error('Faltan variables de entorno para enviar la inscripción (VITE_MAKE_WEBHOOK_URL y VITE_MAKE_API_KEY).')
  }

  const response = await fetch(`${env.makeWebhookUrl}${MAKE_REGISTRATION_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-make-apikey': env.makeWebhookApiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new RegistrationApiError(400, 'Inscripción fallida')
    }
    if (response.status === 409) {
      throw new RegistrationApiError(409, 'Falla en comprobante de pago, ponerse en contacto con el directorio nacional de la Unión Femenina Aliancista')
    }
    if (response.status === 500) {
      throw new RegistrationApiError(500, 'Error interno del servidor. Intenta nuevamente más tarde.')
    }
    throw new RegistrationApiError(response.status, 'No se pudo enviar la inscripción. Intenta nuevamente.')
  }

  const data: MakeRegistrationResponse = await response.json()

  if (!data.success) {
    throw new Error(data.message || 'La inscripción no pudo ser procesada. Intenta nuevamente.')
  }

  return data
}
