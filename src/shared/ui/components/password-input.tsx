import { useState } from 'react'
import type { ComponentProps } from 'react'

import './password-input.css'

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: string
}

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 10.73C12.55 9.47 14.53 9 17 9s4.45.47 6.27 1.73" />
    <path d="m2 2 20 20" />
    <path d="M2 12s3-7 10-7a9.74 9.74 0 0 1 5.39 1.61" />
  </svg>
)

export const PasswordInput = ({ label, id, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="registration-field">
      <label className="registration-label" htmlFor={id}>
        {label}
      </label>
      <div className="password-input-wrapper">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className="registration-input"
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="password-input-toggle-button"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  )
}
