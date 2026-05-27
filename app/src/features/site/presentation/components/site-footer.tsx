import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/assets/logo-ufa.png" alt="Logo UFAACYM Chile" className="footer-logo" />
            <p className="footer-text">
              Union Femenina Aliancista
              <br />
              Alianza Cristiana y Misionera - Chile
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Enlaces</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/terminos-y-condiciones">Terminos y Condiciones</Link>
              </li>
              <li>
                <Link to="/politica-de-privacidad">Politica de Privacidad</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Legal</h3>
            <p className="footer-text-small">
              © 2026 UFAACYM Chile
              <br />
              Todos los derechos reservados
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Desarrollado con amor para el ministerio de mujeres</p>
        </div>
      </div>
    </footer>
  )
}
