## 1. Dependencies

- [x] 1.1 Install `firebase-admin` package

## 2. Firebase Init Module

- [x] 2.1 Create `src/lib/firebase.ts` with `initFirebase()` function that initializes Firebase Admin SDK using `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` env vars
- [x] 2.2 Create `src/lib/index.ts` barrel export

## 3. Environment Validation

- [x] 3.1 Add `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` to Zod schema in `src/validation/env.ts`
- [x] 3.2 Create `.env.example` with Firebase variables documented

## 4. Firebase User Repository

- [x] 4.1 Create `src/repository/firebase/user.ts` with `UserFirebaseRepositoryFactory(db: Firestore)` implementing `UserRepository` interface
- [x] 4.2 Create `src/repository/firebase/index.ts` barrel export

## 5. Env Loading Refactor

- [x] 5.1 Refactor `src/validation/env.ts`: replace lazy singleton `getEnv()` with explicit `validateEnv(env: unknown)` — receives `process.env` as parameter, no caching
- [x] 5.2 Update `src/app.ts`: call `validateEnv(process.env)` at start of `createApp()`, decorate `app` with `env`, return `{ app, env }` instead of just `app`
- [x] 5.3 Update `src/server.ts`: add `import "dotenv/config"` at top, destructure `{ app, env }` from `createApp()`

## 6. JWT Secret Injection

- [x] 6.1 Update `src/utils/jwt-handler.ts`: `generateToken` and `decodeToken` now receive `JWT_SECRET` as parameter instead of calling `getEnv()`
- [x] 6.2 Update `src/middlewares/auth-middleware.ts`: read `JWT_SECRET` from `request.server` Fastify `env` decorator, pass to `decodeToken(token, JWT_SECRET)`
- [x] 6.3 Update `src/services/user.service.ts`: accept `jwtSecret` parameter in `UserServiceFactory`, pass to `generateToken`

## 7. Wiring

- [x] 7.1 In `src/app.ts`, import `initFirebase` and `UserFirebaseRepositoryFactory`, initialize Firebase, and replace `UserInMemoryRepositoryFactory()` with `UserFirebaseRepositoryFactory(db)`
- [x] 7.2 Keep the in-memory import as fallback (or remove if unused) — verify `typecheck` passes

## 8. CODING-RULES.md

- [x] 8.1 Update `CODING-RULES.md` to reflect new env loading pattern, directory structure (add `src/lib/`, `src/repository/firebase/`), DI diagram, and auth/validation sections
