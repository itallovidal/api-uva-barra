## ADDED Requirements

### Requirement: Enforced directory structure
The project SHALL follow the defined directory structure with `src/` as the source root containing `app.ts`, `server.ts`, and subdirectories for controllers, services, repository, types, validation, shared (with `utils/`, `constants/`, `errors/`, `middlewares/`, `types/`), docs, and tests.

#### Scenario: Source files follow layer conventions
- **WHEN** a developer adds new code
- **THEN** HTTP route handlers are placed in `controllers/`, business logic in `services/`, data access interfaces in `repository/`, and repository implementations in `repository/<provider>/`

#### Scenario: Shared modules are organized by concern
- **WHEN** a developer adds shared utilities
- **THEN** they are placed in the appropriate subdirectory under `src/shared/` (`utils/`, `constants/`, `errors/`, `middlewares/`, or `types/`)

### Requirement: CODING-RULES documentation
The project SHALL include a `CODING-RULES.md` file at the project root that documents the directory structure, architectural conventions, dependency injection pattern, repository pattern, and placement rules for each layer.

#### Scenario: CODING-RULES explains structure
- **WHEN** a developer reads `CODING-RULES.md`
- **THEN** they can determine where any new file should be placed based on its responsibility

### Requirement: TypeScript configuration
The project SHALL use TypeScript with strict mode enabled and path aliases mapping `@/` to `src/` for clean imports.

#### Scenario: Path aliases resolve correctly
- **WHEN** code imports from `@/controllers/routes`
- **THEN** the import resolves to `src/controllers/routes.ts`

### Requirement: Environment validation
The project SHALL validate required environment variables at startup using a dedicated module in `src/validation/env.ts`, failing fast if any required variable is missing.

#### Scenario: Missing required env variable causes startup failure
- **WHEN** a required environment variable is not set
- **THEN** the application throws an error and does not start the server

### Requirement: Shared types directory
The project SHALL include `src/shared/types/` for cross-cutting TypeScript types used across multiple layers (response envelopes, error types, pagination metadata).

#### Scenario: Shared types are organized by concern
- **WHEN** a developer adds a type used by multiple layers
- **THEN** the type is placed in `src/shared/types/` and exported via barrel file

### Requirement: Dependency injection via factory functions
All controllers SHALL be implemented as factory functions with signature `(app: FastifyInstance, deps: AppServices) => Promise<void>`. Controllers SHALL NOT import services or repositories directly. All dependency wiring SHALL occur in `app.ts` as the composition root. Services SHALL be created via factory functions that receive repository interfaces and return service objects.

#### Scenario: Controller receives dependencies via parameter
- **WHEN** a controller needs a service
- **THEN** it receives it via the `deps` parameter, not via direct import from `@/services/`

#### Scenario: app.ts is the single source of truth for dependencies
- **WHEN** a developer needs to understand the dependency graph
- **THEN** they can read `app.ts` and see all repositories, services, and their connections

### Requirement: Repository interface pattern
Each repository SHALL have an interface defined in `repository/<name>.ts`. Implementations SHALL live in `repository/<provider>/<name>.ts` (e.g., `in-memory/user.ts`). Services SHALL receive repository interfaces via factory function parameters, never import implementations directly.

#### Scenario: Repository interface defines contract
- **WHEN** a repository is defined
- **THEN** its interface declares data access methods (findById, create, update, delete) and implementations fulfill that contract

#### Scenario: In-memory implementations serve as guides
- **WHEN** a developer creates a new database provider implementation
- **THEN** they implement the same interface and can reference in-memory behavior as a guide

### Requirement: Service factory pattern
Services SHALL be created via factory functions (`createUserService(repo)`) that accept repository interfaces and return service objects. The service object contains all business logic methods for its domain.

#### Scenario: Service wraps repository interface
- **WHEN** a service is created
- **THEN** it receives a repository interface and exposes business logic methods that delegate to the repository

### Requirement: AppServices type
`app.ts` SHALL export an `AppServices` type that defines all available services. `registerRoutes` SHALL accept `AppServices` as its deps parameter.

#### Scenario: Services type is the single source of truth
- **WHEN** a new service is added
- **THEN** it is added to `AppServices` in `app.ts` and becomes available to all controllers via deps
