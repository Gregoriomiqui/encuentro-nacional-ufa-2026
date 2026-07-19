import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import toast from 'react-hot-toast'

import { submitStaffRegistration } from '@features/registration/application/use-cases/submit-staff-registration.use-case'
import { useStaffRegistration } from './useStaffRegistration'

vi.mock('@features/registration/application/use-cases/submit-staff-registration.use-case')
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

const VALID_VALUES = {
  districtName: 'Distrito Norte',
  churchOrigin: 'Arica',
  rut: '12345678-5',
  firstName: 'Maria',
  lastName: 'Gonzalez',
  age: '30',
  dietType: 'TRADICIONAL',
  needsAccommodation: false,
  phone: '+56912345678',
  email: 'maria@gmail.com',
  staffCode: 'STAFF-2026',
  acceptsTerms: true,
  acceptsPrivacyPolicy: true,
}

describe('useStaffRegistration', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('initializes with empty values and not loading', () => {
    const { result } = renderHook(() => useStaffRegistration())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isSuccessScreenVisible).toBe(false)
    expect(result.current.formik.values.staffCode).toBe('')
  })

  it('does not submit when required fields are missing', async () => {
    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => { await result.current.formik.submitForm() })

    expect(submitStaffRegistration).not.toHaveBeenCalled()
  })

  it('does not submit when staffCode is missing', async () => {
    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => {
      await result.current.formik.setValues({ ...VALID_VALUES, staffCode: '' })
    })
    await act(async () => { await result.current.formik.submitForm() })

    expect(submitStaffRegistration).not.toHaveBeenCalled()
  })

  it('does not submit when policies are not accepted', async () => {
    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => {
      await result.current.formik.setValues({ ...VALID_VALUES, acceptsTerms: false, acceptsPrivacyPolicy: false })
    })
    await act(async () => { await result.current.formik.submitForm() })

    expect(submitStaffRegistration).not.toHaveBeenCalled()
  })

  it('submits successfully when all fields are valid', async () => {
    vi.mocked(submitStaffRegistration).mockResolvedValue({
      payload: {} as never,
      apiResponse: { success: true, message: 'Inscripción exitosa' },
    })

    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => { await result.current.formik.setValues(VALID_VALUES) })
    await act(async () => { await result.current.formik.submitForm() })

    await waitFor(() => expect(result.current.isSuccessScreenVisible).toBe(true))
    expect(submitStaffRegistration).toHaveBeenCalledTimes(1)
    expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Inscripción exitosa')
  })

  it('shows error toast when submission fails', async () => {
    vi.mocked(submitStaffRegistration).mockRejectedValue(new Error('Código inválido'))

    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => { await result.current.formik.setValues(VALID_VALUES) })
    await act(async () => { await result.current.formik.submitForm() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Código inválido')
    expect(result.current.isSuccessScreenVisible).toBe(false)
  })

  it('prevents double submission', async () => {
    const mockPromise = new Promise<Awaited<ReturnType<typeof submitStaffRegistration>>>((resolve) =>
      setTimeout(() => resolve({ payload: {} as never, apiResponse: { success: true, message: 'OK' } }), 200),
    )
    vi.mocked(submitStaffRegistration).mockReturnValue(mockPromise)

    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => { await result.current.formik.setValues(VALID_VALUES) })
    await act(async () => { await result.current.formik.submitForm() })
    await act(async () => { await result.current.formik.submitForm() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(submitStaffRegistration).toHaveBeenCalledTimes(1)
  })

  it('sets staffCode validation error when field is empty on blur', async () => {
    const { result } = renderHook(() => useStaffRegistration())

    await act(async () => {
      await result.current.formik.setFieldTouched('staffCode', true, true)
    })

    await waitFor(() => {
      expect(result.current.formik.errors.staffCode).toBe('El código de staff es obligatorio.')
    })
  })
})
