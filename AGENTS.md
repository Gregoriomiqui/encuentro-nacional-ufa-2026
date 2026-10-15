# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Snapshot

- React 19 SPA for Encuentro Nacional UFA 2026, built with Vite and strict TypeScript.
- Architecture: feature-first with domain, application, infrastructure, and presentation layers.
- Package manager: pnpm. Tests use Vitest and React Testing Library.
- The root static HTML/CSS/JS files are legacy; active application code lives in `src/`.
- All behavior changes must follow the mandatory SDD + DDD + TDD method in `docs/engineering/DEVELOPMENT_METHOD.md`.

## Fast Start

- Install: `pnpm install`
- Run locally: `pnpm dev`
- Quality checks: `pnpm typecheck`, `pnpm lint`, `pnpm test:coverage`, `pnpm build`

## Work Boundaries

- Keep changes small and focused.
- Start functional changes from a versioned specification in `specs/`.
- Use Spec Kit for new functional changes as described in `docs/engineering/SPEC_KIT.md`; its generated artifacts must comply with this repository's constitution and lifecycle.
- Keep a specification in `accepted` state before implementing behavior. Implement each acceptance scenario with TDD and update its traceability before marking it `delivered`; run `pnpm specs:validate`.
- Do not invent or add code, behavior, domain rules, optimizations, or features that were not explicitly requested or covered by an accepted specification. Only make technical changes strictly required to deliver the requested behavior.
- Preserve the dependency direction enforced by ESLint: presentation -> application -> domain.
- Application cases use ports; infrastructure implements adapters; presentation or `app` composes them.
- Prefer existing React, TypeScript, Vite, and feature conventions over new dependencies.
- Keep content language in Spanish unless the task explicitly asks otherwise.

## Editing Conventions

### React and HTML

- Use semantic JSX and preserve accessibility attributes (`lang`, `aria-*`, `alt`, heading hierarchy).
- Keep navigation and legal links working across all pages.
- If event content is updated, keep dates/venue consistent across sections.

### CSS

- Reuse CSS variables from `:root` in `styles.css` for colors, spacing, and typography.
- Avoid hardcoded values when a matching variable already exists.
- Maintain responsive behavior (mobile + desktop).

### TypeScript

- Keep strict types and use path aliases defined by the project.
- Put business invariants in domain and orchestration in application use cases.
- Add defensive checks for DOM lookups before acting.
- Avoid introducing global state when not necessary.

## Validation Checklist

After changes, run the automated gate and verify UI behavior when applicable:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test:coverage`
4. `pnpm build`
5. Local site loads with no console errors.
6. Layout remains usable on mobile and desktop widths.

## Deployment Notes

- Deployment target is GitHub Pages.
- If URLs change, ensure `sitemap.xml` and `robots.txt` are updated consistently.
- Deployment workflow details are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Source Docs (Link, Do Not Duplicate)

- Project overview: [README.md](README.md)
- Quick setup: [QUICKSTART.md](QUICKSTART.md)
- Structure map: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- Contribution flow: [CONTRIBUTING.md](CONTRIBUTING.md)
- Deployment steps: [DEPLOYMENT.md](DEPLOYMENT.md)
- Current priorities: [TODO.md](TODO.md)
- Documentation index: [INDEX.md](INDEX.md)
- Logo replacement details: [LOGO_INSTRUCTIONS.md](LOGO_INSTRUCTIONS.md)
