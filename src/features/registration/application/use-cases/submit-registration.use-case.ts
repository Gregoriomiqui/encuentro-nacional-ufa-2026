import type {
  RegistrationFormRegistrant,
  RegistrationFormValues,
  RegistrationRegistrant,
  RegistrationPayload,
} from '@features/registration/domain/entities/registration'
import { RegistrationDietType } from '@features/registration/domain/entities/registration'
import { sendRegistration, type MakeRegistrationResponse } from '@features/registration/infrastructure/repositories/make-registration.repository'

export type SubmitRegistrationResult = {
  payload: RegistrationPayload
  apiResponse: MakeRegistrationResponse
}

function toRegistrantDietType(dietType: RegistrationFormRegistrant['dietType']): RegistrationRegistrant['diet_type'] {
  if (dietType === RegistrationDietType.Traditional || dietType === RegistrationDietType.Vegetarian) {
    return dietType
  }

  throw new Error('Tipo de alimentacion invalido. Selecciona alimentacion tradicional o vegetariana.')
}

export async function submitRegistration(
  values: RegistrationFormValues,
  totalParticipants: number,
  workshopsBySchedule: { am: { id: string; workshop: string }[]; pm: { id: string; workshop: string }[] },
): Promise<SubmitRegistrationResult> {
  const amMap = new Map(workshopsBySchedule.am.map((w) => [w.id, w.workshop]))
  const pmMap = new Map(workshopsBySchedule.pm.map((w) => [w.id, w.workshop]))

  const payload: RegistrationPayload = {
    receipt: {
      base64: values.receiptBase64,
      mime_type: values.receiptMimeType,
      filename: values.receiptFileName,
    },
    district_name: values.districtName,
    church_origin: values.churchOrigin,
    accepts_terms: values.acceptsTerms,
    accepts_image_authorization: values.acceptsImageAuthorization,
    registrants: values.registrants.slice(0, totalParticipants).map((registrant, index) => {
      const workshopChoices: RegistrationRegistrant['workshop_choices'] = []

      if (registrant.workshopAm) {
        workshopChoices.push({ id: registrant.workshopAm, workshop: amMap.get(registrant.workshopAm) ?? '', schedule: 'am' })
      }
      if (registrant.workshopPm) {
        workshopChoices.push({ id: registrant.workshopPm, workshop: pmMap.get(registrant.workshopPm) ?? '', schedule: 'pm' })
      }

      return {
        rut: registrant.rut.trim(),
        first_name: registrant.firstName.trim(),
        last_name: registrant.lastName.trim(),
        age: Number(registrant.age),
        diet_type: toRegistrantDietType(registrant.dietType),
        needs_accommodation: registrant.needsAccommodation,
        workshop_choices: workshopChoices,
        phone: registrant.phone.trim(),
        email: registrant.email.trim().toLowerCase(),
        is_primary_contact: index === 0,
      }
    }),
  }

  const apiResponse = await sendRegistration(payload)

  return { payload, apiResponse }
}
