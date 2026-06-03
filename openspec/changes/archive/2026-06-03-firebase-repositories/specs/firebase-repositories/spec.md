## ADDED Requirements

### Requirement: Firebase CategoryRepository implementation
The system SHALL provide a `CategoryFirebaseRepositoryFactory(db: Firestore)` that implements `CategoryRepository` backed by Firestore.

#### Scenario: findAll returns all categories
- **WHEN** `findAll()` is called
- **THEN** all category documents from the `categories` collection are returned as `Category[]`

#### Scenario: findById returns category or null
- **WHEN** `findById(id)` is called with an existing document ID
- **THEN** the corresponding `Category` is returned
- **WHEN** `findById(id)` is called with a non-existent ID
- **THEN** `null` is returned

#### Scenario: create persists a new category
- **WHEN** `create(input)` is called with `CreateCategoryRequestDTO`
- **THEN** a new document is added to `categories` collection and the full `Category` with generated `id` is returned

#### Scenario: update modifies an existing category
- **WHEN** `update(id, input)` is called with an existing ID
- **THEN** the document is updated and the new `Category` is returned
- **WHEN** `update(id, input)` is called with a non-existent ID
- **THEN** `null` is returned

#### Scenario: delete removes a category
- **WHEN** `delete(id)` is called with an existing ID
- **THEN** the document is removed and `true` is returned
- **WHEN** `delete(id)` is called with a non-existent ID
- **THEN** `false` is returned

### Requirement: Firebase NewsRepository implementation
The system SHALL provide a `NewsFirebaseRepositoryFactory(db: Firestore)` that implements `NewsRepository` backed by Firestore.

#### Scenario: findById returns news or null
- **WHEN** `findById(id)` is called with an existing document ID
- **THEN** the corresponding `News` is returned with Firestore Timestamps deserialized to `Date`
- **WHEN** `findById(id)` is called with a non-existent ID
- **THEN** `null` is returned

#### Scenario: create persists a new news article
- **WHEN** `create(input)` is called with `CreateNewsDTO`
- **THEN** a new document is added to `news` collection with generated ID and computed fields (`slug`, `readingTime`, timestamps), and the full `News` is returned

#### Scenario: update modifies an existing news article
- **WHEN** `update(id, input)` is called with an existing ID
- **THEN** the document is updated and the new `News` is returned
- **WHEN** `update(id, input)` is called with a non-existent ID
- **THEN** `null` is returned

#### Scenario: delete removes a news article
- **WHEN** `delete(id)` is called with an existing ID
- **THEN** the document is removed and `true` is returned
- **WHEN** `delete(id)` is called with a non-existent ID
- **THEN** `false` is returned

#### Scenario: findLatest returns paginated published news
- **WHEN** `findLatest({ page, perPage })` is called
- **THEN** published news sorted by `publishedAt` descending are returned with pagination and total count
- **WHEN** `findLatest({ page, perPage, category })` is called with a category filter
- **THEN** only published news matching the category are returned

### Requirement: Firebase RegistrationRequestRepository implementation
The system SHALL provide a `RegistrationRequestFirebaseRepositoryFactory(db: Firestore)` that implements `RegistrationRequestRepository` backed by Firestore.

#### Scenario: createRequest persists a new registration request
- **WHEN** `createRequest(data)` is called with a `RegistrationRequest`
- **THEN** a new document is added to `registration-requests` collection and the data is returned

#### Scenario: findById returns request or null
- **WHEN** `findById(id)` is called with an existing document ID
- **THEN** the corresponding `RegistrationRequest` is returned
- **WHEN** `findById(id)` is called with a non-existent ID
- **THEN** `null` is returned

#### Scenario: findByEmail returns request or null
- **WHEN** `findByEmail(email)` is called with an email that has a matching document
- **THEN** the corresponding `RegistrationRequest` is returned
- **WHEN** `findByEmail(email)` is called with an email that has no matching document
- **THEN** `null` is returned

#### Scenario: listRequests returns all or filtered requests
- **WHEN** `listRequests()` is called without a query
- **THEN** all registration requests are returned
- **WHEN** `listRequests({ status })` is called with a status filter
- **THEN** only requests matching the status are returned

#### Scenario: updateRequest updates and returns the request
- **WHEN** `updateRequest(id, patch)` is called with an existing ID
- **THEN** the document is patched with the new values and the updated `RegistrationRequest` is returned
- **WHEN** `updateRequest(id, patch)` is called with a non-existent ID
- **THEN** an `AppErrorClass` with code `NOT_FOUND` is thrown

### Requirement: Composition root wiring
The system SHALL wire Firebase repository implementations in `src/app.ts` for category, news, and registration-request domains.

#### Scenario: Firebase repositories are used at runtime
- **WHEN** the app is created via `createApp()`
- **THEN** `CategoryFirebaseRepositoryFactory`, `NewsFirebaseRepositoryFactory`, and `RegistrationRequestFirebaseRepositoryFactory` are used instead of in-memory factories

### Requirement: Firebase repository factories are exported
The system SHALL export all Firebase repository factories from `src/repository/firebase/index.ts`.

#### Scenario: All factories are re-exported
- **WHEN** `src/repository/firebase/index.ts` is imported
- **THEN** `CategoryFirebaseRepositoryFactory`, `NewsFirebaseRepositoryFactory`, and `RegistrationRequestFirebaseRepositoryFactory` are available alongside `UserFirebaseRepositoryFactory`
