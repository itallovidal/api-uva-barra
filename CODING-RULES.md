# CODING-RULES

> **Maintenance rule (read first):** every change that touches `src/`, `openspec/specs/`, or the project's directory layout MUST also update this file in the same PR. See [Maintenance Rule](#maintenance-rule) at the bottom. The OpenSpec capability that formalizes this is `openspec/specs/coding-rules-maintenance/spec.md`.

## Directory Structure

```
src/
├── app.ts                          # Fastify app factory + composition root + global error handler + env validation
├── server.ts                       # Entry point: dotenv + startup (delegates to createApp)
│
├── controllers/
│   ├── routes.ts                   # Central route registration
│   └── <name>.controller.ts        # Feature controllers
│
├── services/
│   └── <name>.service.ts           # Feature business logic (factory functions)
│
├── repository/
│   ├── <name>.ts                   # Repository interface
│   ├── in-memory/
│   │   └── <name>.ts               # In-memory implementation (guide)
│   └── firebase/
│       ├── index.ts                # Barrel export
│       ├── user.ts                 # Firebase Firestore UserRepository implementation
│       └── <name>.ts               # Future Firebase implementations
│
├── middlewares/
│   └── <name>-middleware.ts        # Fastify hooks/preHandlers (e.g., auth-middleware.ts)
│
├── lib/
│   ├── index.ts                    # Barrel export
│   ├── firebase.ts                 # Firebase Admin SDK initialization (initFirebase)
│   └── <name>.ts                   # Shared initialization modules
│
├── utils/
│   ├── jwt-handler.ts              # JWT sign/verify helpers (receives secret via param)
│   ├── password-handler.ts         # bcrypt hash/compare helpers
│   ├── time-handler.ts             # uptime / ISO timestamp helpers
│   └── <name>-utils.ts             # Feature-scoped pure helpers (e.g., news-utils.ts)
│
├── types/
│   ├── api/                        # Cross-cutting API contracts
│   │   ├── index.ts                # Barrel export (ResponsePayload, ErrorCode, Meta, AppErrorClass)
│   │   ├── response.ts             # ResponsePayload, ErrorPayload, Meta, ErrorCode union
│   │   └── errors.ts               # AppErrorClass
│   ├── auth/
│   │   └── dtos.ts                 # TokenPayloadDTO
│   ├── <domain>/
│   │   ├── entities.ts             # Domain entities + enum-like const objects + types
│   │   └── dtos.ts                 # Request/response DTOs for the domain
│   └── fastify.d.ts                # Fastify module augmentation (e.g., request.user, env decorator)
│
├── validation/
│   ├── env.ts                      # Environment variable validation (validateEnv())
│   └── <name>.ts                   # Zod validation schemas (per domain)
│
└── tests/                          # Test scaffolding folder

http/                               # Manual HTTP test files (.http) — one per domain
_docs/                              # Internal domain docs (markdown)
openspec/                           # OpenSpec specs + change archive
.env.example                        # Documented environment variables template
tests/                              # Smoke tests outside src/

## Architecture Rules

### Layer Responsibility

| Layer | Responsibility | Import From |
|---|---|---|
| **controllers** | HTTP routing, request/response handling, Zod validation, catch + map `AppErrorClass` | `app` (FastifyInstance), `deps` (injected), `@/types/api`, `@/types/<domain>`, `@/validation`, `@/middlewares` |
| **services** | Business logic, orchestration, throws `AppErrorClass` | repository interfaces (via factory params), `@/types/<domain>`, `@/types/api`, `@/utils` |
| **repository** | Data access contracts (interfaces) | `@/types/<domain>` |
| **repository/in-memory** | In-memory implementations of repository interfaces (reference adapter) | repository interfaces, `@/types/<domain>`, `@/types/api` (for `AppErrorClass`), `@/utils` |
| **middlewares** | Fastify hooks / preHandlers, throw `AppErrorClass` | `@/types/api`, `@/utils` |
| **utils** | Pure, stateless helpers (no I/O, no business rules) | `@/types/<domain>`, external libs — **never** from `@/validation/env` (env values are injected as params) |
| **types/api** | Cross-cutting API contracts (`ResponsePayload`, `ErrorCode`, `AppErrorClass`) | — |
| **types/<domain>** | Domain entities + DTOs | `@/types/<domain>` (cross-domain reuse only) |
| **validation** | Zod schemas for input/env validation | `@/types/<domain>` |

### Dependency Injection

All dependencies are wired in `app.ts` (composition root) and injected into controllers via factory functions. Controllers **MUST NOT** import services or repositories directly.

```
server.ts (entry point)
  │
  └── import "dotenv/config"
  └── const { app, env } = await createApp()
  └── app.listen({ port: env.PORT, host: env.HOST })

