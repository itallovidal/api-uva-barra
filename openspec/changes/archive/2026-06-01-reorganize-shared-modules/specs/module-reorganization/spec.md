## ADDED Requirements

### Requirement: Shared middleware is available from the top-level source layout
The system SHALL keep the authentication middleware module available under `src/auth-middleware.ts` and preserve its runtime behavior.

#### Scenario: Middleware import from new location
- **WHEN** application code imports the authentication middleware from `@/auth-middleware`
- **THEN** the middleware resolves successfully and behaves as the existing implementation

#### Scenario: Middleware behavior unchanged
- **WHEN** a request is processed by the moved middleware
- **THEN** the authorization checks and error responses remain unchanged

### Requirement: API response types are grouped under `src/types/api`
The system SHALL expose the response-related shared types from `src/types/api/index.ts` and `src/types/api/response.ts`.

#### Scenario: Type exports available from the new API types path
- **WHEN** code imports response contracts from `@/types/api`
- **THEN** the exported types `ErrorCode`, `AppError`, `Meta`, and `ResponsePayload` remain available

#### Scenario: Response contracts remain stable
- **WHEN** existing code continues using the response envelope types
- **THEN** the shape and meaning of those types remain unchanged

### Requirement: Shared utilities are available from the top-level utils folder
The system SHALL expose the utility helpers from `src/utils/index.ts` and preserve their behavior.

#### Scenario: Utility helpers import from the new location
- **WHEN** code imports utility helpers from `@/utils`
- **THEN** the helpers `getUptimeInSeconds` and `getISOTimestamp` remain available

#### Scenario: Utility behavior unchanged
- **WHEN** either helper is executed
- **THEN** it returns the same result as before the reorganization
