import type {
  RegistrationFormValues,
  RegistrationPayload,
} from '@features/registration/domain/entities/registration'
import { sendRegistration, type MakeRegistrationResponse } from '@features/registration/infrastructure/repositories/make-registration.repository'

export type SubmitRegistrationResult = {
  payload: RegistrationPayload
  apiResponse: MakeRegistrationResponse
}

export async function submitRegistration(
  values: RegistrationFormValues,
  totalParticipants: number,
): Promise<SubmitRegistrationResult> {
  const payload: RegistrationPayload = {
    receipt: {
      base64: values.receiptBase64,
      mime_type: values.receiptMimeType,
      filename: values.receiptFileName,
    },
    church_origin: values.churchOrigin,
    registrants: values.registrants.slice(0, totalParticipants).map((registrant, index) => ({
      rut: registrant.rut.trim(),
      first_name: registrant.firstName.trim(),
      last_name: registrant.lastName.trim(),
      phone: registrant.phone.trim(),
      email: registrant.email.trim().toLowerCase(),
      is_primary_contact: index === 0,
    })),
  }

  const apiResponse = await sendRegistration(payload)

  return { payload, apiResponse }
}