app.ts (composition root)
  │
  ├── env = validateEnv(process.env)
  ├── app.decorate("env", env)
  ├── db = initFirebase(env)
  │
  ├── repo = createInMemoryRepository()
  ├── service = createService(repo)
  │
  ├── services: AppServices = { categoryService, newsService, registrationService, userService, ... }
  │
  ├── registerRoutes(app, services)
  │     ├── healthcheckController(app, {})
  │     ├── categoryController(app, { categoryService })
  │     ├── newsController(app, { newsService })
  │     ├── registrationController(app, { registrationService })
  │     └── userController(app, { userService })
  │
  ├── app.setErrorHandler(globalErrorHandler)
  │
  └── return { app, env }
```

**Controller signature:**

```ts
export async function myController(
  app: FastifyInstance,
  deps: { myService: MyService },
): Promise<void> {
  async function myHandler(req: FastifyRequest, reply: FastifyReply) {
    const result = await deps.myService.doSomething(req.body);
    return { status: 200, data: result };
  }

  app.post("/my-route", { preHandler: [authMiddleware] }, myHandler);
}
```

**Service signature (factory function):**

```ts
export type MyService = ReturnType<typeof createMyService>;

export function createMyService(repo: MyRepository) {
  return {
    async create(input: CreateMyDTO) { ... },
    async findById(id: string) { ... },
  };
}
```

> **Naming note:** prefer `createXxxService` / `createXxxInMemoryRepository` (lowerCamelCase factory). Legacy `XxxServiceFactory` / `XxxInMemoryRepositoryFactory` (PascalCase + Factory) names exist for `user` and `registration` and are accepted, but new factories SHOULD use the `create*` form for consistency.

**Repository pattern:**

- Interfaces live in `repository/<name>.ts` (e.g., `UserRepository`)
- Implementations live in `repository/<provider>/<name>.ts` (e.g., `in-memory/user.ts`)
- In-memory implementations are fully functional and serve as guides for future providers
- Services receive repository interfaces via factory functions — never import implementations directly
- Repository implementations MAY throw `AppErrorClass` for adapter-level invariants (e.g., update target missing) but MUST NOT contain business logic

**Rules:**

- Controllers receive `(app, deps)` — always both parameters
- If a controller needs no deps, use `_deps: Record<string, never>`
- `registerRoutes` accepts `(app, services)` and distributes the appropriate subset to each controller
- `app.ts` is the single source of truth for the dependency graph
- No DI container libraries — manual factory-based wiring only
- Services are exported as factory functions: `export function createService(repo) { return { method1, method2 } }`
- `app.ts` exports `AppServices` type defining all available services
- `app.ts` registers a global `setErrorHandler` AFTER `registerRoutes` (see [Error Handling](#error-handling))

### Import Direction

```
app.ts ───────────────────────────────────────────────────────────┐
  │                                                                │
  ├── repos (in-memory) ──► services ──► repo interfaces           │
  │                                       (via factory params)     │
  ├── services = { ... } ─────► controllers                        │
  │                              (via deps param)                  │
  │                                                                │
  ├── controllers ──► middlewares, validation, types/api, types/<domain>
  ├── services    ──► repo interfaces, types/<domain>, types/api, utils
  ├── middlewares ──► types/api, utils
  └── repository  ──► types/<domain>, types/api (only AppErrorClass)
         ↓                                                         │
       types/<domain> (entities + dtos)                            │
         ↓                                                         │
       types/api ◄────────────────────────────────────────────────┘
