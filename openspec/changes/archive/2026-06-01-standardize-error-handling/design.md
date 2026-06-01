## Context

The codebase defines `AppErrorClass` (extends `Error` with `code: ErrorCode` + `statusCode: number`) but never uses it. Three inconsistent error patterns coexist:

1. **Services (user, registration)**: `throw new Error(msg, { cause: { code, message, status } })` — relies on Node.js `Error.cause`
2. **Services (news, category)**: `throw { message, code }` — plain objects matching `AppError` interface, not `Error` instances
3. **Repositories (registration-request)**: `throw new Error(msg)` — bare strings, no metadata

Catch blocks replicate the extraction logic: some read `error.cause`, some cast `error as AppError`, some always return 500. Distinguishing controlled errors from unexpected bugs requires reading the catch logic.

The `ErrorCode` union (`VALIDATION_ERROR | NOT_FOUND | UNAUTHORIZED | FORBIDDEN | INTERNAL_ERROR | CONFLICT`) does not include the specific codes used in `API_ERROR_CODES` (e.g., `EMAIL_ALREADY_EXISTS`, `INVALID_CREDENTIALS`), creating a type gap.

No global Fastify error handler exists — uncaught errors from any handler fall through to Fastify's default generic 500 response.

## Goals / Non-Goals

**Goals:**
- All controlled application errors thrown via `new AppErrorClass(...)` everywhere
- All catch blocks check `error instanceof AppErrorClass` as the single mechanism
- Global Fastify error handler (`setErrorHandler`) catches unexpected (non-AppErrorClass) errors with a uniform `INTERNAL_ERROR` response
- `ErrorCode` union expanded to cover all `API_ERROR_CODES` values, or `API_ERROR_CODES` remapped to match `ErrorCode`
- Remove all `Error.cause` bag usage
- Auth middleware (`auth-middleware.ts`) uses `AppErrorClass` + global handler instead of inline `.send()`

**Non-Goals:**
- Changing `ResponsePayload` envelope shape
- Changing validation error responses (Zod `safeParse` failures already return direct — those are not thrown errors)
- Adding new features or endpoints
- Changing repository layer error behavior beyond adopting `AppErrorClass`
- Migration of existing tests

## Decisions

### Decision 1: Expand `ErrorCode` union to include all API_ERROR_CODES values
**Why**: The existing `ErrorCode` type is too narrow — services legitimately need codes like `EMAIL_ALREADY_EXISTS` and `INVALID_CREDENTIALS`. Rather than forcing every error into 6 buckets, expand the union to include all meaningful specific codes.
**Alternative considered**: Keep `ErrorCode` at 6 values and map API_ERROR_CODES into them. Rejected because it loses granularity — `EMAIL_ALREADY_EXISTS` tells the client more than `CONFLICT` alone.
**Result**: The `ErrorCode` type becomes the union of all `API_ERROR_CODES.*` values plus the existing generic codes.

### Decision 2: Single `instanceof` check in controllers, let everything else propagate
**Why**: Every catch block follows the same pattern — check `instanceof AppErrorClass`, extract `.code`/`.statusCode`/`.message`, build `ResponsePayload`. Other errors (programming bugs, network failures) should not be caught locally; they should bubble up to the global error handler.
**Alternative considered**: Keep `catch (error: Error | any)` with a fallback. Rejected because it requires every handler to redundantly write the 500 fallback — the global handler is the single source of truth for unexpected errors.
**Result**: Try/catch in controllers becomes:
```ts
catch (error: unknown) {
  if (error instanceof AppErrorClass) {
    reply.code(error.statusCode)
    return { status: error.statusCode, error: { message: error.message, code: error.code }, data: null }
  }
  throw error  // rethrow unexpected to global handler
}
```

### Decision 3: Global error handler registered in `app.ts`
**Why**: Fastify's `setErrorHandler` catches any error thrown or passed to `reply.send()` after route handlers. It is the ideal place for the final `INTERNAL_ERROR` fallback, removing the need for catch blocks to handle unexpected errors at all.
**Result**: In `createApp()`, after `registerRoutes`, call:
```ts
app.setErrorHandler(function errorHandler(error, _request, reply) {
  if (error instanceof AppErrorClass) {
    return reply.code(error.statusCode).send({
      status: error.statusCode,
      error: { message: error.message, code: error.code },
      data: null,
    })
  }
  app.log.error(error)
  return reply.code(500).send({
    status: 500,
    error: { message: "Algo de errado aconteceu, tente novamente mais tarde.", code: "INTERNAL_ERROR" },
    data: null,
  })
})
```

### Decision 4: Auth middleware throws `AppErrorClass` + rethrow
**Why**: PreHandlers run in Fastify's hook chain — if they throw, the error propagates to `setErrorHandler`. This removes the inline `reply.code(401).send(...)` duplication.
**Result**: Instead of sending directly, `authMiddleware` throws `new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401)` and the global handler formats the response.

### Decision 5: Deprecate `API_ERROR_CODES` object in favor of `ErrorCode` string literals
**Why**: Once `ErrorCode` covers all needed values, the `API_ERROR_CODES` const object is redundant — the literal strings are self-documenting and type-checked by the union. Removing the indirection aligns all code around the `AppErrorClass.code: ErrorCode` contract.
**Alternative considered**: Keep `API_ERROR_CODES` and remap values to match `ErrorCode`. Rejected because it adds a mapping layer with no benefit — the string literals are already validated by TypeScript.
**Result**: Throw sites use string literals directly: `new AppErrorClass("Email already exists", "EMAIL_ALREADY_EXISTS", 409)`.

## Risks / Trade-offs

- **[Breaking] Catch blocks that rethrow unexpected errors** → If a handler doesn't have a try/catch at all, the global handler catches it — so this is safe. But handlers that do have try/catch must rethrow `throw error` after the `instanceof` check. Missing the rethrow silently swallows bugs.
- **[Greenfield] Auth middleware changes from send → throw** → PreHandler hooks that throw are handled by Fastify's error pipeline, same as route handlers. Verified with Fastify docs — `setErrorHandler` catches preHandler throws.
- **[Compatibility] Existing tests may check error messages or codes** → The error format (`{ status, error: { message, code }, data: null }`) does not change. Codes change from `API_ERROR_CODES.X` values to `ErrorCode` values — tests asserting specific code strings need updating.
