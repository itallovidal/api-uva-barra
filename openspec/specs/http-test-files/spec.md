## ADDED Requirements

### Requirement: Healthcheck HTTP File
The system SHALL provide an HTTP file for testing the health check endpoint.

#### Scenario: Health check request
- **WHEN** a GET request is sent to `/health`
- **THEN** the response contains status 200 with server uptime information

### Requirement: Category HTTP File
The system SHALL provide an HTTP file for testing all category CRUD endpoints.

#### Scenario: Category create request
- **WHEN** a POST request is sent to `/categories` with name and optional description
- **THEN** the request body matches the `CreateCategoryRequestDTO` shape

#### Scenario: Category list request
- **WHEN** a GET request is sent to `/categories`
- **THEN** the response is an array of categories

#### Scenario: Category get by ID request
- **WHEN** a GET request is sent to `/categories/:id`
- **THEN** the request uses a placeholder ID

#### Scenario: Category update request
- **WHEN** a PUT request is sent to `/categories/:id` with update fields
- **THEN** the request body matches the `UpdateCategoryRequestDTO` shape

#### Scenario: Category delete request
- **WHEN** a DELETE request is sent to `/categories/:id`
- **THEN** the request uses a placeholder ID

### Requirement: News HTTP File
The system SHALL provide an HTTP file for testing all news endpoints.

#### Scenario: News create request
- **WHEN** a POST request is sent to `/news` with valid `CreateNewsDTO`
- **THEN** the request body includes title, summary, content, coverImageUrl, category, tags, featured, and status

#### Scenario: News get by ID request
- **WHEN** a GET request is sent to `/news/:id`
- **THEN** the request uses a UUID placeholder for the ID

#### Scenario: News update request
- **WHEN** a PUT request is sent to `/news/:id` with partial update fields
- **THEN** the request body matches the update schema

#### Scenario: News delete request
- **WHEN** a DELETE request is sent to `/news/:id`
- **THEN** the request uses a UUID placeholder

#### Scenario: News latest list request
- **WHEN** a GET request is sent to `/news/latest`
- **THEN** the request may include optional page and perPage query params

#### Scenario: News latest by category request
- **WHEN** a GET request is sent to `/news/latest/:category`
- **THEN** the request uses a category name and optional pagination params

### Requirement: Registration HTTP File
The system SHALL provide an HTTP file for testing the registration request flow.

#### Scenario: Registration request
- **WHEN** a POST request is sent to `/registration/`
- **THEN** the request body includes name, email, password, profession, and optional bio

#### Scenario: List registration requests
- **WHEN** a GET request is sent to `/registration/requests`
- **THEN** the request includes optional status, page, and perPage query params and requires auth

#### Scenario: Approve registration
- **WHEN** a POST request is sent to `/registration/:id/approve`
- **THEN** the request uses a UUID placeholder and requires auth

#### Scenario: Reject registration
- **WHEN** a POST request is sent to `/registration/:id/reject`
- **THEN** the request uses a UUID placeholder and may include a reason body

### Requirement: Update User HTTP File
The system SHALL update the existing `user.http` to include all user CRUD endpoints.

#### Scenario: User login request
- **WHEN** a POST request is sent to `/user/login`
- **THEN** the request body includes email and password

#### Scenario: User create request
- **WHEN** a POST request is sent to `/user/`
- **THEN** the request body includes name, email, password, profession, optional bio and role

#### Scenario: User get by ID request
- **WHEN** a GET request is sent to `/user/:id`
- **THEN** the request uses a UUID placeholder and requires auth

#### Scenario: User get by email request
- **WHEN** a GET request is sent to `/user/email/:email`
- **THEN** the request uses an email placeholder and requires auth

#### Scenario: User update request
- **WHEN** a PUT request is sent to `/user/:id`
- **THEN** the request body includes optional update fields and requires auth

#### Scenario: User delete request
- **WHEN** a DELETE request is sent to `/user/:id`
- **THEN** the request uses a UUID placeholder and requires auth
