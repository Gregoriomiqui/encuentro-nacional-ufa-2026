import { BrowserRouter } from 'react-router-dom'

import { AppProviders } from '@app/providers/app-providers'
import { AppRouter } from '@app/router/app-router'

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  )
}
