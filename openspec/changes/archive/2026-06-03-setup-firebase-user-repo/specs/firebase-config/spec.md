## ADDED Requirements

### Requirement: Environment variable validation (eager)

The system SHALL validate ALL environment variables eagerly at startup using `validateEnv(process.env)` called inside `createApp()` in `src/app.ts`. The validated environment object SHALL be decorated as `app.env` and returned as part of `{ app, env }` from `createApp()`.

#### Scenario: Valid env starts successfully

- **WHEN** all required environment variables (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, etc.) are set
- **THEN** `validateEnv` returns the parsed `Env` object
- **THEN** `createApp()` decorates `app` with `env` and returns `{ app, env }`

#### Scenario: Missing required env fails fast

- **WHEN** a required environment variable is missing
- **THEN** `validateEnv` SHALL throw with a descriptive error message listing all missing/invalid fields
- **THEN** the application SHALL NOT start (fail-fast)

### Requirement: Firebase Admin SDK initialization

The system SHALL initialize Firebase Admin SDK once at application startup using a service account credential loaded from environment variables.

#### Scenario: Firebase initializes successfully with valid credentials

- **WHEN** the application starts with valid `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` environment variables
- **THEN** the Firebase Admin SDK SHALL be initialized and return a `firestore.Firestore` instance ready for use

#### Scenario: Firebase fails to initialize with invalid credentials

- **WHEN** the application starts with missing or invalid Firebase credentials
- **THEN** the application SHALL throw an error during startup and log the failure

### Requirement: Private key newline handling

The system SHALL handle `\n` escape sequences in `FIREBASE_PRIVATE_KEY` by converting them to actual newline characters before passing the key to the Firebase Admin SDK. This is required because `.env` files store `\n` as literal backslash-n strings, but the Firebase SDK expects real newline characters.

#### Scenario: Private key with literal \n is parsed correctly

- **WHEN** `FIREBASE_PRIVATE_KEY` contains literal `\n` escape sequences (e.g., `"-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"`)
- **THEN** the initialization code SHALL replace all occurrences of `\\n` with real newline characters (`\n`, ASCII 0x0A)
- **THEN** Firebase Admin SDK SHALL initialize successfully

#### Scenario: Private key without \n is passed as-is

- **WHEN** `FIREBASE_PRIVATE_KEY` contains real newline characters (multi-line string)
- **THEN** the initialization code SHALL use the value as-is without modification

### Requirement: Firebase user repository implementation

The system SHALL provide a Firebase Firestore implementation of `UserRepository` that persists user data in a `users` collection.

#### Scenario: Create user stores document in Firestore

- **WHEN** `create(user)` is called with a valid `User` object
- **THEN** a document with the user's `id` as the document ID SHALL be created in the `users` Firestore collection
- **THEN** the created `User` SHALL be returned

#### Scenario: Find user by email queries Firestore

- **WHEN** `findByEmail(email)` is called with an email that exists in Firestore
- **THEN** the corresponding `User` SHALL be returned
- **WHEN** `findByEmail(email)` is called with an email that does NOT exist in Firestore
- **THEN** `null` SHALL be returned

#### Scenario: Find user by id queries Firestore

- **WHEN** `findById(id)` is called with an id that exists in Firestore
- **THEN** the corresponding `User` SHALL be returned
- **WHEN** `findById(id)` is called with an id that does NOT exist in Firestore
- **THEN** `null` SHALL be returned

#### Scenario: Update user modifies existing document

- **WHEN** `update(id, input)` is called with a valid id and partial user data
- **THEN** the Firestore document SHALL be updated with the provided fields
- **THEN** the updated `User` SHALL be returned

#### Scenario: Delete user removes document from Firestore

- **WHEN** `delete(id)` is called with an existing user id
- **THEN** the Firestore document SHALL be deleted
- **THEN** `true` SHALL be returned
- **WHEN** `delete(id)` is called with a non-existent id
- **THEN** `false` SHALL be returned
