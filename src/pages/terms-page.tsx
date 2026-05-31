import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <main className="main-content">
      <section className="document-hero">
        <div className="container">
          <h1 className="document-title">Términos y Condiciones de Inscripción</h1>
          <p className="document-subtitle">Encuentro Nacional UFA "Mujeres Transformadas" (Unión Femenina Aliancista)</p>
          <p className="document-date">Última actualización: Mayo 2026</p>
        </div>
      </section>

      <section className="document-content">
        <div className="container-narrow">
          <article className="legal-document">
            <section className="legal-section">
              <h2 className="legal-heading">1. Aceptación de los Términos</h2>
              <p className="legal-text">
                Al inscribirse en el Encuentro Nacional UFA "Mujeres Transformadas", la participante acepta y se compromete a
                cumplir con los siguientes términos y condiciones. Si no está de acuerdo con alguno de estos términos,
                le solicitamos que no complete el proceso de inscripción.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">2. Requisitos de Inscripción</h2>
              <h3 className="legal-subheading">2.1 Elegibilidad</h3>
              <p className="legal-text">
                El evento está dirigido a mujeres miembros de las iglesias de la Alianza Cristiana y Misionera
                en Chile. La inscripción está abierta a participantes mayores de 18 años.
              </p>

              <h3 className="legal-subheading">2.2 Información Requerida</h3>
              <p className="legal-text">
                Para completar la inscripción, se debe proporcionar información personal veraz y actualizada,
                incluyendo:
              </p>
              <ul className="legal-list">
                <li>Nombre completo</li>
                <li>Documento de identidad</li>
                <li>Información de contacto (teléfono y correo electrónico)</li>
                <li>Iglesia local a la que pertenece</li>
                <li>Información de salud relevante (alergias, condiciones médicas, medicamentos)</li>
                <li>Contacto de emergencia</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">3. Proceso de Pago</h2>
              <h3 className="legal-subheading">3.1 Tarifas</h3>
              <p className="legal-text">
                El costo del retiro incluye alojamiento, alimentación completa, materiales del evento y
                actividades programadas. Las tarifas serán comunicadas al momento de abrir las inscripciones.
              </p>

              <h3 className="legal-subheading">3.2 Métodos de Pago</h3>
              <p className="legal-text">
                Se aceptarán los métodos de pago especificados durante el proceso de inscripción.
                El pago debe realizarse dentro de los plazos establecidos para confirmar la reserva.
              </p>

              <h3 className="legal-subheading">3.3 Confirmación</h3>
              <p className="legal-text">
                La inscripción se considerará confirmada una vez recibido el pago completo.
                La participante recibirá un correo electrónico de confirmación con los detalles del evento.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">4. Política de Cancelación y Reembolso</h2>
              <h3 className="legal-subheading">4.1 Cancelación por parte de la Participante</h3>
              <ul className="legal-list">
                <li><strong>Más de 30 días antes del evento:</strong> Reembolso del 80% del monto pagado</li>
                <li><strong>Entre 15 y 30 días antes:</strong> Reembolso del 50% del monto pagado</li>
                <li><strong>Menos de 15 días antes:</strong> No se realizarán reembolsos</li>
              </ul>
              <p className="legal-text">
                En casos excepcionales (enfermedad grave, emergencia familiar documentada),
                se evaluará cada caso individualmente.
              </p>

              <h3 className="legal-subheading">4.2 Cancelación del Evento</h3>
              <p className="legal-text">
                Los organizadores se reservan el derecho de cancelar o posponer el evento por causas de
                fuerza mayor. En tal caso, se realizará el reembolso completo del monto pagado o se
                ofrecerá la opción de transferir la inscripción a la nueva fecha.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">5. Conducta y Normas del Evento</h2>
              <p className="legal-text">Las participantes se comprometen a:</p>
              <ul className="legal-list">
                <li>Mantener una conducta respetuosa y cristiana</li>
                <li>Cumplir con los horarios establecidos para las actividades</li>
                <li>Respetar las instalaciones y el entorno</li>
                <li>Seguir las indicaciones del equipo organizador</li>
                <li>No consumir alcohol, tabaco o sustancias prohibidas durante el evento</li>
              </ul>
              <p className="legal-text">
                El incumplimiento de estas normas puede resultar en la expulsión del evento sin derecho a reembolso.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">6. Responsabilidad y Seguro</h2>
              <h3 className="legal-subheading">6.1 Responsabilidad Personal</h3>
              <p className="legal-text">
                Cada participante es responsable de sus pertenencias personales. Los organizadores no se
                hacen responsables por pérdidas, daños o robos de objetos personales.
              </p>

              <h3 className="legal-subheading">6.2 Salud y Seguridad</h3>
              <p className="legal-text">
                Las participantes deben informar sobre cualquier condición médica, alergia o necesidad
                especial al momento de la inscripción. Se recomienda contar con seguro médico vigente.
              </p>

              <h3 className="legal-subheading">6.3 Limitación de Responsabilidad</h3>
              <p className="legal-text">
                Los organizadores no serán responsables por lesiones, enfermedades o daños que puedan
                ocurrir durante el evento, salvo en casos de negligencia comprobada.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">7. Derechos de Imagen</h2>
              <p className="legal-text">
                Al inscribirse, la participante autoriza el uso de fotografías y videos tomados durante
                el evento para fines promocionales y de registro del ministerio de UFAACYM Chile, sin
                recibir compensación alguna. Si no desea aparecer en material audiovisual, debe
                comunicarlo por escrito al equipo organizador.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">8. Modificaciones al Programa</h2>
              <p className="legal-text">
                Los organizadores se reservan el derecho de realizar cambios en el programa, horarios,
                conferencistas y actividades si las circunstancias lo requieren, siempre manteniendo
                la calidad y propósito del evento.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">9. Protección de Datos</h2>
              <p className="legal-text">
                El tratamiento de datos personales se realizará conforme a nuestra{' '}
                <Link to="/politica-de-privacidad" className="legal-link">
                  Política de Privacidad
                </Link>{' '}
                y la legislación vigente en Chile sobre protección de datos personales.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">10. Contacto</h2>
              <p className="legal-text">
                Para consultas sobre estos términos y condiciones, puede contactarse a través de su
                iglesia local de la Alianza Cristiana y Misionera o mediante los canales oficiales
                de comunicación del evento.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">11. Ley Aplicable</h2>
              <p className="legal-text">
                Estos términos y condiciones se rigen por las leyes de la República de Chile.
                Cualquier disputa será resuelta en los tribunales competentes de Chile.
              </p>
            </section>

            <section className="legal-section legal-section-highlight">
              <p className="legal-text">
                <strong>Declaración de Aceptación:</strong> Al completar la inscripción, declaro que he
                leído, entendido y acepto estos términos y condiciones en su totalidad.
              </p>
            </section>
          </article>

          <div className="document-actions">
            <Link to="/" className="button button-primary">
              Volver al Inicio
            </Link>
            <Link to="/politica-de-privacidad" className="button button-secondary">
              Ver Política de Privacidad
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
