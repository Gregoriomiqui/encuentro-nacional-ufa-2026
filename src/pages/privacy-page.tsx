import { Link } from 'react-router-dom'

export function PrivacyPage() {
  return (
    <main className="main-content">
      <section className="document-hero">
        <div className="container">
          <h1 className="document-title">Política de Privacidad</h1>
          <p className="document-subtitle">Registro de Eventos - Encuentro Nacional UFA "Mujeres Transformadas"</p>
          <p className="document-date">Última actualización: Mayo 2026</p>
        </div>
      </section>

      <section className="document-content">
        <div className="container-narrow">
          <article className="legal-document">
            <section className="legal-section">
              <h2 className="legal-heading">1. Introducción</h2>
              <p className="legal-text">
                La Unión Femenina Aliancista (UFA) de la Alianza Cristiana y Misionera en Chile (UFAACYM Chile) se
                compromete a proteger la privacidad y los datos personales de las participantes del Encuentro Nacional UFA
                "Mujeres Transformadas". Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y
                protegemos su información personal.
              </p>
              <p className="legal-text">
                Al proporcionar sus datos personales durante el proceso de inscripción, usted acepta las prácticas
                descritas en esta política.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">2. Responsable del Tratamiento de Datos</h2>
              <p className="legal-text">El responsable del tratamiento de sus datos personales es:</p>
              <div className="info-box">
                <p>
                  <strong>Organización:</strong> UFAACYM Chile (Unión Femenina Aliancista de la Alianza Cristiana y
                  Misionera - Chile)
                </p>
                <p>
                  <strong>Evento:</strong> Encuentro Nacional UFA "Mujeres Transformadas"
                </p>
                <p>
                  <strong>País:</strong> Chile
                </p>
              </div>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">3. Información que Recopilamos</h2>
              <h3 className="legal-subheading">3.1 Datos de Identificación</h3>
              <ul className="legal-list">
                <li>Nombre completo</li>
                <li>Número de documento de identidad (RUT)</li>
                <li>Fecha de nacimiento</li>
                <li>Fotografía (si es proporcionada)</li>
              </ul>

              <h3 className="legal-subheading">3.2 Datos de Contacto</h3>
              <ul className="legal-list">
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono móvil</li>
                <li>Dirección postal</li>
                <li>Iglesia local a la que pertenece</li>
              </ul>

              <h3 className="legal-subheading">3.3 Datos de Salud (Información Sensible)</h3>
              <ul className="legal-list">
                <li>Alergias alimentarias</li>
                <li>Condiciones médicas relevantes</li>
                <li>Medicamentos que toma regularmente</li>
                <li>Necesidades especiales de accesibilidad</li>
              </ul>

              <h3 className="legal-subheading">3.4 Datos de Contacto de Emergencia</h3>
              <ul className="legal-list">
                <li>Nombre del contacto de emergencia</li>
                <li>Relación con la participante</li>
                <li>Número de teléfono de emergencia</li>
              </ul>

              <h3 className="legal-subheading">3.5 Datos de Pago</h3>
              <ul className="legal-list">
                <li>Información de transacciones (no almacenamos datos de tarjetas de crédito)</li>
                <li>Comprobantes de pago</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">4. Finalidad del Tratamiento de Datos</h2>
              <p className="legal-text">Sus datos personales serán utilizados para:</p>
              <ul className="legal-list">
                <li>
                  <strong>Gestión de inscripciones:</strong> Procesar y confirmar su inscripción al evento
                </li>
                <li>
                  <strong>Comunicación:</strong> Enviar información relevante sobre el retiro, cambios en el programa,
                  recordatorios y confirmaciones
                </li>
                <li>
                  <strong>Logística:</strong> Organizar alojamiento, alimentación (considerando alergias y necesidades
                  especiales) y transporte si aplica
                </li>
                <li>
                  <strong>Salud y seguridad:</strong> Atender emergencias médicas y garantizar el bienestar de las
                  participantes
                </li>
                <li>
                  <strong>Administración:</strong> Gestionar pagos y emitir documentación relacionada
                </li>
                <li>
                  <strong>Mejora de servicios:</strong> Evaluar y mejorar la organización de futuros eventos
                </li>
                <li>
                  <strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y fiscales
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">5. Base Legal del Tratamiento</h2>
              <p className="legal-text">El tratamiento de sus datos personales se basa en:</p>
              <ul className="legal-list">
                <li>
                  <strong>Consentimiento:</strong> Usted proporciona voluntariamente sus datos al inscribirse
                </li>
                <li>
                  <strong>Ejecución de contrato:</strong> Necesario para la prestación del servicio de organización del
                  evento
                </li>
                <li>
                  <strong>Interés legítimo:</strong> Garantizar la seguridad y bienestar de las participantes
                </li>
                <li>
                  <strong>Obligación legal:</strong> Cumplimiento de normativas fiscales y legales
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">6. Compartir Información</h2>
              <h3 className="legal-subheading">6.1 Con Terceros</h3>
              <p className="legal-text">Sus datos pueden ser compartidos únicamente con:</p>
              <ul className="legal-list">
                <li>
                  <strong>Proveedores de servicios:</strong> Hoteles, centros de retiro, servicios de catering (solo
                  información necesaria para la prestación del servicio)
                </li>
                <li>
                  <strong>Personal autorizado:</strong> Equipo organizador y personal médico de emergencia (solo en
                  caso necesario)
                </li>
                <li>
                  <strong>Autoridades:</strong> Cuando sea requerido por ley
                </li>
              </ul>

              <h3 className="legal-subheading">6.2 Transferencias Internacionales</h3>
              <p className="legal-text">
                No realizamos transferencias internacionales de datos personales. Toda la información se almacena y
                procesa dentro de Chile.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">7. Seguridad de los Datos</h2>
              <p className="legal-text">
                Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales:
              </p>
              <ul className="legal-list">
                <li>Acceso restringido a datos personales solo al personal autorizado</li>
                <li>Uso de conexiones seguras (HTTPS) para la transmisión de datos</li>
                <li>Almacenamiento en sistemas protegidos con contraseña</li>
                <li>Respaldo regular de la información</li>
                <li>Destrucción segura de datos cuando ya no son necesarios</li>
              </ul>
              <p className="legal-text">
                Los datos sensibles de salud son manejados con especial cuidado y solo son accesibles al personal que
                estrictamente lo necesita.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">8. Tiempo de Conservación</h2>
              <p className="legal-text">Conservaremos sus datos personales durante los siguientes períodos:</p>
              <ul className="legal-list">
                <li>
                  <strong>Datos de inscripción:</strong> Durante el evento y hasta 1 año después para fines
                  administrativos y de mejora
                </li>
                <li>
                  <strong>Datos de pago:</strong> Según lo requiera la legislación fiscal chilena (generalmente 6 años)
                </li>
                <li>
                  <strong>Datos de salud:</strong> Se eliminarán 30 días después de finalizado el evento, salvo que
                  sean necesarios para documentar un incidente
                </li>
                <li>
                  <strong>Fotografías y videos:</strong> Se conservarán indefinidamente para fines de registro histórico
                  del ministerio, salvo que solicite su eliminación
                </li>
              </ul>
              <p className="legal-text">Después de estos períodos, los datos serán eliminados de forma segura.</p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">9. Sus Derechos</h2>
              <p className="legal-text">
                De acuerdo con la legislación chilena de protección de datos personales (Ley N° 19.628), usted tiene
                derecho a:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre usted
                </li>
                <li>
                  <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
                </li>
                <li>
                  <strong>Cancelación:</strong> Solicitar la eliminación de sus datos (sujeto a obligaciones legales de
                  conservación)
                </li>
                <li>
                  <strong>Oposición:</strong> Oponerse a ciertos usos de sus datos
                </li>
                <li>
                  <strong>Bloqueo:</strong> Solicitar el bloqueo temporal de sus datos
                </li>
              </ul>
              <p className="legal-text">
                Para ejercer estos derechos, puede contactarse a través de su iglesia local o mediante los canales de
                comunicación proporcionados durante la inscripción.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">10. Uso de Cookies y Tecnologías Similares</h2>
              <p className="legal-text">Este sitio web puede utilizar cookies y tecnologías similares para:</p>
              <ul className="legal-list">
                <li>Mejorar la experiencia de navegación</li>
                <li>Analizar el uso del sitio web (mediante herramientas como Google Analytics)</li>
                <li>Recordar preferencias del usuario</li>
              </ul>
              <p className="legal-text">
                Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad del
                sitio.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">11. Datos de Menores</h2>
              <p className="legal-text">
                Este evento está dirigido a personas mayores de 18 años. No recopilamos intencionalmente datos de
                menores de edad sin el consentimiento de sus padres o tutores legales.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">12. Cambios en la Política de Privacidad</h2>
              <p className="legal-text">
                Nos reservamos el derecho de actualizar esta Política de Privacidad. Los cambios significativos serán
                comunicados a través de nuestro sitio web o por correo electrónico. La versión actualizada incluirá la
                fecha de "última actualización" al inicio del documento.
              </p>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">13. Contacto</h2>
              <p className="legal-text">
                Si tiene preguntas, inquietudes o desea ejercer sus derechos sobre protección de datos, puede
                contactarnos a través de:
              </p>
              <ul className="legal-list">
                <li>Su iglesia local de la Alianza Cristiana y Misionera</li>
                <li>Los canales oficiales de comunicación del evento</li>
                <li>El equipo organizador del Encuentro Nacional UFA "Mujeres Transformadas"</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2 className="legal-heading">14. Legislación Aplicable</h2>
              <p className="legal-text">Esta Política de Privacidad se rige por la legislación chilena, particularmente:</p>
              <ul className="legal-list">
                <li>Ley N° 19.628 sobre Protección de la Vida Privada</li>
                <li>Ley N° 20.575 sobre el Principio de Finalidad en el Tratamiento de Datos Personales</li>
              </ul>
            </section>

            <section className="legal-section legal-section-highlight">
              <h2 className="legal-heading">15. Consentimiento</h2>
              <p className="legal-text">
                Al completar el formulario de inscripción y proporcionar sus datos personales, usted declara que:
              </p>
              <ul className="legal-list">
                <li>Ha leído y comprendido esta Política de Privacidad</li>
                <li>Consiente el tratamiento de sus datos personales según lo descrito</li>
                <li>Autoriza el tratamiento de datos sensibles (salud) para los fines especificados</li>
                <li>La información proporcionada es veraz y exacta</li>
              </ul>
            </section>
          </article>

          <div className="document-actions">
            <Link to="/" className="button button-primary">
              Volver al Inicio
            </Link>
            <Link to="/terminos-y-condiciones" className="button button-secondary">
              Ver Términos y Condiciones
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
