# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Snapshot

- Static website for Encuentro Nacional UFA 2026.
- Stack: plain HTML, CSS, and vanilla JavaScript.
- No package manager, no build pipeline, and no automated test suite.
- Main files: `index.html`, `styles.css`, `script.js`, legal pages, and SEO files.

## Fast Start

- Run locally from repository root:
  - `python3 -m http.server 8000`
- Open site:
  - `http://localhost:8000`

Alternative local serving options are documented in [README.md](README.md) and [QUICKSTART.md](QUICKSTART.md).

## Work Boundaries

- Keep changes small and focused.
- Preserve existing static-site architecture (do not add frameworks, bundlers, or dependencies unless explicitly requested).
- Prefer editing existing files over creating new structure.
- Keep content language in Spanish unless the task explicitly asks otherwise.

## Editing Conventions

### HTML

- Use semantic HTML and preserve accessibility attributes (`lang`, `aria-*`, `alt`, heading hierarchy).
- Keep navigation and legal links working across all pages.
- If event content is updated, keep dates/venue consistent across sections.

### CSS

- Reuse CSS variables from `:root` in `styles.css` for colors, spacing, and typography.
- Avoid hardcoded values when a matching variable already exists.
- Maintain responsive behavior (mobile + desktop).

### JavaScript

- Keep vanilla JS style used in `script.js`.
- Preserve `DOMContentLoaded` initialization pattern.
- Add defensive checks for DOM lookups before acting.
- Avoid introducing global state when not necessary.

## Validation Checklist (Manual)

After UI or behavior changes, verify:

1. Local site loads with no console errors.
2. Main navigation and anchor scrolling still work.
3. Links to `terminos-y-condiciones.html` and `politica-de-privacidad.html` work.
4. Layout remains usable on mobile and desktop widths.
5. External links keep `rel="noopener noreferrer"` behavior.

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
