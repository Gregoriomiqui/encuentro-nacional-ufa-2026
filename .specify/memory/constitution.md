# Constitución de desarrollo UFA

## Principios fundamentales

### I. Especificación antes que código

Todo cambio de comportamiento comienza con una especificación versionada en `specs/`. Ninguna funcionalidad, regla de dominio, optimización o comportamiento observable puede inventarse ni implementarse fuera de una solicitud explícita y de escenarios aceptados. Las decisiones abiertas se resuelven antes de planificar; los cambios de alcance devuelven la especificación a `draft`.

### II. TDD obligatorio

Cada escenario de aceptación se implementa con Test-Driven Development: escribir una prueba que falle por la razón esperada, implementar el mínimo comportamiento para que pase y refactorizar sin alterar el resultado. No hay excepciones para cambios urgentes; deben cerrar el ciclo red-green-refactor antes de integrarse.

### III. Dominio independiente

Cada contexto funcional se organiza en `domain`, `application`, `infrastructure` y `presentation`. El dominio no depende de React, red, almacenamiento ni proveedores. La aplicación define puertos y orquesta el dominio; infraestructura implementa adaptadores; presentación o `app` realiza la composición. Los límites se verifican mediante ESLint.

### IV. Entrega verificable

Cada escenario tiene trazabilidad a pruebas automatizadas. Los cambios cumplen `pnpm specs:validate`, `pnpm typecheck`, `pnpm lint`, `pnpm test:coverage` y `pnpm build`. No se registran secretos, comprobantes ni datos personales en logs.

### V. Simplicidad y alcance estricto

El plan y las tareas implementan solo el alcance aceptado. Los ajustes técnicos están permitidos únicamente cuando son estrictamente necesarios para entregar el comportamiento acordado y no amplían el resultado observable. No se añaden abstracciones, dependencias o refactorizaciones preventivas.

## Restricciones técnicas

- Aplicación React 19, Vite y TypeScript estricto; el código activo vive en `src/`.
- Paquetes con pnpm; pruebas con Vitest y React Testing Library.
- Contenido del producto en español, salvo solicitud explícita en sentido contrario.
- Las integraciones externas se protegen tras puertos; sus tipos no aparecen en `domain` ni `application`.

## Flujo de trabajo

1. Ejecutar `/speckit.specify` para crear la especificación en `draft`.
2. Ejecutar `/speckit.clarify` cuando haya ambigüedades y obtener revisión para cambiar a `accepted`.
3. Ejecutar `/speckit.plan`, verificar esta constitución y registrar la estructura DDD elegida.
4. Ejecutar `/speckit.tasks`; cada tarea de implementación debe comenzar por una tarea de prueba en rojo.
5. Ejecutar `/speckit.analyze` y corregir incoherencias antes de implementar.
6. Ejecutar `/speckit.implement` siguiendo el orden TDD.
7. Ejecutar `/speckit.converge`, actualizar trazabilidad y cambiar a `delivered` solo al cumplir los gates.

La guía detallada de estados y aceptación está en `specs/LIFECYCLE.md`; esta constitución prevalece sobre las plantillas generadas por Spec Kit cuando exista conflicto.

## Gobernanza

Esta constitución es obligatoria para toda especificación, plan, tarea, implementación y revisión. Toda modificación requiere actualizar este archivo, `docs/engineering/DEVELOPMENT_METHOD.md` cuando afecte el proceso y la documentación de migración correspondiente. La persona que solicita el cambio acepta alcance y escenarios; quien implementa aporta evidencia TDD y de los gates.

**Versión**: 1.0.0 | **Ratificada**: 2026-09-11 | **Última modificación**: 2026-09-11