## 1. Repository Interfaces

- [x] 1.1 Define `UserRepository` interface in `repository/user.ts`
- [x] 1.2 Define `AuthRepository` interface in `repository/auth.ts`

## 2. In-Memory Implementations

- [x] 2.1 Create `repository/in-memory/user.ts` with full in-memory UserRepository implementation
- [x] 2.2 Create `repository/in-memory/auth.ts` with full in-memory AuthRepository implementation

## 3. Refactor Services

- [x] 3.1 Refactor `user.service.ts` to factory `createUserService(repo)` returning service object
- [x] 3.2 Refactor `auth.service.ts` to factory `createAuthService(repo)` returning service object

## 4. Update App Wiring

- [x] 4.1 Update `app.ts` to create in-memory repos, wire to services, pass to registerRoutes
