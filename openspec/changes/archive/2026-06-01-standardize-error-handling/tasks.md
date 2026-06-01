## 1. Types — Expand ErrorCode union

- [x] 1.1 Expand `ErrorCode` in `src/types/api/response.ts` to include all codes: `INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `INVALID_PAYLOAD`, `USER_NOT_FOUND`, `USER_CREATION_ERROR`, `RESPONSE_PARSE_ERROR`

## 2. App — Register global error handler

- [x] 2.1 Add `setErrorHandler` in `src/app.ts` after `registerRoutes` — catches `AppErrorClass` (structured response) and unknown errors (log + 500/INTERNAL_ERROR)

## 3. Services — Convert throws to AppErrorClass

- [x] 3.1 `src/services/user.service.ts` — replace all `throw new Error(msg, { cause })` with `throw new AppErrorClass(msg, code, statusCode)`
- [x] 3.2 `src/services/registration.service.ts` — replace all `throw new Error(msg, { cause })` with `throw new AppErrorClass(msg, code, statusCode)`
- [x] 3.3 `src/services/news.service.ts` — replace all `throw { message, code }` with `throw new AppErrorClass(message, code, statusCode)`
- [x] 3.4 `src/services/category.service.ts` — replace all `throw { message, code }` with `throw new AppErrorClass(message, code, statusCode)`

## 4. Controllers — Simplify catch blocks

- [x] 4.1 `src/controllers/user.controller.ts` — replace all 6 catch blocks with `instanceof AppErrorClass` check + rethrow unexpected
- [x] 4.2 `src/controllers/registration.controller.ts` — replace all 4 catch blocks with `instanceof AppErrorClass` check + rethrow unexpected
- [x] 4.3 `src/controllers/news.controller.ts` — replace all 3 catch blocks with `instanceof AppErrorClass` check + rethrow unexpected
- [x] 4.4 `src/controllers/category.controller.ts` — replace catch block with `instanceof AppErrorClass` check + rethrow unexpected

## 5. Middleware — Convert auth to throw pattern

- [x] 5.1 `src/middlewares/auth-middleware.ts` — replace `reply.code(401).send(...)` with `throw new AppErrorClass("Não autorizado.", "UNAUTHORIZED", 401)` in both auth failure paths

## 6. Repository — Convert bare Error throw

- [x] 6.1 `src/repository/in-memory/registration-request.ts` — replace `throw new Error("Registration request not found")` with `throw new AppErrorClass("Registration request not found", "NOT_FOUND", 404)`

## 7. Cleanup — Remove deprecated patterns

- [x] 7.1 `src/types/api/response.ts` — remove or deprecate `API_ERROR_CODES` const object (no longer needed once all sites use string literals)
- [x] 7.2 Remove unused `API_ERROR_CODES` imports from controllers and services
- [x] 7.3 Remove unused `AppError` interface imports (replaced by `AppErrorClass` instanceof check)
