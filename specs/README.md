# Especificaciones

Las especificaciones son la fuente de verdad del comportamiento que se va a construir. Deben vivir en `specs/<contexto>/<id>-<nombre>.md`, por ejemplo `specs/registration/001-submit-registration.md`.

Antes de implementar, crea la spec desde [`_template.md`](_template.md) o con Spec Kit según [docs/engineering/SPEC_KIT.md](../docs/engineering/SPEC_KIT.md), sigue el [ciclo de vida](LIFECYCLE.md) y obtén el estado `accepted`. Cada escenario de aceptación se implementa obligatoriamente con TDD y se traza a una prueba antes de pasar a `delivered`.

Estados permitidos:

- `draft`: problema y alternativas todavía en discusión.
- `accepted`: comportamiento y límites acordados; listo para TDD.
- `delivered`: escenarios implementados, trazados y verificados.
- `superseded`: reemplazado por otra especificación enlazada.

Copiar [`_template.md`](_template.md) para iniciar un cambio. `pnpm specs:validate` valida los metadatos y la trazabilidad mínima. Las decisiones transversales o difíciles de revertir deben registrarse además como ADR en [docs/architecture/adr/](../docs/architecture/adr/).