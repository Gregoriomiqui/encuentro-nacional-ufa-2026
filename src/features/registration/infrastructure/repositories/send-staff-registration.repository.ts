import { env } from '@shared/config/env'
import { RegistrationApiError } from './make-registration.repository'
import type { MakeRegistrationResponse } from './make-registration.repository'
import type { StaffRegistrationPayload } from '@features/registration/domain/entities/staff-registration'

const MAKE_STAFF_REGISTRATION_PATH = '/6yau4g3ufgp4q5lpjpfj69y4sxku87hm'

export async function sendStaffRegistration(payload: StaffRegistrationPayload): Promise<MakeRegistrationResponse> {
  if (!env.makeWebhookUrl || !env.makeWebhookApiKey) {
    throw new Error('Faltan variables de entorno para enviar la inscripción de staff.')
  }

  const response = await fetch(`${env.makeWebhookUrl}${MAKE_STAFF_REGISTRATION_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-make-apikey': env.makeWebhookApiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '(no body)')
    console.error('[staff-registration] HTTP error', response.status, errorBody)
    if (response.status === 409) {
      throw new RegistrationApiError(409, 'Ya existe una inscripción de staff con este RUT.')
    }
    if (response.status === 500) {
      throw new RegistrationApiError(500, 'Error interno del servidor. Intenta nuevamente más tarde.')
    }
    throw new RegistrationApiError(response.status, 'No se pudo enviar la inscripción de staff. Intenta nuevamente.')
  }

  const data: MakeRegistrationResponse = await response.json()
  console.log('[staff-registration] response body', data)

  if (!data.success) {
    throw new Error(data.message || 'La inscripción de staff no pudo ser procesada. Intenta nuevamente.')
  }

  return data
}
