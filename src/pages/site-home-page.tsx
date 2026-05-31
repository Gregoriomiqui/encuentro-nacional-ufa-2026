import { Link } from 'react-router-dom'

export function SiteHomePage() {
  return (
    <main className="main-content">
      <section className="hero">
        <div className="hero-content">
          <p className="hero-kicker">Encuentro Nacional</p>
          <h2 className="hero-title">
            Mujeres
            <br />
            Transformadas
          </h2>
          <p className="hero-subtitle">Union Femenina Aliancista · Alianza Cristiana y Misionera</p>
          <p className="hero-description">"La semilla que cayo en buen terreno"</p>
          <p className="hero-verse">Mateo 13:23 NVI</p>
          <a href="#inscripcion" className="cta-button cta-button-soft">
            Inscribete Ahora
          </a>
        </div>
        <div className="hero-bottom-strip" aria-label="Informacion principal del evento">
          <p className="hero-bottom-item">
            <span>30, 31 de oct y 1 nov 2026</span>
          </p>
          <span className="hero-bottom-divider" aria-hidden="true" />
          <p className="hero-bottom-item">
            <span>Teatro Municipal Temuco</span>
          </p>
        </div>
      </section>

      <section id="evento" className="section">
        <div className="container">
          <h2 className="section-title">Acerca del Evento</h2>
          <div className="content-grid">
            <article className="card">
              <h3 className="card-title">Fecha</h3>
              <p className="card-text">30 y 31 de octubre, y 1 de noviembre de 2026</p>
            </article>
            <article className="card">
              <h3 className="card-title">Ubicacion</h3>
              <p className="card-text">Teatro Municipal de Temuco</p>
            </article>
            <article className="card">
              <h3 className="card-title">Participantes</h3>
              <p className="card-text">Mujeres de todas las iglesias de la Alianza en Chile</p>
            </article>
          </div>
        </div>
      </section>

      <section id="inscripcion" className="section section-alt">
        <div className="container">
          <h2 className="section-title">Inscripción</h2>
          <div className="inscription-content">
            <p className="inscription-text">
              La inscripción se realiza en una pagina dedicada con formulario por pasos, comprobante de pago y validación
              de datos.
            </p>
            <div className="button-group">
              <Link to="/inscripcion" className="button button-primary">
                Ir al Formulario de Inscripción
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contacto" className="section">
        <div className="container">
          <h2 className="section-title">Contacto</h2>
          <div className="contact-info">
            <p className="contact-text">
              Para mas informacion sobre el Encuentro Nacional UFA "Mujeres Transformadas", puedes contactarnos a traves
              de tu iglesia local de la Alianza Cristiana y Misionera.
            </p>
            <div className="social-links">
              <p className="contact-subtitle">Siguenos en nuestras redes sociales</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
