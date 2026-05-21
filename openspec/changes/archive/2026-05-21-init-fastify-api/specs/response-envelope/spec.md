## ADDED Requirements

### Requirement: ResponsePayload envelope
All API endpoints SHALL return responses wrapped in a standardized `ResponsePayload` envelope containing `status` (HTTP status code as number), `data` (optional payload on success), `error` (optional `AppError` on failure), and `meta` (optional pagination metadata).

#### Scenario: Successful response includes status and data
- **WHEN** an endpoint returns a successful response
- **THEN** the JSON body contains `status` matching the HTTP status code, `data` with the response payload, and no `error` or `meta` fields (or they are omitted via `omitempty` equivalent)

#### Scenario: Error response includes status and error
- **WHEN** an endpoint returns an error response
- **THEN** the JSON body contains `status` matching the HTTP status code, `error` with an `AppError` object, and no `data` field

#### Scenario: Paginated response includes meta
- **WHEN** an endpoint returns a paginated list
- **THEN** the JSON body includes `meta` with `page`, `per_page`, `total`, and `total_pages`

### Requirement: AppError structure
Errors SHALL be represented as an `AppError` object with `message` (human-readable string) and `code` (machine-readable `ErrorCode` string literal).

#### Scenario: Validation error response
- **WHEN** a request fails validation
- **THEN** the response contains `error.message` describing the validation failure and `error.code` set to `"VALIDATION_ERROR"`

#### Scenario: Not found error response
- **WHEN** a requested resource does not exist
- **THEN** the response contains `error.message` describing the missing resource and `error.code` set to `"NOT_FOUND"`

### Requirement: ErrorCode type
`ErrorCode` SHALL be a string literal union type with the following values: `"VALIDATION_ERROR"`, `"NOT_FOUND"`, `"UNAUTHORIZED"`, `"FORBIDDEN"`, `"INTERNAL_ERROR"`, `"CONFLICT"`. New codes may be added as needed.

#### Scenario: Error code is machine-readable
- **WHEN** an error response is returned
- **THEN** the `error.code` field contains one of the defined `ErrorCode` string literals

### Requirement: Meta pagination structure
Pagination metadata SHALL be represented as a `Meta` object with `page`, `per_page`, `total`, and `total_pages` fields, all integers.

#### Scenario: Paginated list response
- **WHEN** an endpoint returns page 2 of 10 with 20 items per page and 200 total items
- **THEN** `meta` contains `{ "page": 2, "per_page": 20, "total": 200, "total_pages": 10 }`

### Requirement: Shared types location
All shared types (`ResponsePayload`, `AppError`, `Meta`, `ErrorCode`) SHALL be defined in `src/shared/types/` and exported via a barrel file (`src/shared/types/index.ts`).

#### Scenario: Types are importable from shared
- **WHEN** code imports from `@/shared/types`
- **THEN** `ResponsePayload`, `AppError`, `Meta`, and `ErrorCode` are available
