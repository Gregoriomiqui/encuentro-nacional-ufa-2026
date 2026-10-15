---
id: CONTEXT-000
title: Título breve orientado al comportamiento
status: draft
owners: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# CONTEXT-000: Título

## Contexto y problema

Quién necesita qué, por qué importa y cuál es el comportamiento actual.

## Alcance

### Incluido

- Resultado observable que se entregará.

### Fuera de alcance

- Trabajo relacionado que no forma parte de esta entrega.

Todo comportamiento observable, regla de dominio u optimización entregable debe estar solicitado y descrito en un escenario de aceptación. Los ajustes técnicos sin comportamiento observable adicional deben ser estrictamente necesarios para implementar el alcance incluido.

## Lenguaje ubicuo

| Término | Significado en este contexto |
| --- | --- |
| Ejemplo | Definición precisa y compartida |

## Reglas e invariantes

- R1. Regla de negocio verificable.

## Escenarios de aceptación

### S1: Resultado esperado

```gherkin
Given un estado inicial relevante
When ocurre una acción del negocio
Then se observa un resultado verificable
```

## Diseño y límites

- Contexto afectado: `src/features/<contexto>`.
- Modelo de dominio afectado:
- Caso de uso y puertos:
- Adaptadores externos:
- Riesgos, seguridad y privacidad:

## Trazabilidad

| Escenario | Prueba automatizada | Estado |
| --- | --- | --- |
| S1 | `ruta/al/archivo.spec.ts` | red |

Cada escenario se implementa obligatoriamente mediante TDD: la prueba debe fallar antes de la implementación y quedar en verde tras completar el comportamiento.

## Decisiones abiertas

- [ ] Pregunta que debe resolverse antes de pasar a `accepted`.

## Verificación

- [ ] Cada escenario tiene prueba o justificación manual.
- [ ] Se ejecutó el gate de calidad.
- [ ] La documentación refleja el comportamiento entregado.