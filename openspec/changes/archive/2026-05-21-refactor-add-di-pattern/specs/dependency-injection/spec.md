## ADDED Requirements

### Requirement: Factory function dependency injection
All controllers SHALL be implemented as factory functions with the signature `(app: FastifyInstance, deps: Deps) => Promise<void>`. Controllers SHALL NOT import services or repositories directly — all dependencies are injected via the `deps` object.

#### Scenario: Controller receives deps without direct imports
- **WHEN** a controller is defined
- **THEN** it does not import from `@/services/` or `@/repository/` and receives needed services via the `deps` parameter

#### Scenario: Controller uses only needed deps
- **WHEN** a controller needs `categoryService`
- **THEN** it destructures `deps` or accesses `deps.categoryService` without receiving unused services

### Requirement: Centralized composition root
All dependency wiring SHALL occur in `app.ts`. The `app.ts` file SHALL instantiate repositories, create services, assemble the `deps` object, and pass it to `registerRoutes`.

#### Scenario: Single source of truth for dependencies
- **WHEN** a developer needs to understand the dependency graph
- **THEN** they can read `app.ts` and see all services, repositories, and their connections

### Requirement: Routes registration accepts deps
The `registerRoutes` function in `controllers/routes.ts` SHALL accept `(app: FastifyInstance, deps: Deps)` and distribute the appropriate subset of `deps` to each controller.

#### Scenario: Routes distributes deps to controllers
- **WHEN** `registerRoutes` is called
- **THEN** each controller receives only the deps it needs (e.g., `categoryController` receives `{ categoryService }`)

### Requirement: No DI container library
The project SHALL use manual factory-based dependency injection. No DI container library (Awilix, TSyringe, Inversify, etc.) SHALL be used.

#### Scenario: Dependencies are wired manually
- **WHEN** a new service is added
- **THEN** it is instantiated and added to the `deps` object in `app.ts` explicitly
