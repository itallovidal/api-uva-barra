## ADDED Requirements

### Requirement: Repository interface definitions
Each repository SHALL have an interface defined in `repository/<name>.ts` that declares the contract for data access operations (findById, create, update, delete, etc.).

#### Scenario: Repository interface defines CRUD operations
- **WHEN** a repository interface is defined
- **THEN** it declares methods for common operations (findById, create, update, delete) with proper TypeScript types

### Requirement: In-memory repository implementations
Each repository SHALL have an in-memory implementation in `repository/in-memory/<name>.ts` that implements the interface using arrays or Maps. These implementations SHALL be fully functional, not scaffolds.

#### Scenario: In-memory repository stores data in memory
- **WHEN** a record is created via in-memory repository
- **THEN** it is stored in an array/Map and retrievable via findById

#### Scenario: In-memory repository serves as implementation guide
- **WHEN** a developer creates a postgres implementation
- **THEN** they can read the in-memory implementation to understand expected behavior for each method

### Requirement: Service factory pattern with repository injection
Services SHALL be created via factory functions that accept repository interfaces and return service objects. Services SHALL NOT import repository implementations directly.

#### Scenario: Service receives repository interface
- **WHEN** a service is created
- **THEN** it receives a repository interface (not a concrete implementation) and uses it for all data access

### Requirement: App wires in-memory repositories
`app.ts` SHALL instantiate in-memory repositories, pass them to service factories, and pass services to `registerRoutes`.

#### Scenario: Dependency graph flows top-down
- **WHEN** the app starts
- **THEN** `app.ts` creates repos → creates services → passes services to routes
