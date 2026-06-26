import { Link, NavLink } from 'react-router-dom'
import '../styles/mobile-nav-menu.css'

export interface MobileNavMenuProps {
  isOpen: boolean
  onClose: () => void
  onMenuItemClick?: () => void
}

export function MobileNavMenu({ isOpen, onClose, onMenuItemClick }: Readonly<MobileNavMenuProps>) {
  const handleMenuItemClick = () => {
    onMenuItemClick?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="mobile-nav-backdrop visible"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <nav
        className="mobile-nav-menu open"
        role="navigation"
        aria-label="Menú de navegación móvil"
      >
        <div className="mobile-nav-header">
          <h2 className="mobile-nav-title">Menú Principal</h2>
          <button
            className="mobile-nav-close"
            onClick={onClose}
            aria-label="Cerrar menú"
            type="button"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <ul className="mobile-nav-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
              end
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">🏠</span>
              <span>INICIO</span>
            </NavLink>
          </li>
          <li>
            <Link
              to="/#evento"
              className="mobile-nav-item"
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">📅</span>
              <span>AGENDA</span>
            </Link>
          </li>
          <li>
            <Link
              to="/#contacto"
              className="mobile-nav-item"
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">📍</span>
              <span>UBICACIÓN</span>
            </Link>
          </li>
          <li>
            <Link
              to="/#faq"
              className="mobile-nav-item"
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">❓</span>
              <span>FAQ</span>
            </Link>
          </li>
        </ul>

        <div className="mobile-nav-actions">
          <NavLink
            to="/inscripcion"
            className="mobile-nav-cta-button"
            onClick={handleMenuItemClick}
          >
            INSCRIBETE AQUÍ
          </NavLink>
        </div>
      </nav>
    </>
  )
}
