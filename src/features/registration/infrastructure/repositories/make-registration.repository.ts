import { env } from '@shared/config/env'
import type { RegistrationPayload } from '@features/registration/domain/entities/registration'

export type MakeRegistrationResponse = {
  success: boolean
  message: string
}

export async function sendRegistration(payload: RegistrationPayload): Promise<MakeRegistrationResponse> {
  if (!env.makeWebhookUrl || !env.makeWebhookApiKey) {
    throw new Error('Faltan variables de entorno para enviar la inscripción (VITE_MAKE_WEBHOOK_URL y VITE_MAKE_API_KEY).')
  }

  const response = await fetch(env.makeWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-make-apikey': env.makeWebhookApiKey,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('No se pudo enviar la inscripción. Intenta nuevamente.')
  }

  const data: MakeRegistrationResponse = await response.json()

  if (!data.success) {
    throw new Error(data.message || 'La inscripción no pudo ser procesada. Intenta nuevamente.')
  }

  return data
}
