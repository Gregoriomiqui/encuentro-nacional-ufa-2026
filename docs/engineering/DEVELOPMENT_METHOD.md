# Método de desarrollo

Este repositorio usa **Spec-Driven Development (SDD)** para acordar el comportamiento, **Domain-Driven Design (DDD)** para modelarlo y **Test-Driven Development (TDD)** como práctica obligatoria para implementar cada cambio de comportamiento.

## Flujo obligatorio

1. Crear una especificación desde [`specs/_template.md`](../../specs/_template.md).
2. Acordar contexto, lenguaje ubicuo, reglas y escenarios de aceptación. La especificación pasa de `draft` a `accepted` antes de implementar.
3. Elegir el escenario más pequeño y escribir una prueba que falle por la razón esperada (**red**).
4. Implementar el mínimo comportamiento para que pase (**green**).
5. Refactorizar sin cambiar el comportamiento y mantener el gate en verde (**refactor**).
6. Implementar solamente el comportamiento, las reglas de dominio y las optimizaciones solicitadas o descritas en los escenarios de la especificación aceptada.
7. Vincular cada escenario con sus pruebas y marcar la especificación como `delivered` al completar la Definition of Done.

No se permite inventar ni agregar funcionalidades, comportamiento observable, reglas de dominio u optimizaciones fuera del alcance solicitado. Solo se permiten ajustes técnicos estrictamente necesarios para entregar el comportamiento acordado, sin ampliar su alcance. Un cambio urgente debe completar el ciclo red-green-refactor antes de integrarse y cerrar con su especificación actualizada.

## Límites DDD

Cada carpeta de `src/features/<contexto>/` representa un contexto funcional. Las dependencias válidas apuntan hacia el dominio:

```text
presentation -> application -> domain
       |              ^
       +-> infrastructure (composición/adaptadores)
```

- `domain`: entidades, value objects, reglas e invariantes sin React, red, almacenamiento ni variables de entorno.
- `application`: casos de uso y puertos. Orquesta el dominio; no importa infraestructura ni presentación.
- `infrastructure`: adaptadores de API, persistencia y servicios externos. Implementa puertos de aplicación.
- `presentation`: componentes y hooks. Traduce interacción de usuario y compone casos de uso con adaptadores.
- `app`: composición global, providers y rutas.
- `shared`: capacidades técnicas reutilizables, no reglas propias de un contexto.

No se crea una abstracción por anticipado. Un puerto existe cuando el caso de uso necesita colaborar con el exterior. Los tipos de proveedores como Make, Firebase o Supabase no deben aparecer en `domain` ni `application`.

## Estrategia de pruebas

- Dominio: pruebas unitarias de invariantes y transiciones, sin mocks de infraestructura.
- Aplicación: pruebas unitarias de casos de uso con puertos falsos o mocks.
- Infraestructura: pruebas de contrato sobre serialización, respuestas y errores del proveedor.
- Presentación: pruebas de comportamiento con Testing Library; consultar como una persona usuaria y evitar detalles internos.
- Flujo crítico: añadir integración cuando el riesgo atraviese varias capas.

Los escenarios `Given/When/Then` describen comportamiento, pero no obligan a usar una librería BDD. La relación escenario-prueba se registra en la tabla de trazabilidad de la especificación.

## Definition of Done

- Especificación en estado `accepted` o `delivered`, con decisiones y fuera de alcance actualizados.
- No hay código ni comportamiento fuera del alcance solicitado o de los escenarios aceptados.
- Reglas de dominio expresadas en el modelo, no duplicadas en la UI.
- Ciclo red-green-refactor obligatorio y demostrable en pruebas relevantes.
- Casos de aceptación trazados a pruebas automatizadas o a una verificación manual justificada.
- `pnpm typecheck`, `pnpm lint`, `pnpm test:coverage` y `pnpm build` pasan.
- Sin secretos, datos personales ni payloads sensibles en logs.