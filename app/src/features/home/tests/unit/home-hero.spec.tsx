import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { HomeHero } from '@features/home/presentation/components/home-hero'
import { renderWithProviders } from '@shared/test/test-utils'

describe('HomeHero', () => {
  it('renderiza titulo, subtitulo y CTA inicial', () => {
    renderWithProviders(
      <HomeHero
        content={{
          title: 'Scaffolding profesional listo',
          subtitle: 'Feature-First + Clean Architecture',
          cta: 'Continuar con Dia 3 (TDD)',
        }}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Scaffolding profesional listo' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Feature-First + Clean Architecture')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Continuar con Dia 3 (TDD)' }),
    ).toBeInTheDocument()
  })

  it('permite hacer click en el CTA sin romper el render', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <HomeHero
        content={{
          title: 'Scaffolding profesional listo',
          subtitle: 'Feature-First + Clean Architecture',
          cta: 'Continuar con Dia 3 (TDD)',
        }}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Continuar con Dia 3 (TDD)' }),
    )

    expect(
      screen.getByRole('button', { name: 'Continuar con Dia 3 (TDD)' }),
    ).toBeInTheDocument()
  })
})
