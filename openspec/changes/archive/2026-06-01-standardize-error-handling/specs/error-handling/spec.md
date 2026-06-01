## ADDED Requirements

### Requirement: AppErrorClass SHALL be used for all controlled errors
All business logic errors (services, repositories) SHALL throw `new AppErrorClass(message, code, statusCode)` instead of `new Error()`, plain objects, or `Error.cause` bags. `AppErrorClass` SHALL be imported from `@/types/api`.

#### Scenario: Service throws controlled error
- **WHEN** any service method encounters an expected failure (e.g., not found, duplicate, invalid state, forbidden)
- **THEN** the service SHALL throw `throw new AppErrorClass(message, code, statusCode)` where `code` matches a member of the `ErrorCode` union

#### Scenario: Repository throws controlled error
- **WHEN** any repository method encounters an expected failure (e.g., record not found on update)
- **THEN** the repository SHALL throw `throw new AppErrorClass(message, code, statusCode)`

### Requirement: Controllers SHALL catch AppErrorClass and rethrow unexpected errors
All route handler catch blocks SHALL check `error instanceof AppErrorClass`. If true, they SHALL return a `ResponsePayload` with the error's `.statusCode`, `.message`, and `.code`. If false, they SHALL rethrow `error` so the global error handler catches it.

#### Scenario: Handler catches known error
- **WHEN** a service throws `new AppErrorClass("Not found", "NOT_FOUND", 404)`
- **THEN** the catch block SHALL return `{ status: 404, error: { message: "Not found", code: "NOT_FOUND" }, data: null }` with `reply.code(404)`

#### Scenario: Handler rethrows unknown error
- **WHEN** a non-AppErrorClass error (e.g., `TypeError`, network failure) is caught
- **THEN** the catch block SHALL `throw error` after the `instanceof` check, letting it propagate to the global error handler

### Requirement: Global error handler SHALL catch all unhandled errors
The Fastify app SHALL register a `setErrorHandler` that catches any error escaping route handlers or preHandlers. If the error is `AppErrorClass`, it SHALL return a structured response. Otherwise, it SHALL log the error and return `500` with code `"INTERNAL_ERROR"`.

#### Scenario: Global handler returns structured response
- **WHEN** an `AppErrorClass` reaches `setErrorHandler`
- **THEN** the handler SHALL return `{ status: error.statusCode, error: { message: error.message, code: error.code }, data: null }`

#### Scenario: Global handler returns generic 500
- **WHEN** a non-AppErrorClass error reaches `setErrorHandler`
- **THEN** the handler SHALL log the error via `app.log.error()` and return `{ status: 500, error: { message: "...", code: "INTERNAL_ERROR" }, data: null }`

### Requirement: Auth middleware SHALL throw AppErrorClass
All authentication/authorization middleware SHALL throw `new AppErrorClass(message, code, statusCode)` instead of calling `reply.code(X).send(...)` directly. The error SHALL propagate to the global error handler.

#### Scenario: Missing or invalid token throws UNAUTHORIZED
- **WHEN** the `Authorization` header is missing, not a Bearer token, or contains an invalid/expired token
- **THEN** the middleware SHALL throw `new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401)`

### Requirement: ErrorCode union SHALL cover all application error codes
The `ErrorCode` type in `src/types/api/response.ts` SHALL include all string error code values used across the application. Using a string literal outside the union SHALL produce a TypeScript compile error.

#### Scenario: Valid error code accepted
- **WHEN** `new AppErrorClass("msg", "EMAIL_ALREADY_EXISTS", 409)` is constructed
- **THEN** the compiler SHALL NOT produce a type error

#### Scenario: Invalid error code rejected
- **WHEN** `new AppErrorClass("msg", "UNKNOWN_CODE", 500)` is constructed
- **THEN** the compiler SHALL produce a type error
