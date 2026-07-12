import type {
  FailedRegistrationValidationPayload,
  FailedRegistrationValidationResponse,
} from '@features/failed-registration-validation/domain/entities/failed-registration-validation'

export interface FailedRegistrationValidationPort {
  validateFailedRegistration(
    payload: FailedRegistrationValidationPayload,
  ): Promise<FailedRegistrationValidationResponse>
}
