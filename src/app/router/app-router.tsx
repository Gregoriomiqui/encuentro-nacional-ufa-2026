import { Route, Routes } from 'react-router-dom'

import { SiteLayout } from '@features/site/presentation/components/site-layout'
import { NotFoundPage } from '@pages/not-found-page'
import { PrivacyPage } from '@pages/privacy-page'
import { OrganizerLoginPage } from '@pages/organizer-login-page'
import { RegistrationPage } from '@pages/registration-page'
import { OrganizerFailedRegistrationValidationPage } from '@pages/organizer-failed-registration-validation-page'
import { SiteHomePage } from '@pages/site-home-page'
import { TermsPage } from '@pages/terms-page'
import { OrganizerRouteGuard } from '@app/router/organizer-route-guard'

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
        path="/inscripcion"
        element={
          <SiteLayout title="UFA ACYM Chile">
            <RegistrationPage />
          </SiteLayout>
        }
      />
      <Route
        path="/terminos-y-condiciones"
        element={
          <SiteLayout title="UFA ACYM Chile">
            <TermsPage />
          </SiteLayout>
        }
      />
      <Route
        path="/politica-de-privacidad"
        element={
          <SiteLayout title="UFA ACYM Chile">
            <PrivacyPage />
          </SiteLayout>
        }
      />
      <Route
        path="/equipo-organizador/validacion-registro-fallido"
        element={
          <SiteLayout title="UFA ACYM Chile">
            <OrganizerRouteGuard>
              <OrganizerFailedRegistrationValidationPage />
            </OrganizerRouteGuard>
          </SiteLayout>
        }
      />
      <Route
        path="/equipo-organizador/login"
        element={
          <SiteLayout title="UFA ACYM Chile">
            <OrganizerLoginPage />
          </SiteLayout>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
