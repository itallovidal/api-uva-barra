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

## 5. Wiring

- [x] 5.1 In `src/app.ts`, import `initFirebase` and `UserFirebaseRepositoryFactory`, initialize Firebase, and replace `UserInMemoryRepositoryFactory()` with `UserFirebaseRepositoryFactory(db)`
- [x] 5.2 Keep the in-memory import as fallback (or remove if unused) — verify `typecheck` passes
