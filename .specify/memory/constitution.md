# Priva.TOOLS Constitution

## Core Principles

### I. Functional TypeScript

All code MUST be written in TypeScript strict mode. No `class` keyword. No `interface` keyword, use `type` exclusively. Pure functions and composition over OOP. Branded types (`Brand<T, B>`) for domain value objects. `Record<string, T>` lookups instead of if/else or switch for mappings.

### II. Clean Architecture with Dependency Inversion

Strict layered architecture:
- `src/domain/` - Entities, value objects, error factories, typed events, ports. Zero external dependencies.
- `src/infra/` - Port implementations (DB repos, captcha, hashing). Imports from domain only.
- `src/use-cases/` - Business logic. Signature: `async function name(deps: Deps, input: Input): Promise<Output>`. Dependencies injected as object, no DI container. Use `Pick<Port, 'method1' | 'method2'>` to declare the minimum required surface.
- `src/pages/api/` - Astro API routes. Guard pattern: run guards first, parse body, wire deps inline, call use-case, catch errors via `handleUseCaseError`.

**Absolute rule**: domain MUST NEVER import from infra, use-cases, pages, or lib.

### III. Error Factories

Errors are created via factory functions (`validationError(msg)`, `rateLimitError()`, `captchaError()`) that set a custom `.name` on a standard `Error`. No Error subclasses, no `throw new CustomError()`. HTTP status mapping is handled by `ERROR_STATUS_MAP: Record<string, number>` in api-helpers.

### IV. Client-Side Processing

All file processing (PDF, images) happens client-side via Web Workers and WASM. No file uploads to the server. No vendored binaries in `public/`, use Vite `?url` imports from node_modules. `pdfjs-dist` must be lazy-loaded (`import('pdfjs-dist')`) to avoid SSR DOMMatrix errors. Components using pdfjs require `client:only="react"`.

### V. Security by Default

- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) enforced via Astro middleware
- Cloudflare Turnstile captcha on all public forms (except mobile API clients)
- CSRF protection via `requireAuth` guard on API routes
- `ip_hash` never exposed outside the infra layer
- Rate limiting on submissions (per IP, with lockout)
- `import.meta.env.PUBLIC_*` for buildtime only, `process.env.*` for runtime SSR secrets

### VI. Testing Discipline

Vitest + React Testing Library + jsdom. BDD style (`describe`/`it`). Every use-case must have unit tests with mocked dependencies via factory (`createDeps()`). Test behavior, not implementation. Pre-push hook runs eslint + vitest + code-standards-guardian: all three must pass.

### VII. Neobrutalist UI

Tailwind CSS v4 with neobrutalist design system. `cn()` helper (clsx + tailwind-merge) for className composition. Lucide React for icons. Functional components with `Readonly<Props>`.

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 + React 19, pnpm, Node adapter |
| Database | Neon PostgreSQL (serverless), `sql` tagged template literals |
| Styling | Tailwind CSS v4, tailwind-merge, clsx |
| Captcha | Cloudflare Turnstile |
| Testing | Vitest, React Testing Library, jsdom |
| Linting | ESLint + sonarjs + eslint-plugin-astro + @eslint-react |
| Deployment | Coolify (Docker), auto-deploy on push to master |
| Path alias | `@/` maps to `src/` |

## Development Workflow

- Never push directly to master. Always use a feature branch + PR.
- Branch protection on master: 3 required status checks.
- Separate commits by logical unit (deps, config, core logic, UI, tests).
- Pre-push hook validates lint + tests + code-standards-guardian review.
- `sonarjs/deprecation`: use `Buffer.from(b64, 'base64')` instead of `atob` in Node/test context.
- Neon SQL syntax: `sql\`...\`` (tagged template literal, NOT `sql()\`...\``).

## Governance

This constitution supersedes all other project practices. Any amendment requires:
1. A documented rationale
2. Review and approval via PR
3. Version bump (MAJOR for principle removal/redefinition, MINOR for additions, PATCH for clarifications)

All PRs and code reviews must verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-03-24 | **Last Amended**: 2026-03-24
