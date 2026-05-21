## Context

This is a greenfield project — a new Fastify + TypeScript API for the "api-site-uva-barra" application. No existing codebase or legacy constraints apply. The project will follow a layered architecture pattern with clear separation of concerns: controllers handle HTTP routing, services contain business logic, and repositories manage data access.

## Goals / Non-Goals

**Goals:**

- Initialize a Fastify project with TypeScript, strict mode, and path aliases
- Establish a layered architecture: controllers → services → repository → database
- Implement a `GET /health` endpoint returning status and uptime wrapped in `ResponsePayload`
- Define standardized response envelope (`ResponsePayload`, `AppError`, `Meta`, `ErrorCode`) for all endpoints
- Enforce project structure via a CODING-RULES.md document
- Scaffold directories for types, validation, shared utilities, shared types, docs, and tests
- Use environment variable validation at startup

**Non-Goals:**

- No authentication, user CRUD, or business logic beyond healthcheck
- No database connection implementation (only scaffolding)
- No test implementation (only directory structure)
- No CI/CD, Docker, or deployment configuration

## Decisions

**Fastify over Express:** Fastify offers better performance, built-in schema validation, and a modern plugin architecture. The project benefits from its TypeScript-first approach and async/await support.

**Layered architecture:** Controllers register routes and delegate to services. Services contain business logic and call repositories. Repositories handle data access. This separation keeps each layer testable and maintainable.

**Route registration via controller index:** A central `routes.ts` in controllers registers all route modules with the Fastify instance. This avoids scattered `app.get()` calls and makes route discovery straightforward.

**Environment validation with `env.ts`:** A dedicated validation module in `validation/` reads and validates environment variables at startup, failing fast if required values are missing.

**CODING-RULES.md:** A project-level document enforces the directory structure and architectural conventions. This serves as the single source of truth for where code belongs.

**Response envelope pattern:** All API responses use a `ResponsePayload` envelope with `status` (HTTP code as number), `data` (optional payload), `error` (optional `AppError`), and `meta` (optional pagination). The `status` field is intentionally redundant with the HTTP status code — this simplifies frontend parsing since the client only needs to read the body. `ErrorCode` is a string literal union (not numeric enum) for readability in JSON and easier extension. Shared types live in `src/shared/types/` with a barrel export.

**Alternatives considered for response envelope:**
- *No envelope, raw responses:* Simpler but inconsistent — frontend must handle varying shapes per endpoint
- *Numeric ErrorCode:* More compact but less readable in JSON and harder to debug
- *Fastify response schema validation:* Adds auto-generated docs but increases initial complexity — deferred for now

## Risks / Trade-offs

- **[Risk]** Over-engineering for a simple healthcheck → **Mitigation:** Only scaffold structure; no unnecessary abstractions or dependencies beyond Fastify + TypeScript
- **[Risk]** Directory structure may evolve and become outdated → **Mitigation:** CODING-RULES.md will be updated as the project grows; structure is designed to be extensible
- **[Trade-off]** Strict layering adds boilerplate for simple endpoints → **Mitigation:** Acceptable trade-off for long-term maintainability as the API grows
- **[Trade-off]** `status` field duplicates HTTP status code → **Mitigation:** Intentional — simplifies frontend parsing, cost is minimal (one extra number in JSON)
- **[Trade-off]** No Fastify response schema validation initially → **Mitigation:** Can be added later when API surface grows; types already enforce correctness at compile time
