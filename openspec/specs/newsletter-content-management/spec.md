## ADDED Requirements

### Requirement: Create newsletter content
The system SHALL provide an authenticated `POST /newsletter/` endpoint that creates a newsletter content document in the Firestore `newsletter` collection.

#### Scenario: Successful creation
- **WHEN** an authenticated client sends a POST request to `/newsletter/` with valid content
- **THEN** the system SHALL store the newsletter with `id`, `createdAt`, and `content` fields and return a success response

#### Scenario: Invalid content
- **WHEN** an authenticated client sends a POST request to `/newsletter/` with missing or invalid content
- **THEN** the system SHALL return a `VALIDATION_ERROR` response with status code 400

#### Scenario: Unauthorized access
- **WHEN** a client sends a POST request to `/newsletter/` without a valid token
- **THEN** the system SHALL return an `UNAUTHORIZED` response with status code 401

### Requirement: Delete newsletter content
The system SHALL provide an authenticated `DELETE /newsletter/:id` endpoint that removes a newsletter content document from the Firestore `newsletter` collection.

#### Scenario: Successful deletion
- **WHEN** an authenticated client sends a DELETE request to `/newsletter/:id` with an existing ID
- **THEN** the system SHALL remove the document and return a success response

#### Scenario: Newsletter not found
- **WHEN** an authenticated client sends a DELETE request to `/newsletter/:id` with a non-existing ID
- **THEN** the system SHALL return a `NOT_FOUND` response with status code 404

#### Scenario: Unauthorized access
- **WHEN** a client sends a DELETE request to `/newsletter/:id` without a valid token
- **THEN** the system SHALL return an `UNAUTHORIZED` response with status code 401

### Requirement: Update newsletter content
The system SHALL provide an authenticated `PUT /newsletter/:id` endpoint that updates an existing newsletter content document in the Firestore `newsletter` collection.

#### Scenario: Successful update
- **WHEN** an authenticated client sends a PUT request to `/newsletter/:id` with valid content and an existing ID
- **THEN** the system SHALL update the document and return a success response

#### Scenario: Newsletter not found
- **WHEN** an authenticated client sends a PUT request to `/newsletter/:id` with a non-existing ID
- **THEN** the system SHALL return a `NOT_FOUND` response with status code 404

#### Scenario: Invalid content
- **WHEN** an authenticated client sends a PUT request to `/newsletter/:id` with missing or invalid content
- **THEN** the system SHALL return a `VALIDATION_ERROR` response with status code 400

#### Scenario: Unauthorized access
- **WHEN** a client sends a PUT request to `/newsletter/:id` without a valid token
- **THEN** the system SHALL return an `UNAUTHORIZED` response with status code 401

### Requirement: Newsletter entity structure
The newsletter entity SHALL contain `id`, `createdAt`, and `content` fields. The `id` field SHALL be the same as the Firestore document ID.

#### Scenario: Stored entity structure
- **WHEN** a newsletter is created
- **THEN** the stored document SHALL contain `id`, `createdAt`, and `content` fields, with `id` matching the document name
