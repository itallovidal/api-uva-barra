## ADDED Requirements

### Requirement: Email subscription endpoint
The system SHALL provide a public `POST /newsletter/register` endpoint that accepts an email address and stores it in the Firestore `newsletter-emails` collection.

#### Scenario: Successful registration
- **WHEN** a client sends a POST request to `/newsletter/register` with a valid email in the payload
- **THEN** the system SHALL store the email with `id`, `email`, and `createdAt` fields in the `newsletter-emails` collection and return a success response

#### Scenario: Invalid email
- **WHEN** a client sends a POST request to `/newsletter/register` with an invalid email format
- **THEN** the system SHALL return a `VALIDATION_ERROR` response with status code 400

#### Scenario: Duplicate email
- **WHEN** a client sends a POST request to `/newsletter/register` with an email that already exists
- **THEN** the system SHALL return a `CONFLICT` response with status code 409

### Requirement: Email entity structure
The email subscription entity SHALL contain `id`, `email`, and `createdAt` fields. The `id` field SHALL be the same as the Firestore document ID.

#### Scenario: Stored entity structure
- **WHEN** an email is registered
- **THEN** the stored document SHALL contain `id`, `email`, and `createdAt` fields, with `id` matching the document name
