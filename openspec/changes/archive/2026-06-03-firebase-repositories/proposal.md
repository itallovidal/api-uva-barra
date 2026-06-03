## Why

The application currently uses in-memory repositories for category, news, and registration-request data. This means all data is lost on server restart and cannot scale. Firebase Firestore is already configured and used for the user repository — the remaining repositories should follow the same pattern to provide persistent, queryable storage.

## What Changes

- Implement `CategoryFirebaseRepositoryFactory` in `src/repository/firebase/category.ts`
- Implement `NewsFirebaseRepositoryFactory` in `src/repository/firebase/news.ts`
- Implement `RegistrationRequestFirebaseRepositoryFactory` in `src/repository/firebase/registration-request.ts`
- Export all factories from `src/repository/firebase/index.ts`
- Wire Firebase repositories in `src/app.ts` replacing in-memory factories (keep in-memory implementations as fallback)
- Remove in-memory repository factories from app composition root (category, news, registration-request)

## Capabilities

### New Capabilities

- `firebase-repositories`: Firebase Firestore repository implementations for category, news, and registration-request domains, matching the existing `UserFirebaseRepositoryFactory` pattern

### Modified Capabilities

- *(none — no spec-level requirement changes, only implementation changes)*

## Impact

- `src/repository/firebase/` — 3 new files + updated index.ts
- `src/repository/firebase/index.ts` — exports for all 3 new factories
- `src/app.ts` — replace `createCategoryInMemoryRepository`, `createNewsInMemoryRepository`, `RegistrationRequestInMemoryRepositoryFactory` with Firebase equivalents
- No API contract changes (same repository interfaces, same service layer)
