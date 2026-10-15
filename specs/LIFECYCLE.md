# Ciclo de vida de especificaciones

## Estados y transiciones

| Estado | Propósito | Puede pasar a |
| --- | --- | --- |
| `draft` | Explora problema, alcance y decisiones abiertas. No autoriza implementación. | `accepted`, `superseded` |
| `accepted` | Define el comportamiento acordado y autoriza el ciclo TDD. | `delivered`, `superseded` |
| `delivered` | Todos los escenarios están trazados, verificados y disponibles en producción o listos para liberación. | `superseded` |
| `superseded` | Conserva el historial de una spec sustituida. Debe enlazar a su reemplazo. | Ninguno |

No se permite implementar comportamiento mientras la spec esté en `draft`. Una modificación de alcance devuelve la spec a `draft` hasta que vuelva a ser aceptada.

## Revisión y aceptación

La persona que solicita el cambio confirma el problema, alcance y escenarios. Una persona con contexto de producto o negocio acepta la spec; quien implementa no debe autoaceptar sus propios escenarios si hay otra persona disponible para revisarlos.

Una spec puede pasar a `accepted` solo cuando:

- El problema, incluido y fuera de alcance son concretos.
- El lenguaje ubicuo no tiene términos ambiguos.
- Cada regla tiene un escenario de aceptación verificable.
- Las decisiones abiertas que bloquean implementación están resueltas.
- Los riesgos de datos personales, seguridad o integraciones están identificados.

Registra la evidencia de aceptación en el PR o issue asociado. No se requieren firmas en el archivo para evitar que el control de versiones duplique esa conversación.

## Entrega

Para cambiar a `delivered`, completa la tabla de trazabilidad con rutas de pruebas reales y estado `green` o `passed`. La Definition of Done en [DEVELOPMENT_METHOD.md](../docs/engineering/DEVELOPMENT_METHOD.md) continúa siendo obligatoria.

## Cambios de especificación

Un cambio de comportamiento requiere actualizar primero la spec, revisar los escenarios afectados y crear o modificar la prueba en rojo. Los cambios exclusivamente técnicos no necesitan una spec nueva cuando no cambian comportamiento observable, reglas ni alcance.