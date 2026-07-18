import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PasswordInput } from './password-input'

describe('PasswordInput', () => {
  it('renders correctly with a label and input', () => {
    render(<PasswordInput label="Password" id="password" />)

    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('starts with password hidden', () => {
    render(<PasswordInput label="Password" id="password" />)

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('toggles password visibility on button click', async () => {
    const user = userEvent.setup()
    render(<PasswordInput label="Password" id="password" />)

    const passwordInput = screen.getByLabelText('Password')
    const toggleButton = screen.getByRole('button', { name: 'Mostrar contraseña' })

    // Password should be hidden initially
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Click to show password
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toBeInTheDocument()

    // Click to hide password again
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeInTheDocument()
  })

  it('calls onChange handler when typing', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<PasswordInput label="Password" id="password" onChange={handleChange} />)

    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, 'secret')

    expect(handleChange).toHaveBeenCalledTimes(6)
  })
})
