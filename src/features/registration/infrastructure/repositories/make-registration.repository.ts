import { env } from '@shared/config/env'
import type { RegistrationPayload, WorkshopOption, WorkshopsBySchedule } from '@features/registration/domain/entities/registration'

const MAKE_REGISTRATION_PATH = '/ycww8er2htyap4dikfsqdk6xwy9o5ut6'
const MAKE_WORKSHOPS_PATH = '/y5dyby9m30ni4v622lciw7snc03b35ng'

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

function normalizeWorkshopOption(raw: unknown): WorkshopOption | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }

  const candidate = raw as Record<string, unknown>
  const id = candidate.id
  const idWorkshop = candidate.idWorshop ?? candidate.idWorkshop
  const workshop = candidate.workshop
  const countRegistered = candidate.countRegistered
  const isEnabled = candidate.isEnabled

  if (
    typeof id !== 'string' ||
    typeof idWorkshop !== 'string' ||
    typeof workshop !== 'string' ||
    typeof countRegistered !== 'number' ||
    typeof isEnabled !== 'boolean'
  ) {
    return null
  }

  return {
    id,
    idWorkshop,
    workshop,
    countRegistered,
    isEnabled,
  }
}

export async function fetchWorkshopOptions(): Promise<WorkshopsBySchedule> {
  if (!env.makeWebhookUrl || !env.makeWebhookApiKey) {
    throw new Error('Faltan variables de entorno para obtener talleres (VITE_MAKE_WEBHOOK_URL y VITE_MAKE_API_KEY).')
  }

  const response = await fetch(`${env.makeWebhookUrl}${MAKE_WORKSHOPS_PATH}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-make-apikey': env.makeWebhookApiKey,
    },
  })

  if (!response.ok) {
    throw new RegistrationApiError(response.status, 'No se pudo obtener la lista de talleres.')
  }

  const data: unknown = await response.json()

  if (!data || typeof data !== 'object' || !('am' in data) || !('pm' in data)) {
    throw new TypeError('Formato de talleres invalido. Se esperaba un objeto con am y pm.')
  }

  const raw = data as { am: unknown[]; pm: unknown[] }

  return {
    am: (Array.isArray(raw.am) ? raw.am : []).map(normalizeWorkshopOption).filter((o): o is WorkshopOption => o !== null),
    pm: (Array.isArray(raw.pm) ? raw.pm : []).map(normalizeWorkshopOption).filter((o): o is WorkshopOption => o !== null),
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
