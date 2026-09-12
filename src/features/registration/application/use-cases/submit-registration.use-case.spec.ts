import { describe, expect, it, vi } from 'vitest'

import type { RegistrationPort } from '@features/registration/application/ports/registration.port'
import { submitRegistration } from '@features/registration/application/use-cases/submit-registration.use-case'
import { RegistrationDietType, type RegistrationFormValues } from '@features/registration/domain/entities/registration'

describe('submitRegistration', () => {
  it('normaliza los datos y delega el envio al puerto de inscripcion', async () => {
    const submit = vi.fn<RegistrationPort['submit']>().mockResolvedValue({
      success: true,
      message: 'Inscripcion recibida',
    })
    const values: RegistrationFormValues = {
      companionCount: 0,
      districtName: 'Distrito Centro',
      churchOrigin: 'La Florida',
      receiptBase64: 'base64:receipt',
      receiptFileName: 'receipt.png',
      receiptMimeType: 'image/png',
      acceptsTerms: true,
      acceptsImageAuthorization: true,
      registrants: [{
        rut: ' 12.345.678-5 ',
        firstName: ' Ana ',
        lastName: ' Perez ',
        age: '35',
        dietType: RegistrationDietType.Vegetarian,
        needsAccommodation: true,
        workshopAm: 'am-1',
        workshopPm: 'pm-1',
        phone: ' +56912345678 ',
        email: ' ANA@EXAMPLE.COM ',
      }],
    }

    const result = await submitRegistration(
      values,
      1,
      {
        am: [{ id: 'am-1', workshop: 'Liderazgo' }],
        pm: [{ id: 'pm-1', workshop: 'Discipulado' }],
      },
      { submit },
    )

    expect(submit).toHaveBeenCalledOnce()
    expect(result.payload.registrants[0]).toEqual(expect.objectContaining({
      rut: '12.345.678-5',
      first_name: 'Ana',
      last_name: 'Perez',
      age: 35,
      email: 'ana@example.com',
      is_primary_contact: true,
    }))
    expect(result.apiResponse.message).toBe('Inscripcion recibida')
  })
})