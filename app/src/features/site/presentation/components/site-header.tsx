import { Link, NavLink } from 'react-router-dom'

type SiteHeaderProps = {
  title: string
}

export function SiteHeader({ title }: SiteHeaderProps) {
  return (
    <header className="header">
      <nav className="nav-container" aria-label="Navegacion principal">
        <div className="logo-section">
          <img src="/assets/logo-ufa.png" alt="Logo UFAACYM Chile" className="logo" />
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
        </ul>
      </nav>
    </header>
  )
}
