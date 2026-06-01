## Why

The codebase has an `AppErrorClass` defined but never used. Instead, two different ad-hoc patterns exist: `throw new Error(msg, { cause })` in some services and plain object throws in others. Catch blocks must guess how to extract error info, making it hard to distinguish controlled errors from unexpected bugs. Standardizing on `AppErrorClass` makes every thrown error self-describing (code + statusCode + message), simplifies catch blocks to a single `instanceof` check, and surfaces unexpected errors immediately.

## What Changes

- Replace all `throw new Error(msg, { cause })` in services with `throw new AppErrorClass(...)`
- Replace all plain object throws with `throw new AppErrorClass(...)`
- Add a global Fastify error handler (`setErrorHandler`) that catches unhandled errors and returns a structured `ResponsePayload` with `INTERNAL_ERROR` code
- Simplify all catch blocks in controllers to check `error instanceof AppErrorClass` and delegate to the global handler for unknown errors
- Normalize error codes — align thrown codes with the `ErrorCode` union type (VALIDATION_ERROR, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, INTERNAL_ERROR, CONFLICT)
- Remove or deprecate `error.cause` bag pattern entirely

## Capabilities

### New Capabilities
- `error-handling`: Unified error throwing and handling across the entire application using `AppErrorClass`

### Modified Capabilities

<!-- No existing specs change — this is cross-cutting infrastructure, not a feature spec change -->

## Impact

- **src/services/**: All files — replace Error/cause throws with AppErrorClass
- **src/controllers/**: All files — simplify catch blocks; remove cause-bag parsing
- **src/middlewares/auth-middleware.ts**: Use AppErrorClass + global error handler
- **src/app.ts**: Register global Fastify error handler
- **src/types/api/errors.ts**: May need minor updates (align ErrorCode values, support cause passthrough)
- **src/types/api/response.ts**: Possibly reconcile API_ERROR_CODES with ErrorCode union
- Every file that imports or references the old patterns
