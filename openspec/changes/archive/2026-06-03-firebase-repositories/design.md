## Context

Currently the app uses in-memory repositories for `category`, `news`, and `registration-request` domains, wired directly in `src/app.ts`. Firebase Firestore is already initialized (`src/lib/firebase.ts`) and a Firestore-based `UserRepository` exists (`src/repository/firebase/user.ts`) serving as the reference pattern. No DI container is used — all wiring is manual factory-based.

## Goals / Non-Goals

**Goals:**
- Implement Firebase Firestore repositories for category, news, and registration-request following the same pattern as `UserFirebaseRepositoryFactory`
- Wire the new implementations in the composition root (`src/app.ts`)
- Ensure all existing repository interface contracts are preserved
- Keep in-memory implementations as a fallback for tests

**Non-Goals:**
- Changing repository interfaces or service layer contracts
- Adding new query capabilities beyond what the interfaces define
- Data migration scripts (Firestore will be the source of truth from deployment)

## Decisions

**1. Pattern: Factory functions receiving `db: Firestore`**
- Follows the exact `UserFirebaseRepositoryFactory(db)` pattern
- Each factory returns the corresponding repository interface
- Deserializer functions handle Firestore `Timestamp` → `Date` conversion
- Collection names use kebab-case plural: `categories`, `news`, `registration-requests`

**2. ID generation delegated to Firestore auto-ID for new documents**
- For `create()` methods, use `db.collection(COLLECTION).add()` or generate UUID client-side matching the in-memory behavior
- Decision: match in-memory pattern (`crypto.randomUUID()`) for consistency since the user repo uses `input.id` from the caller

**3. RegistrationRequest `listRequests` with filtering**
- Use Firestore `.where()` for status filtering when provided
- Return all docs sorted by `createdAt` descending when no filter

**4. News `findLatest` with pagination and category filter**
- Use Firestore `.where("status", "==", "published")` + optional `.where("category", "==", category)`
- Paginate with `.offset()` / `.limit()` and run a separate count query for `total`
- Sort by `publishedAt` descending

## Risks / Trade-offs

- **[Firestore count queries]** Firestore `collection.count().get()` is used for total — available in Firebase 7.0+. Falls back to fetching all IDs if unavailable.
- **[No transactions]** Current in-memory repos don't use transactions. For simplicity, Firebase repos don't either. Can be added later for atomic operations.
- **[Firestore query limitations]** Compound queries need composite indexes. The `findLatest` query (`status` + `category` + `publishedAt`) will require a composite index, which Firestore will prompt to create on first query.
