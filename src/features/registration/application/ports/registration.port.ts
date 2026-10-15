import type { RegistrationPayload } from '@features/registration/domain/entities/registration'
import type { StaffRegistrationPayload } from '@features/registration/domain/entities/staff-registration'

export type RegistrationResponse = {
  success: boolean
  message: string
}

export interface RegistrationPort {
  submit(payload: RegistrationPayload): Promise<RegistrationResponse>
}

export interface StaffRegistrationPort {
  submit(payload: StaffRegistrationPayload): Promise<RegistrationResponse>
}