import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MobileNavMenu } from './mobile-nav-menu'

type SiteHeaderProps = {
  title: string
}

export function SiteHeader({ title }: Readonly<SiteHeaderProps>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="header">
        <nav className="nav-container" aria-label="Navegacion principal">
          {/* Mobile Header - Hidden on desktop */}
          <div className="mobile-header">
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              <span className="hamburger-icon">☰</span>
            </button>
            <div className="mobile-header-title">
              <h1 className="mobile-site-title">{title}</h1>
            </div>
            <span className="mobile-header-spacer" aria-hidden="true" />
          </div>

          {/* Desktop Header - Hidden on mobile */}
          <div className="desktop-header">
            <div className="logo-section">
              <img src="/assets/logo-ufa.png" alt="Logo UFA ACYM Chile" className="logo" />
              <h1 className="site-title">{title}</h1>
            </div>
            <ul className="nav-menu">
              <li>
                <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
                  Inicio
                </NavLink>
              </li>
              <li>
                <Link to="/#evento" className="nav-link">
                  El Evento
                </Link>
              </li>
              <li>
                <NavLink to="/inscripcion" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Inscripción
                </NavLink>
              </li>
              <li>
                <Link to="/#contacto" className="nav-link">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/equipo-organizador/login" className="nav-link nav-link-organizer">
                  Acceso interno
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      <MobileNavMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onMenuItemClick={closeMobileMenu}
      />
    </>
  )
}
