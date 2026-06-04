## ADDED Requirements

### Requirement: Create News Article
The system SHALL allow creating a news article with title, summary, content, cover image URL, category, tags, featured flag, and status. The system MAY optionally accept slug and author; if slug is not provided, it SHALL be auto-generated via slugify(title). The system SHALL auto-generate a unique ID, reading time (based on content word count), and timestamps.

#### Scenario: Successful news article creation
- **WHEN** a POST request is sent to `/news` with valid `CreateNewsDTO` data
- **THEN** the system returns 201 with the created news article including id, slug, readingTime, createdAt, and updatedAt

#### Scenario: Create with invalid data
- **WHEN** a POST request is sent to `/news` with missing required fields
- **THEN** the system returns 400 with a VALIDATION_ERROR

#### Scenario: Create without authentication
- **WHEN** a POST request is sent to `/news` without a valid Bearer token
- **THEN** the system returns 401

### Requirement: Get News Article by ID
The system SHALL return a single news article by its unique identifier, including full content.

#### Scenario: Successful news article retrieval
- **WHEN** a GET request is sent to `/news/:id` with a valid existing ID
- **THEN** the system returns 200 with the full news article data (including content)

#### Scenario: News article not found
- **WHEN** a GET request is sent to `/news/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error

### Requirement: Update News Article
The system SHALL allow updating an existing news article's fields.

#### Scenario: Successful news article update
- **WHEN** a PUT request is sent to `/news/:id` with valid update data and a valid Bearer token
- **THEN** the system returns 200 with the updated news article and a new updatedAt timestamp

#### Scenario: Update non-existent news article
- **WHEN** a PUT request is sent to `/news/:id` with a non-existent ID and a valid Bearer token
- **THEN** the system returns 404 with a NOT_FOUND error

#### Scenario: Update without authentication
- **WHEN** a PUT request is sent to `/news/:id` without a valid Bearer token
- **THEN** the system returns 401

### Requirement: Delete News Article
The system SHALL allow deleting an existing news article by its unique identifier.

#### Scenario: Successful news article deletion
- **WHEN** a DELETE request is sent to `/news/:id` with a valid existing ID and a valid Bearer token
- **THEN** the system returns 204 with no content

#### Scenario: Delete non-existent news article
- **WHEN** a DELETE request is sent to `/news/:id` with a non-existent ID and a valid Bearer token
- **THEN** the system returns 404 with a NOT_FOUND error

#### Scenario: Delete without authentication
- **WHEN** a DELETE request is sent to `/news/:id` without a valid Bearer token
- **THEN** the system returns 401
