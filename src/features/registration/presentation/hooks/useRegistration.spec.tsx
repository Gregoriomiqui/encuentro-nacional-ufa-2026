import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { submitRegistration } from '@features/registration/application/use-cases/submit-registration.use-case'
import { fetchWorkshopOptions } from '@features/registration/infrastructure/repositories/make-registration.repository'
import { useRegistration } from './useRegistration'

vi.mock('@features/registration/application/use-cases/submit-registration.use-case')
vi.mock('@features/registration/infrastructure/repositories/make-registration.repository', () => ({
  fetchWorkshopOptions: vi.fn().mockResolvedValue({ am: [], pm: [] }),
}))
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))
vi.mock('browser-image-compression', () => ({
  __esModule: true,
  default: vi.fn((file) => Promise.resolve(file)),
}))

describe('useRegistration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should prevent double submission', async () => {
    const { result } = renderHook(() => useRegistration())

    const mockSubmitPromise: ReturnType<typeof submitRegistration> = new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            payload: {
              receipt: { base64: '', mime_type: '', filename: '' },
              district_name: 'Distrito Norte',
              church_origin: 'Arica',
              accepts_terms: true,
              accepts_image_authorization: true,
              registrants: [],
            },
            apiResponse: { success: true, message: 'Success' },
          }),
        200,
      ),
    )
    vi.mocked(submitRegistration).mockReturnValue(mockSubmitPromise)

    // Make current step (step 0) valid so submitForm reaches onSubmit.
    await act(async () => {
      await result.current.formik.setFieldValue('companionCount', 0)
      await result.current.formik.setFieldValue('districtName', 'Distrito Norte')
      await result.current.formik.setFieldValue('churchOrigin', 'Arica')
    })

    // Submit for the first time
    await act(async () => {
      await result.current.formik.submitForm()
    })

    // While the first submission is running, try to submit again
    await act(async () => {
      await result.current.formik.submitForm()
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Check that submitRegistration was called only once
    expect(submitRegistration).toHaveBeenCalledTimes(1)
  })

  it('should block selecting the same workshop in AM and PM', async () => {
    vi.mocked(fetchWorkshopOptions).mockResolvedValue({
      am: [{ id: 'am-1', idWorkshop: 'workshop-1', workshop: 'Taller 1', countRegistered: 10, isEnabled: true }],
      pm: [{ id: 'pm-1', idWorkshop: 'workshop-1', workshop: 'Taller 1', countRegistered: 12, isEnabled: true }],
    })

    const { result } = renderHook(() => useRegistration())

    await act(async () => {
      await result.current.formik.setFieldValue('companionCount', 0)
      await result.current.formik.setFieldValue('districtName', 'Distrito Norte')
      await result.current.formik.setFieldValue('churchOrigin', 'Arica')
    })

    await act(async () => {
      await result.current.goToNextStep()
    })

    await waitFor(() => {
      expect(result.current.currentStep).toBe(1)
      expect(result.current.workshopsRequestState).toBe('loaded')
    })

    await act(async () => {
      await result.current.formik.setFieldValue('registrants.0.rut', '11111111-1')
      await result.current.formik.setFieldValue('registrants.0.firstName', 'Maria')
      await result.current.formik.setFieldValue('registrants.0.lastName', 'Perez')
      await result.current.formik.setFieldValue('registrants.0.age', '30')
      await result.current.formik.setFieldValue('registrants.0.dietType', 'TRADICIONAL')
      await result.current.formik.setFieldValue('registrants.0.workshopAm', 'am-1')
      await result.current.formik.setFieldValue('registrants.0.workshopPm', 'pm-1')
      await result.current.formik.setFieldValue('registrants.0.phone', '+56912345678')
      await result.current.formik.setFieldValue('registrants.0.email', 'maria@example.com')
    })

    await act(async () => {
      await result.current.goToNextStep()
    })

    await waitFor(() => {
      expect(result.current.currentStep).toBe(1)
      expect(result.current.formik.errors.registrants?.[0]?.workshopPm).toBe(
        'No puedes elegir el mismo taller en la mañana y en la tarde.',
      )
    })
  })
})
