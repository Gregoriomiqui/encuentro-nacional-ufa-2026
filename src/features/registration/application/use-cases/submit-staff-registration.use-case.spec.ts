import { describe, expect, it, vi } from 'vitest'

import { submitStaffRegistration } from './submit-staff-registration.use-case'
import { sendStaffRegistration } from '@features/registration/infrastructure/repositories/send-staff-registration.repository'
import { RegistrationDietType } from '@features/registration/domain/entities/registration'
import type { StaffRegistrationFormValues } from '@features/registration/domain/entities/staff-registration'

vi.mock('@features/registration/infrastructure/repositories/send-staff-registration.repository', () => ({
  sendStaffRegistration: vi.fn().mockResolvedValue({ success: true, message: 'ok' }),
}))

describe('submitStaffRegistration', () => {
  it('always sends needs_accommodation as false', async () => {
    const values: StaffRegistrationFormValues = {
      districtName: 'Distrito Norte',
      churchOrigin: 'Arica',
      staffType: 'ALOJAMIENTO',
      staffCode: 'STAFF-2026',
      acceptsTerms: true,
      acceptsPrivacyPolicy: true,
      rut: '11111111-1',
      firstName: 'Ana',
      lastName: 'Perez',
      age: '28',
      dietType: RegistrationDietType.Traditional,
      needsAccommodation: true,
      phone: '+56911111111',
      email: 'ana@example.com',
    }

    await submitStaffRegistration(values)

    expect(sendStaffRegistration).toHaveBeenCalledTimes(1)
    const [firstCall] = vi.mocked(sendStaffRegistration).mock.calls
    if (!firstCall) {
      throw new Error('sendStaffRegistration was not called')
    }
    const [payload] = firstCall
    expect(payload.registrant.needs_accommodation).toBe(false)
  })
})