```

- Controllers **never** import from `@/services/` or `@/repository/`
- Controllers import from: `@/types/api`, `@/types/<domain>`, `@/validation`, `@/middlewares`
- Services **never** import repository implementations — they receive interfaces via factory params
- Services MAY import `@/utils/*` for stateless helpers (e.g., `hashPassword`, `generateToken`)
- Repository implementations import their own interfaces, never the reverse
- Repository **never** contains business logic
- `@/types/api` (cross-cutting contracts) **never** imports from any domain layer
- `@/types/<domain>` MAY import from another `@/types/<other-domain>` for cross-domain references (e.g., `registration` references `UserProfessionType` from `user`)
- `@/utils/*` MUST be pure — no I/O, no business rules, no imports from `@/validation/env`. Env-dependent values are injected as function parameters (e.g., `generateToken(payload, JWT_SECRET)`).

### Domain Type Organization

Every domain SHALL have its own folder under `src/types/<domain>/` containing:

- `entities.ts` — domain entities, enum-like `const X = { ... } as const` objects, and derived types (`XType`, `XStatusType`, ...)
- `dtos.ts` — request/response DTOs and query DTOs for the domain

Cross-cutting contracts (used by every layer) live in `src/types/api/`:

- `response.ts` — `ResponsePayload<T>`, `ErrorPayload`, `MetaApiPayload` / `Meta`, `ErrorCode` union
- `errors.ts` — `AppErrorClass`
- `index.ts` — barrel export. **Consumers always import from `@/types/api`**, never directly from `@/types/api/errors` or `@/types/api/response`.

```ts
// GOOD
import { ResponsePayload, AppErrorClass } from "@/types/api";

// BAD
import { AppErrorClass } from "@/types/api/errors";
```

### Response Envelope

All API responses **MUST** use the `ResponsePayload` envelope from `@/types/api`:

```ts
{
  status: 200,          // HTTP status code as number
  data: { ... },        // Response payload (success only; null on error)
  error: {              // Error details (failure only)
    message: "...",
    code: "VALIDATION_ERROR"
  },
  meta: {               // Pagination (optional)
    page: 1,
    perPage: 20,
    total: 100,
    totalPages: 5
  }
}
```

- Pagination meta keys are `page`, `perPage`, `total`, `totalPages` (camelCase, see `MetaApiPayload`).
- 204 responses MAY return `{ status: 204 }` or `undefined`.
- Errors MUST always include `error.message` and `error.code` (matching `ErrorCode` union).

### Error Handling

- All controlled errors **MUST** use `AppErrorClass` from `@/types/api` (extends `Error` with `code: ErrorCode` + `statusCode: number`)
- Throwing pattern: `throw new AppErrorClass(message, code, statusCode)` — used in services, repositories, and middlewares
- `ErrorCode` union (in `src/types/api/response.ts`) currently includes: `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`, `INTERNAL_ERROR`, `CONFLICT`, `INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `INVALID_PAYLOAD`, `USER_NOT_FOUND`, `USER_CREATION_ERROR`, `RESPONSE_PARSE_ERROR`. New codes MUST be added to the union and to this list in the same PR.
- Controller catch blocks check `error instanceof AppErrorClass`:
  - If true: `reply.code(error.statusCode)` then return `{ status: error.statusCode, error: { message: error.message, code: error.code }, data: null }`
  - If false: `throw error` (rethrow unexpected errors to global handler)
- Zod `safeParse` validation failures are returned directly as `400 / VALIDATION_ERROR` (or `INVALID_PAYLOAD`) — they are NOT thrown
- A global `setErrorHandler` in `app.ts` catches any error that escapes handlers and preHandlers:
  - `AppErrorClass` → structured response using `.statusCode`, `.message`, `.code`
  - Unknown errors → `app.log.error(error)` + `500` with `"INTERNAL_ERROR"` code and generic Portuguese message
- Middlewares (e.g., `authMiddleware`) **MUST** `throw new AppErrorClass(...)` instead of calling `reply.code(X).send(...)` directly, letting the global handler format the response
- `throw new Error(...)`, `throw { message, code, ... }` (plain object), and `Error.cause` bags are PROHIBITED for controlled errors

### Authentication & Password Hashing

- JWT helpers live in `src/utils/jwt-handler.ts` and expose `generateToken(payload, JWT_SECRET)` / `decodeToken(token, JWT_SECRET)`. The `JWT_SECRET` is injected from the Fastify `env` decorator (populated by `createApp()` in `app.ts`).
- Password helpers live in `src/utils/password-handler.ts` and expose `hashPassword(plain)` / `verifyPassword(plain, hash)` using `bcrypt` with 10 salt rounds.
- Token payload shape is `TokenPayloadDTO` (in `src/types/auth/dtos.ts`): `{ sub: string; email: string; role: string }`. Token TTL is 24h.
- Auth middleware (`src/middlewares/auth-middleware.ts`):
  - Reads `Authorization: Bearer <token>`
  - On missing / malformed / invalid / expired token → `throw new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401)`
  - On success → attaches the decoded payload to `request.user`
- `FastifyRequest.user` is typed via module augmentation in `src/types/fastify.d.ts` — every protected handler MAY read `request.user?.sub` etc. without an extra cast.
- Public routes (no `authMiddleware`): healthcheck, registration creation, login, public news read endpoints.
- Protected routes use `{ preHandler: [authMiddleware] }`.

### Fastify Module Augmentation

- All Fastify type augmentations live in `src/types/fastify.d.ts`.
- New augmentations (e.g., adding fields to `FastifyReply`, `FastifyInstance`) MUST be added there with explicit types — never inline in a controller.
- The `env` decorator is added at runtime via `app.decorate("env", env)` in `createApp()`. Middlewares that need env values (e.g., `JWT_SECRET` in `auth-middleware.ts`) read from `(request.server as unknown as { env: Env }).env` — this pattern avoids importing `@/validation/env` in middlewares.

### HTTP Test Files

- Manual HTTP request files live in `http/<domain>.http` (one per domain): `healthcheck.http`, `category.http`, `news.http`, `user.http`, `registration.http`.
- They cover every endpoint of the domain, use placeholder IDs/emails, and document which routes require `Authorization: Bearer <token>`.
- When a new endpoint is added, the corresponding `http/<domain>.http` file MUST be updated in the same PR.

### Validation

- Use `zod` schemas in `src/validation/<domain>.ts` for all input validation
- Environment variables validated eagerly in `createApp()` (`src/app.ts`) via `validateEnv(process.env)` — called once at startup, result decorated as `app.env` and returned as `{ app, env }`
- Request body / query / params validated via zod `safeParse` in controllers
- On `safeParse` failure, controllers return a `400` response with code `VALIDATION_ERROR` or `INVALID_PAYLOAD` — they do NOT throw

### Naming Conventions

- Files: `kebab-case.ts`
- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Middlewares: `*-middleware.ts`
- Utils: `*-handler.ts` (for cross-cutting concerns like `jwt-handler`, `password-handler`, `time-handler`) or `*-utils.ts` (for domain-scoped helpers like `news-utils`)
- Domain types: `entities.ts` + `dtos.ts` inside `src/types/<domain>/`
- Validation schemas: `<domain>.ts`
- Repository interfaces: `<name>.ts` (e.g., `user.ts` exports `UserRepository`)
- Repository implementations: `repository/<provider>/<name>.ts`
- HTTP test files: `http/<domain>.http`
- OpenSpec changes: `openspec/changes/YYYY-MM-DD-<kebab-name>/`
- OpenSpec specs (live): `openspec/specs/<capability-name>/spec.md`

### Function Style Convention

**Always prefer named functions over arrow functions.** This improves debuggability (clear function names in stack traces), enables function hoisting, and makes the codebase more self-documenting.

**Use named functions for:**
- Module-level function definitions: `function name() {}` or `export function name() {}`
- Exported functions: `export async function name() {}`
- Route handlers: define as named functions, pass by reference
- Object methods (e.g., service factory returns): use method shorthand `methodName() {}`

**Arrow functions are ONLY allowed for inline callbacks:**
- Array methods: `.map()`, `.filter()`, `.forEach()`, `.reduce()`, `.find()`, `.some()`, `.every()`
- Promise chains: `.then()`, `.catch()`, `.finally()`
- Inline event handler / hook callbacks

**Examples:**

```ts
// GOOD — named function
export async function healthcheckHandler(): Promise<ResponsePayload> {
  return { status: 200, data: { status: "ok" } };
}

// GOOD — method shorthand in factory return
export function createNewsService(repo: NewsRepository) {
  return {
    async create(input: CreateNewsDTO) { /* ... */ },
    async findById(id: string) { /* ... */ },
  };
}

