import { env } from '@shared/config/env'
import type { RegistrationPayload } from '@features/registration/domain/entities/registration'

export async function sendRegistration(payload: RegistrationPayload): Promise<void> {
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
}
