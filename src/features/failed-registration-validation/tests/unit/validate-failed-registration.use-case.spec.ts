import { describe, expect, it, vi } from 'vitest'

import type { FailedRegistrationValidationPort } from '@features/failed-registration-validation/application/ports/failed-registration-validation.port'
import { validateFailedRegistration } from '@features/failed-registration-validation/application/use-cases/validate-failed-registration.use-case'

describe('validateFailedRegistration', () => {
  it('normaliza campos y envia el payload al repositorio', async () => {
    const validateMock = vi.fn<FailedRegistrationValidationPort['validateFailedRegistration']>().mockResolvedValue({
      success: true,
      message: 'Registro validado',
    })

    const fakeRepository: FailedRegistrationValidationPort = {
      validateFailedRegistration: validateMock,
    }

    const result = await validateFailedRegistration(
      {
        registrationId: '  REG-2026-001  ',
      },
      fakeRepository,
    )

    expect(validateMock).toHaveBeenCalledWith({
      registration_id: 'REG-2026-001',
    })

    expect(result.apiResponse).toEqual({
      success: true,
      message: 'Registro validado',
    })
  })

  it('lanza error cuando falta id de registro', async () => {
    await expect(
      validateFailedRegistration(
        {
          registrationId: '   ',
        },
        {
          validateFailedRegistration: vi.fn(),
        },
      ),
    ).rejects.toThrow('El id de registro es obligatorio.')
  })
})
