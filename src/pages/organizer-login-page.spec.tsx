import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuth } from '@app/providers/auth-context'
import { OrganizerLoginPage } from '@pages/organizer-login-page'
import { renderWithProviders } from '@shared/test/test-utils'
import toast from 'react-hot-toast'

vi.mock('@app/providers/auth-context')
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: '/equipo-organizador/acceso',
      state: null,
      key: 'testKey',
      search: '',
      hash: '',
    }),
  }
})

describe('OrganizerLoginPage', () => {
  const mockSignIn = vi.fn()
  const mockSendPasswordReset = vi.fn()

  const setup = (authValue: Partial<ReturnType<typeof useAuth>>) => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      configured: true,
      errorMessage: null,
      signIn: mockSignIn,
      signOut: vi.fn(),
      sendPasswordReset: mockSendPasswordReset,
      ...authValue,
    })

    renderWithProviders(
      <MemoryRouter>
        <OrganizerLoginPage />
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    setup({})
    expect(screen.getByRole('heading', { name: 'Acceso equipo organizador' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '¿Olvidaste tu contraseña?' })).toBeInTheDocument()
  })

  it('calls signIn on submit with correct credentials', async () => {
    const user = userEvent.setup()
    setup({})

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@user.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(mockSignIn).toHaveBeenCalledWith('test@user.com', 'password123')
  })

  it('navigates on successful signIn', async () => {
    const user = userEvent.setup()
    setup({})

    mockSignIn.mockResolvedValueOnce(undefined)

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@user.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/equipo-organizador/validacion-registro-fallido', { replace: true })
    })
  })

  it('shows an error toast if signIn fails', async () => {
    const user = userEvent.setup()
    setup({})

    const errorMessage = 'Correo o contraseña incorrectos.'
    mockSignIn.mockRejectedValueOnce(new Error(errorMessage))

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@user.com')
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('calls sendPasswordReset when "forgot password" is clicked', async () => {
    const user = userEvent.setup()
    setup({})

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@user.com')
    await user.click(screen.getByRole('button', { name: '¿Olvidaste tu contraseña?' }))

    expect(mockSendPasswordReset).toHaveBeenCalledWith('test@user.com')
  })

  it('shows a success toast when password reset email is sent', async () => {
    const user = userEvent.setup()
    setup({})

    mockSendPasswordReset.mockResolvedValueOnce(undefined)

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@user.com')
    await user.click(screen.getByRole('button', { name: '¿Olvidaste tu contraseña?' }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Se ha enviado un correo para restablecer tu contraseña.')
    })
  })

  it('shows an error toast if email is missing for password reset', async () => {
    const user = userEvent.setup()
    setup({})

    await user.click(screen.getByRole('button', { name: '¿Olvidaste tu contraseña?' }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Por favor, ingresa tu correo electrónico para restablecer la contraseña.')
    })
    expect(mockSendPasswordReset).not.toHaveBeenCalled()
  })

  it('disables the submit button while submitting', async () => {
    const user = userEvent.setup()
    setup({})

    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    await user.type(screen.getByLabelText('Correo electrónico'), 'test@user.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    
    const submitButton = screen.getByRole('button', { name: 'Iniciar sesión' })
    user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Ingresando...' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })
})
