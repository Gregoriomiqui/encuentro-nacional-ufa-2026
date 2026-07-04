import { Link } from 'react-router-dom'

export function TermsPage() {
  return (
    <main className="main-content">
      <section className="document-hero">
        <div className="container">
          <h1 className="document-title">Términos y Condiciones de Inscripción</h1>
          <p className="document-subtitle">Encuentro Nacional UFA "Mujeres Transformadas" (Unión Femenina Aliancista)</p>
          <p className="document-date">Última actualización: Julio 2026</p>
        </div>
      </section>

      <section className="document-content">
        <div className="container-narrow">
          <article className="legal-document">
            <section className="legal-section">
              <h2 className="legal-heading">1. Aceptación de los Términos</h2>
              <p className="legal-text">
                Al completar el proceso de inscripción en el Encuentro Nacional UFA "Mujeres Transformadas", la participante
                declara haber leído, comprendido y aceptado íntegramente los presentes Términos y Condiciones, obligándose a
                su cumplimiento. En caso de no estar de acuerdo con alguna de sus disposiciones, deberá abstenerse de completar
                su inscripción.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">2. Requisitos de Inscripción</h2>
              <h3 className="legal-subheading">2.1 Elegibilidad</h3>
              <p className="legal-text">
                El evento está dirigido exclusivamente a mujeres pertenecientes a Iglesia de la Alianza Cristiana y Misionera
                en Chile. La inscripción se encuentra abierta únicamente a personas mayores de 18 años.
              </p>

              <h3 className="legal-subheading">2.2 Información Requerida</h3>
              <p className="legal-text">
                Para completar la inscripción, la participante deberá proporcionar información personal veraz, completa y
                actualizada, incluyendo:
              </p>
              <ul className="legal-list">
                <li>Distrito e iglesia de origen</li>
                <li>Cantidad de personas adicionales a inscribir</li>
                <li>Documento de identidad (RUT), nombre y apellido de cada participante</li>
                <li>Edad de cada participante</li>
                <li>Información de contacto de cada participante (teléfono y correo electrónico)</li>
                <li>Tipo de alimentación de cada participante</li>
                <li>Necesidad de alojamiento, en caso de corresponder</li>
                <li>Selección de uno o dos talleres por participante</li>
                <li>Comprobante de pago en formato imagen</li>
                <li>Aceptación de términos y autorización de uso de imagen</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">3. Proceso de Pago</h2>
              <h3 className="legal-subheading">3.1 Tarifas</h3>
              <p className="legal-text">
                El costo de inscripción al Encuentro Nacional es de $50.000 e incluye alimentación, materiales del evento y
                las actividades programadas. Este valor no contempla hospedaje.
              </p>

              <h3 className="legal-subheading">3.2 Métodos de Pago</h3>
              <p className="legal-text">
                Los métodos de pago serán por medio de transferencia electrónica. El comprobante de transferencia deberá
                ser adjuntado al momento de la inscripción. El pago debe realizarse dentro de los plazos establecidos para
                confirmar su participación.
              </p>

              <h3 className="legal-subheading">3.3 Confirmación</h3>
              <p className="legal-text">
                La inscripción se entenderá confirmada únicamente una vez verificado el pago total del valor correspondiente.
                La participante recibirá una confirmación a través de correo electrónico con los detalles de su inscripción.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">4. Política de Cancelación y Reembolso</h2>
              <h3 className="legal-subheading">4.1 Cancelación por parte de la Participante</h3>
              <p className="legal-text">
                En caso de que la participante desee cancelar su participación, por los motivos que ella estime conveniente,
                no se realizarán reembolsos. No obstante, su inscripción podrá ser transferida a otra participante, hasta
                el 30 de septiembre, como fecha máxima.
              </p>

              <h3 className="legal-subheading">4.2 Cancelación del Evento</h3>
              <p className="legal-text">
                Los organizadores se reservan el derecho de cancelar o posponer el evento por causas de
                fuerza mayor. En tal caso, se realizará el reembolso completo del monto pagado o se
                ofrecerá la opción de transferir la inscripción a la nueva fecha.
              </p>
              <p className="legal-text">
                La organización se reserva el derecho de suspender, reprogramar o modificar el Evento por causas de fuerza
                mayor o caso fortuito. En tales casos, se ofrecerá a las participantes la opción de mantener su inscripción
                para una nueva fecha o solicitar el reembolso de su inscripción.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">5. Conducta y Normas del Evento</h2>
              <p className="legal-text">Las participantes se comprometen a:</p>
              <ul className="legal-list">
                <li>Mantener una conducta respetuosa y cristiana</li>
                <li>Cumplir con los horarios establecidos para las actividades</li>
                <li>Respetar al equipo organizador, a las demás participantes, las instalaciones y el entorno en general</li>
                <li>Acatar las instrucciones impartidas por la organización</li>
                <li>No consumir alimentos al interior del Teatro Municipal</li>
                <li>No consumir alcohol, tabaco o sustancias prohibidas durante el evento</li>
              </ul>
              <p className="legal-text">
                En caso de incumplimiento de una de estas normas se le pedirá a la persona no seguir participando del
                Encuentro.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">6. Responsabilidad y Seguro</h2>
              <h3 className="legal-subheading">6.1 Responsabilidad Personal</h3>
              <p className="legal-text">
                El Encuentro Nacional contará con un equipo de seguridad para resguardar el normal desarrollo de las
                actividades. No obstante, cada participante será responsable del cuidado de sus pertenencias personales.
                La organización no se hará responsable por pérdidas, daños o robos de objetos personales, salvo en aquellos
                casos en que dichos hechos sean consecuencia de negligencia o incumplimiento de las medidas de seguridad que
                le correspondan.
              </p>

              <h3 className="legal-subheading">6.2 Salud y Seguridad</h3>
              <p className="legal-text">
                Cada participante deberá encontrarse en condiciones de salud compatibles con los requerimientos que implique
                su participación en las actividades programadas del Encuentro Nacional. Asimismo, en caso de presentar alguna
                condición particular de salud, se sugiere contar con un seguro y con cobertura de salud vigente, adecuados a
                sus necesidades específicas.
              </p>

              <h3 className="legal-subheading">6.3 Limitación de Responsabilidad</h3>
              <p className="legal-text">
                Los organizadores no serán responsables por lesiones, enfermedades o daños que puedan
                ocurrir durante el evento, salvo en casos de negligencia comprobada o incumplimiento de las medidas de
                seguridad que le correspondan.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">7. Derechos de Imagen</h2>
              <p className="legal-text">
                La participante autoriza expresamente a la organización a captar, reproducir y difundir su imagen en
                fotografías, videos u otros medios audiovisuales obtenidos durante el Evento, con fines promocionales,
                institucionales y de registro del ministerio UFA ACYM Chile, sin derecho a compensación económica.
                En caso de no otorgar dicha autorización, deberá dejar el registro al momento de su inscripción.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">8. Modificaciones al Programa</h2>
              <p className="legal-text">
                La organización se reserva el derecho de efectuar modificaciones en el programa, horarios, expositoras o
                actividades, cuando las circunstancias lo requieran, procurando siempre mantener el propósito y la calidad
                del Encuentro Nacional.
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
                Para consultas sobre estos términos y condiciones, puede contactarse por medio de los canales oficiales de
                la Unión Femenina Aliancista.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">11. Ley Aplicable</h2>
              <p className="legal-text">
                Los presentes Términos y Condiciones se regirán por las leyes de la República de Chile. Cualquier
                controversia será sometida al conocimiento de los tribunales ordinarios de justicia competentes.
              </p>
            </section>

            <section className="legal-section legal-section-highlight">
              <p className="legal-text">
                <strong>Declaración de Aceptación:</strong> Al completar la inscripción, declaro que he leído,
                comprendido y acepto estos términos y condiciones en su totalidad.
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
