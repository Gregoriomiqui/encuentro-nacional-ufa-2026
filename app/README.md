# App Frontend

Aplicacion frontend basada en React 19 + TypeScript + Vite, organizada por features y capas de Clean Architecture para soportar crecimiento del dominio con bajo acoplamiento.

## Arquitectura

Se aplica una combinacion de Feature-First y Clean Architecture:

1. Domain: entidades, value objects y reglas de negocio puras.
2. Application: casos de uso y puertos.
3. Infrastructure: adaptadores y repositorios.
4. Presentation: componentes, hooks y paginas.

Estructura principal:

- src/app: bootstrap, router, providers y estilos globales.
- src/shared: utilidades y componentes reutilizables.
- src/features: modulos de negocio aislados por feature.
- src/pages: composicion de pantallas.

## Prerrequisitos

1. Node 24 LTS.
2. pnpm 9.

## Instalacion y arranque

Desde la carpeta raiz del repositorio:

```bash
pnpm -C app install
pnpm -C app dev
```

## Variables de entorno

Antes de ejecutar la aplicacion, crea un archivo .env en la carpeta app usando app/.env.example como referencia.

Variables usadas por el modulo de inscripción:

1. VITE_MAKE_WEBHOOK_URL
2. VITE_MAKE_API_KEY

Variable opcional general:

1. VITE_API_BASE_URL

## Scripts disponibles

```bash
pnpm -C app dev
pnpm -C app build
pnpm -C app preview
pnpm -C app typecheck
pnpm -C app lint
pnpm -C app test
pnpm -C app test:watch
pnpm -C app test:coverage
```

## Convenciones de codigo

1. TypeScript estricto obligatorio.
2. Sin logica de negocio en componentes de UI.
3. Regla de dependencias: presentation/infrastructure dependen de application/domain, nunca al reves.
4. Mantener componentes declarativos y transformaciones inmutables.
5. Evitar any salvo excepcion justificada.

## Git y colaboracion

Conventional Commits sugerido:

1. feat
2. fix
3. refactor
4. test
5. docs
6. chore

Ramas sugeridas:

1. main: produccion.
2. develop: integracion.
3. feature/<nombre-corto>: trabajo funcional.
4. hotfix/<nombre-corto>: correcciones urgentes.

## Flujo TDD

Cada cambio funcional debe seguir Red -> Green -> Refactor:

1. Red: crear prueba que falle por especificacion.
2. Green: implementar lo minimo para pasar.
3. Refactor: limpiar diseño manteniendo pruebas verdes.

Comandos recomendados durante desarrollo:

```bash
pnpm -C app test:watch
pnpm -C app test:coverage
```

## Calidad automatizada

El gate de calidad en CI ejecuta:

1. typecheck
2. lint
3. test
4. test:coverage
5. build

Pipeline configurado en [.github/workflows/app-quality-gate.yml](../.github/workflows/app-quality-gate.yml).
