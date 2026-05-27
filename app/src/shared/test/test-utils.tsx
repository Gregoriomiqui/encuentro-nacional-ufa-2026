import type { PropsWithChildren, ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'

import { AppProviders } from '@app/providers/app-providers'

function AllProviders({ children }: PropsWithChildren) {
  return <AppProviders>{children}</AppProviders>
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllProviders, ...options })
}
