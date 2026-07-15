import { env } from '@shared/config/env'
import { getFirebaseAuth } from '@shared/lib/firebase/firebase'
import type {
  FailedRegistrationValidationPayload,
  FailedRegistrationValidationResponse,
} from '@features/failed-registration-validation/domain/entities/failed-registration-validation'

export class FailedRegistrationValidationApiError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'FailedRegistrationValidationApiError'
    this.statusCode = statusCode
  }
}

function isFailedValidationResponse(data: unknown): data is FailedRegistrationValidationResponse {
  if (!data || typeof data !== 'object') {
    return false
  }

  const candidate = data as Record<string, unknown>

  return typeof candidate.success === 'boolean' && typeof candidate.message === 'string'
}

export async function validateFailedRegistrationInMake(
  payload: FailedRegistrationValidationPayload,
): Promise<FailedRegistrationValidationResponse> {
  if (!env.makeWebhookUrl || !env.makeWebhookApiKey || !env.makeFailedValidationPath) {
    throw new Error(
      'Faltan variables de entorno para validar un registro fallido (VITE_MAKE_WEBHOOK_URL, VITE_MAKE_API_KEY y VITE_MAKE_FAILED_VALIDATION_PATH).',
    )
  }

  const auth = getFirebaseAuth()
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('Debes iniciar sesión para validar un registro fallido.')
  }

  const idToken = await currentUser.getIdToken()

  const response = await fetch(`${env.makeWebhookUrl}${env.makeFailedValidationPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-make-apikey': env.makeWebhookApiKey,
      Authorization: idToken,
    },
    body: JSON.stringify({ registration_id: payload.registration_id }),
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new FailedRegistrationValidationApiError(400, 'El id de registro no es valido.')
    }

    if (response.status === 404) {
      throw new FailedRegistrationValidationApiError(404, 'No se encontro un registro asociado al id ingresado.')
    }

    if (response.status === 500) {
      throw new FailedRegistrationValidationApiError(500, 'Error interno del servidor. Intenta nuevamente mas tarde.')
    }

    throw new FailedRegistrationValidationApiError(response.status, 'No se pudo validar el registro. Intenta nuevamente.')
  }

  const data: unknown = await response.json()

  if (!isFailedValidationResponse(data)) {
    throw new TypeError('Formato de respuesta invalido al validar el registro.')
  }

  if (!data.success) {
    throw new Error(data.message || 'No fue posible validar el registro.')
  }

  return data
}
