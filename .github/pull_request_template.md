## Especificación

- Spec: <!-- specs/<contexto>/<id>-<nombre>.md -->
- Escenarios implementados:

## Ciclo TDD

- Red: <!-- prueba y fallo esperado -->
- Green: <!-- implementación mínima -->
- Refactor: <!-- mejora realizada o N/A -->

## Verificación

- [ ] La especificación está `accepted` o `delivered`.
- [ ] Las dependencias respetan los límites DDD.
- [ ] Los escenarios están trazados a pruebas.
- [ ] Cada cambio de comportamiento completó el ciclo TDD red-green-refactor.
- [ ] No hay código, comportamiento, reglas de dominio, optimizaciones ni funcionalidades fuera de los escenarios aceptados.
- [ ] `pnpm specs:validate`
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test:coverage`
- [ ] `pnpm build`