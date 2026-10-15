# Spec Kit en este repositorio

Spec Kit es la interfaz para producir los artefactos SDD de un cambio funcional. Las políticas del proyecto siguen siendo obligatorias: [DEVELOPMENT_METHOD.md](DEVELOPMENT_METHOD.md), [LIFECYCLE.md](../../specs/LIFECYCLE.md) y la [constitución](../../.specify/memory/constitution.md).

## Flujo

Desde Copilot, ejecuta los comandos en este orden:

1. `/speckit.specify <necesidad de negocio>` crea `specs/<id>-<nombre>/spec.md` en `draft`.
2. `/speckit.clarify` resuelve ambigüedades antes de aceptar la spec.
3. La persona solicitante revisa alcance y escenarios; cambia `**Status**: Draft` por `**Status**: Accepted`.
4. `/speckit.plan` crea el plan técnico y verifica la constitución.
5. `/speckit.tasks` genera tareas. Cada escenario debe tener una tarea de prueba previa a la tarea de implementación.
6. `/speckit.analyze` revisa coherencia entre spec, plan y tareas.
7. `/speckit.implement` ejecuta las tareas mediante red-green-refactor.
8. `/speckit.converge` identifica trabajo pendiente. Al terminar, actualiza trazabilidad, valida el repositorio y cambia el estado a `Delivered`.

Usa `/speckit.checklist` cuando se necesite una revisión específica, por ejemplo accesibilidad, privacidad o contratos de integración.

## Artefactos y trazabilidad

Para trabajo nuevo, Spec Kit crea el formato canónico:

```text
specs/NNN-nombre/
├── spec.md
├── plan.md
├── tasks.md
├── research.md
├── data-model.md
└── contracts/
```

Añade al final de `spec.md` una tabla `## Trazabilidad` que relacione cada escenario con su prueba y estado `green` o `passed`. `pnpm specs:validate` valida los metadatos esenciales de los formatos histórico y Spec Kit.

Las specs existentes con nombre `specs/<contexto>/<id>-<nombre>.md` se conservan como formato histórico. No las migres salvo que el cambio requiera actualizar su comportamiento.

## Controles obligatorios

Antes de abrir un PR:

```bash
pnpm specs:validate
pnpm typecheck
pnpm lint
pnpm test:coverage
pnpm build
```

No implementes antes de que la spec esté `Accepted`, ni agregues comportamiento que no esté solicitado y cubierto por escenarios aceptados.