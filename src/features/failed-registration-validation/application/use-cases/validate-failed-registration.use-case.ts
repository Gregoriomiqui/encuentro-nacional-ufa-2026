import type {
  FailedRegistrationValidationFormValues,
  FailedRegistrationValidationPayload,
  FailedRegistrationValidationResponse,
} from '@features/failed-registration-validation/domain/entities/failed-registration-validation'
import type { FailedRegistrationValidationPort } from '@features/failed-registration-validation/application/ports/failed-registration-validation.port'
import { validateFailedRegistrationInMake } from '@features/failed-registration-validation/infrastructure/repositories/make-failed-registration-validation.repository'

export type ValidateFailedRegistrationResult = {
  payload: FailedRegistrationValidationPayload
  apiResponse: FailedRegistrationValidationResponse
}

function normalizeRegistrationId(value: string): string {
  return value.trim()
}

export async function validateFailedRegistration(
  values: FailedRegistrationValidationFormValues,
  repository: FailedRegistrationValidationPort = {
    validateFailedRegistration: validateFailedRegistrationInMake,
  },
): Promise<ValidateFailedRegistrationResult> {
  const registrationId = normalizeRegistrationId(values.registrationId)

  if (!registrationId) {
    throw new Error('El id de registro es obligatorio.')
  }

  const payload: FailedRegistrationValidationPayload = {
    registration_id: registrationId,
  }

  const apiResponse = await repository.validateFailedRegistration(payload)

  return {
    payload,
    apiResponse,
  }
}
