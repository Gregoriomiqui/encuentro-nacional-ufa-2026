import { Navigate, Route, Routes } from 'react-router-dom'

import { SiteLayout } from '@features/site/presentation/components/site-layout'
import { PrivacyPage } from '@pages/privacy-page'
import { SiteHomePage } from '@pages/site-home-page'
import { TermsPage } from '@pages/terms-page'

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SiteLayout title="Encuentro Nacional UFA 2026">
            <SiteHomePage />
          </SiteLayout>
        }
      />
      <Route
        path="/terminos-y-condiciones"
        element={
          <SiteLayout title="UFAACYM Chile">
            <TermsPage />
          </SiteLayout>
        }
      />
      <Route
        path="/politica-de-privacidad"
        element={
          <SiteLayout title="UFAACYM Chile">
            <PrivacyPage />
          </SiteLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
