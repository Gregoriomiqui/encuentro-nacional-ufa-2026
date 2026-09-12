---
id: REGISTRATION-001
title: Enviar inscripción de participantes
status: delivered
owners: [Equipo de desarrollo UFA]
created: 2026-09-11
updated: 2026-09-11
---

# REGISTRATION-001: Enviar inscripción de participantes

## Contexto y problema

Una persona responsable de una iglesia necesita enviar la inscripción de una o más participantes, incluyendo comprobante de pago y preferencias de talleres, para que la organización procese el registro.

## Alcance

### Incluido

- Transformar los datos del formulario al payload de inscripción.
- Normalizar datos personales antes de enviarlos.
- Designar a la primera participante como contacto principal.
- Enviar el payload mediante un puerto de inscripción.

### Fuera de alcance

- Validación visual de todos los pasos del formulario.
- Cobros y conciliación del comprobante.
- Administración de cupos de talleres.

## Lenguaje ubicuo

| Término | Significado en este contexto |
| --- | --- |
| Inscripción | Solicitud enviada por una iglesia para registrar participantes. |
| Participante principal | Primera participante del formulario y contacto principal de la inscripción. |
| Puerto de inscripción | Contrato de aplicación usado para enviar el payload a un proveedor externo. |

## Reglas e invariantes

- R1. Los textos personales se envían sin espacios iniciales ni finales y el correo en minúsculas.
- R2. La primera participante enviada se marca como contacto principal.
- R3. Cada taller elegido conserva su identificador, nombre y jornada.

## Escenarios de aceptación

### S1: Enviar inscripción normalizada

```gherkin
Given una inscripción válida con una participante y talleres de mañana y tarde
When se envía la inscripción
Then el puerto recibe datos personales normalizados
And la participante se identifica como contacto principal
And las elecciones de talleres incluyen nombre y jornada
```

## Diseño y límites

- Contexto afectado: `src/features/registration`.
- Modelo de dominio afectado: `RegistrationPayload` y `RegistrationRegistrant`.
- Caso de uso y puertos: `submitRegistration` y `RegistrationPort`.
- Adaptadores externos: el adaptador Make implementa el puerto en la composición de presentación.
- Riesgos, seguridad y privacidad: no registrar comprobantes ni datos personales en logs.

## Trazabilidad

| Escenario | Prueba automatizada | Estado |
| --- | --- | --- |
| S1 | `src/features/registration/application/use-cases/submit-registration.use-case.spec.ts` | green |

## Decisiones abiertas

- Ninguna para el alcance actual.

## Verificación

- [x] Cada escenario tiene prueba automatizada.
- [x] Se ejecutó el gate de calidad.
- [x] La documentación refleja el comportamiento entregado.