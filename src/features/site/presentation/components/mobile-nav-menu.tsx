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
              <span>Inicio</span>
            </NavLink>
          </li>
          <li>
            <Link
              to="/#evento"
              className="mobile-nav-item"
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">📅</span>
              <span>Evento</span>
            </Link>
          </li>
          <li>
            <NavLink
              to="/inscripcion"
              className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">📝</span>
              <span>Inscripción</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/inscripcion-staff"
              className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">🎯</span>
              <span>Staff</span>
            </NavLink>
          </li>
          <li>
            <Link
              to="/#contacto"
              className="mobile-nav-item"
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">📍</span>
              <span>Contacto</span>
            </Link>
          </li>
          <li>
            <Link
              to="/equipo-organizador/login"
              className="mobile-nav-item mobile-nav-item-organizer"
              onClick={handleMenuItemClick}
            >
              <span className="nav-icon">🔒</span>
              <span>Acceso</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
