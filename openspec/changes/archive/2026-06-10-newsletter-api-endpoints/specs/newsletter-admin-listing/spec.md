## ADDED Requirements

### Requirement: List all registered emails
The system SHALL provide an authenticated `GET /newsletter/email` endpoint that returns all registered emails with pagination support.

#### Scenario: Successful listing
- **WHEN** an authenticated client sends a GET request to `/newsletter/email` with a valid token
- **THEN** the system SHALL return a paginated list of all registered emails with `id`, `email`, and `createdAt`

#### Scenario: Unauthorized access
- **WHEN** a client sends a GET request to `/newsletter/email` without a valid token
- **THEN** the system SHALL return an `UNAUTHORIZED` response with status code 401

### Requirement: Retrieve specific email
The system SHALL provide an authenticated `GET /newsletter/email/:email` endpoint that returns a specific email registration.

#### Scenario: Email found
- **WHEN** an authenticated client sends a GET request to `/newsletter/email/:email` with an existing email
- **THEN** the system SHALL return the email entity with `id`, `email`, and `createdAt`

#### Scenario: Email not found
- **WHEN** an authenticated client sends a GET request to `/newsletter/email/:email` with a non-existing email
- **THEN** the system SHALL return a `NOT_FOUND` response with status code 404

#### Scenario: Unauthorized access
- **WHEN** a client sends a GET request to `/newsletter/email/:email` without a valid token
- **THEN** the system SHALL return an `UNAUTHORIZED` response with status code 401