// BAD — arrow function assigned to variable
export const healthcheckHandler = async (): Promise<ResponsePayload> => {
  return { status: 200, data: { status: "ok" } };
};

// GOOD — arrow function in inline callback (allowed)
const names = users.map(user => user.name);
```

This convention is enforced by ESLint via the `no-restricted-syntax` rule in `eslint.config.js`.

### Path Aliases

All imports use `@/` alias mapping to `src/`:

```ts
import { ResponsePayload, AppErrorClass } from "@/types/api";
import { createUserSchema } from "@/validation/user";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { hashPassword } from "@/utils/password-handler";
import type { User } from "@/types/user/entities";
import type { CreateUserDTO } from "@/types/user/dtos";
```

### Code Comments

- Do NOT add explanatory or “what this does” comments in source files. The named-functions + small-file convention is expected to make code self-documenting.
- TSDoc on exported public APIs is acceptable when it documents non-obvious contracts (status code mapping, side effects).
- TODO / FIXME comments are allowed only when paired with a tracked OpenSpec change or GitHub issue reference.

## Maintenance Rule

This file is the canonical reference for contributors. To stay accurate, the following SHALL be observed:

1. **Every PR that adds, moves, renames, or removes a file under `src/` MUST update the [Directory Structure](#directory-structure) section.**
2. **Every PR that changes an architectural rule (layer responsibility, import direction, error pattern, naming, auth flow, etc.) MUST update the corresponding section here in the same PR.**
3. **Every PR that adds a new `ErrorCode` literal MUST add it to the union list in [Error Handling](#error-handling).**
4. **Every PR that adds a new HTTP endpoint MUST update the matching `http/<domain>.http` file.**
5. **Every OpenSpec change archived under `openspec/changes/archive/` whose specs touched architectural rules MUST be reflected here.** The Apply step of any change SHALL include a task: `Update CODING-RULES.md`.
6. **If a rule here conflicts with a live spec under `openspec/specs/`, the spec wins** — but this file MUST be patched to match in the same PR. Drift between the two is a bug.

This rule is formalized as the OpenSpec capability `coding-rules-maintenance` (see `openspec/specs/coding-rules-maintenance/spec.md`).
