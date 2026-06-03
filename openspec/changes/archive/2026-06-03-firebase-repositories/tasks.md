## 1. Category Firebase Repository

- [x] 1.1 Create `src/repository/firebase/category.ts` with `CategoryFirebaseRepositoryFactory(db)` implementing `CategoryRepository` — `findAll`, `findById`, `create`, `update`, `delete`
- [x] 1.2 Add deserializer for Category documents (no Date fields, simple cast)

## 2. News Firebase Repository

- [x] 2.1 Create `src/repository/firebase/news.ts` with `NewsFirebaseRepositoryFactory(db)` implementing `NewsRepository` — `findById`, `create`, `update`, `delete`
- [x] 2.2 Implement `findLatest` with Firestore pagination, category filter, and count query
- [x] 2.3 Add deserializer to convert Firestore Timestamps (`createdAt`, `updatedAt`, `publishedAt`) to `Date`

## 3. RegistrationRequest Firebase Repository

- [x] 3.1 Create `src/repository/firebase/registration-request.ts` with `RegistrationRequestFirebaseRepositoryFactory(db)` implementing `RegistrationRequestRepository` — `createRequest`, `findById`, `findByEmail`, `listRequests`, `updateRequest`
- [x] 3.2 Add deserializer to convert Firestore Timestamps to `Date`
- [x] 3.3 Implement `updateRequest` to throw `AppErrorClass` with `NOT_FOUND` when document doesn't exist

## 4. Export and Wiring

- [x] 4.1 Export all 3 new factories from `src/repository/firebase/index.ts`
- [x] 4.2 Replace in-memory repository factories in `src/app.ts` with Firebase equivalents (import and wire `db`)
- [x] 4.3 Remove unused in-memory imports from `src/app.ts`

## 5. Verification

- [x] 5.1 Run TypeScript type check (`npm run typecheck` or `tsc --noEmit`)
- [x] 5.2 Run application and verify startup succeeds with Firebase repos wired
