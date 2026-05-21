# CODING-RULES

## Directory Structure

```
src/
├── app.ts                          # Fastify app factory + composition root
├── server.ts                       # Entry point: env validation + startup
│
├── controllers/
│   ├── routes.ts                   # Central route registration
│   ├── healthcheck.controller.ts   # Health endpoint
│   └── <name>.controller.ts        # Feature controllers
│
├── services/
│   └── <name>.service.ts           # Feature business logic (factory functions)
│
├── repository/
│   ├── <name>.ts                   # Repository interface
│   └── in-memory/
│       └── <name>.ts               # In-memory implementation (guide)
│
├── types/
│   └── <name>.ts                   # Domain type definitions
│
├── validation/
│   ├── env.ts                      # Environment variable validation
│   └── <name>.ts                   # Zod validation schemas
│
├── shared/
│   ├── types/
│   │   ├── index.ts                # Barrel export
│   │   └── response.ts             # ResponsePayload, AppError, Meta, ErrorCode
│   ├── errors/
│   │   └── index.ts                # Custom error classes
│   ├── constants/
│   │   └── index.ts                # Application constants
│   ├── utils/
│   │   └── index.ts                # Utility functions
│   └── middlewares/
│       └── index.ts                # Fastify middlewares
│
├── docs/                           # API documentation
└── tests/                          # Test files
```

## Architecture Rules

### Layer Responsibility

| Layer | Responsibility | Import From |
|---|---|---|
| **controllers** | HTTP routing, request/response handling | `app` (FastifyInstance), `deps` (injected), shared/types, validation |
| **services** | Business logic | repository interfaces (via factory params), types, shared/errors |
| **repository** | Data access contracts (interfaces) | types, shared/errors |
| **repository/in-memory** | In-memory implementations of repository interfaces | repository interfaces, types |
| **types** | Domain type definitions | — |
| **validation** | Zod schemas for input validation | types |
| **shared** | Cross-cutting concerns (types, errors, utils, constants) | — |

### Dependency Injection

All dependencies are wired in `app.ts` (composition root) and injected into controllers via factory functions. Controllers **MUST NOT** import services or repositories directly.

```
app.ts (composition root)
  │
  ├── repo = createInMemoryRepository()
  ├── service = createService(repo)
  │
  ├── services = { service }
  │
  └── registerRoutes(app, services)
        ├── healthcheckController(app, {})
        └── featureController(app, { service })
```

**Controller signature:**

```ts
export async function myController(
  app: FastifyInstance,
  deps: { myService: MyService },
): Promise<void> {
  app.get("/my-route", async (req) => {
    const result = await deps.myService.doSomething(req.body);
    return { status: 200, data: result };
  });
}
```

**Repository pattern:**

- Interfaces live in `repository/<name>.ts` (e.g., `UserRepository`)
- Implementations live in `repository/<provider>/<name>.ts` (e.g., `in-memory/user.ts`)
- In-memory implementations are fully functional and serve as guides for future providers
- Services receive repository interfaces via factory functions — never import implementations directly

**Rules:**

- Controllers receive `(app, deps)` — always both parameters
- If a controller needs no deps, use `_deps: Record<string, never>`
- `registerRoutes` accepts `(app, services)` and distributes the appropriate subset to each controller
- `app.ts` is the single source of truth for the dependency graph
- No DI container libraries — manual factory-based wiring only
- Services are exported as factory functions: `export function createService(repo) { return { method1, method2 } }`
- `app.ts` exports `AppServices` type defining all available services

### Import Direction

```
app.ts ───────────────────────────────────────────────────────┐
  │                                                            │
  ├── repos (in-memory) ──► services ──► repo interfaces      │
  │                                     (via factory params)   │
  ├── services = { ... } ─────► controllers                   │
  │                              (via deps param)              │
  │                                                            │
  └── services ────► repository interfaces                     │
         ↓                                                    │
       types                                                  │
         ↓                                                    │
       shared ◄───────────────────────────────────────────────┘
```

- Controllers **never** import from `@/services/` or `@/repository/`
- Controllers **only** import from `@/shared/` (types, utils, errors, constants) and `@/validation/`
- Services **never** import repository implementations — they receive interfaces via factory params
- Repository implementations import their own interfaces, never the reverse
- Repository **never** contains business logic
- Shared modules **never** import from domain layers

### Response Envelope

All API responses **MUST** use the `ResponsePayload` envelope:

```ts
{
  status: 200,          // HTTP status code as number
  data: { ... },        // Response payload (success only)
  error: {              // Error details (failure only)
    message: "...",
    code: "VALIDATION_ERROR"
  },
  meta: {               // Pagination (optional)
    page: 1,
    per_page: 20,
    total: 100,
    total_pages: 5
  }
}
```

### Error Handling

- Use custom error classes from `@/shared/errors` (`ValidationError`, `NotFoundError`, etc.)
- Each error class maps to an `ErrorCode` and HTTP status code
- Controllers catch errors and format them into `ResponsePayload`

### Validation

- Use `zod` schemas in `src/validation/` for all input validation
- Environment variables validated at startup via `src/validation/env.ts`
- Request body/query/params validated via zod schemas in controllers

### Naming Conventions

- Files: `kebab-case.ts`
- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Types: domain name (e.g., `user.ts`)
- Validation schemas: domain name (e.g., `user.ts`)
- Repository interfaces: `<name>.ts` (e.g., `user.ts` exports `UserRepository`)
- Repository implementations: `repository/<provider>/<name>.ts`

### Function Style Convention

**Always prefer named functions over arrow functions.** This improves debuggability (clear function names in stack traces), enables function hoisting, and makes the codebase more self-documenting.

**Use named functions for:**
- Module-level function definitions: `function name() {}` or `export function name() {}`
- Exported functions: `export async function name() {}`
- Route handlers: define as named functions, pass by reference
- Object methods: use method shorthand `methodName() {}`

**Arrow functions are ONLY allowed for inline callbacks:**
- Array methods: `.map()`, `.filter()`, `.forEach()`, `.reduce()`, `.find()`, `.some()`, `.every()`
- Promise chains: `.then()`, `.catch()`, `.finally()`
- Inline event handler callbacks

**Examples:**

```ts
// GOOD — named function
export async function healthcheckHandler(): Promise<ResponsePayload> {
  return { status: 200, data: { status: "ok" } };
}

// GOOD — method shorthand in object
return {
  async findById(id: string) { ... },
  async findAll() { ... },
};

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
import { ResponsePayload } from "@/shared/types";
import { createUserSchema } from "@/validation/user";
```
