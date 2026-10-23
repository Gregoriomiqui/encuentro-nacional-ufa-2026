import { describe, expect, it, vi } from 'vitest'

import { submitRegistration } from './submit-registration.use-case'
import { sendRegistration } from '@features/registration/infrastructure/repositories/make-registration.repository'
import { RegistrationDietType, type RegistrationFormValues } from '@features/registration/domain/entities/registration'

vi.mock('@features/registration/infrastructure/repositories/make-registration.repository', () => ({
  sendRegistration: vi.fn().mockResolvedValue({ success: true, message: 'ok' }),
}))

describe('submitRegistration', () => {
  it('always sends needs_accommodation as false for all participants', async () => {
    const values: RegistrationFormValues = {
      companionCount: 1,
      districtName: 'Distrito Norte',
      churchOrigin: 'Arica',
      receiptBase64: 'base64:test',
      receiptFileName: 'recibo.jpg',
      receiptMimeType: 'image/jpeg',
      acceptsTerms: true,
      acceptsImageAuthorization: true,
      registrants: [
        {
          rut: '11111111-1',
          firstName: 'Ana',
          lastName: 'Perez',
          age: '28',
          dietType: RegistrationDietType.Traditional,
          needsAccommodation: true,
          workshopAm: '',
          workshopPm: '',
          phone: '+56911111111',
          email: 'ana@example.com',
        },
        {
          rut: '22222222-2',
          firstName: 'Berta',
          lastName: 'Lopez',
          age: '30',
          dietType: RegistrationDietType.Vegetarian,
          needsAccommodation: true,
          workshopAm: '',
          workshopPm: '',
          phone: '+56922222222',
          email: 'berta@example.com',
        },
      ],
    }

    await submitRegistration(values, 2, { am: [], pm: [] })

    expect(sendRegistration).toHaveBeenCalledTimes(1)
    const payload = vi.mocked(sendRegistration).mock.calls[0][0]
    expect(payload.registrants).toHaveLength(2)
    expect(payload.registrants[0]?.needs_accommodation).toBe(false)
    expect(payload.registrants[1]?.needs_accommodation).toBe(false)
  })
})
