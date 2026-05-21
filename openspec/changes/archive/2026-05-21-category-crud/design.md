## Context

The project is a Fastify-based TypeScript API with a clean architecture pattern: types → repository interface → service (use cases) → controller. The project currently has scaffolding for user management but no implemented features. An in-memory repository pattern is established for rapid development.

## Goals / Non-Goals

**Goals:**
- Implement complete CRUD for categories with in-memory persistence
- Follow existing architecture: types → repository interface → service layer → controller
- Provide a repository interface that can be swapped for a database-backed implementation later
- Register routes in the existing routes.ts file

**Non-Goals:**
- Database persistence (in-memory only for now)
- Authentication/authorization on category endpoints
- Pagination for list endpoint (simple array return)
- Validation middleware (will be added later)

## Decisions

### 1. Category Entity Structure
Categories will have: `id` (UUID string), `name` (string), `description` (string, optional), `createdAt`, `updatedAt`. This mirrors the User entity pattern.

### 2. Service Layer as Use Cases
The service file will export a `createCategoryService` function that returns an object with all CRUD methods. This follows the existing `createUserService` pattern where the service encapsulates use cases and depends on the repository interface.

### 3. In-Memory Repository
The in-memory repository will use a `Map<string, Category>` for O(1) lookups by ID. This is stored in module scope, meaning data is lost on server restart — acceptable for development/testing.

### 4. Controller Pattern
The controller will follow the `healthcheckController` pattern: a function that receives `FastifyInstance` and dependencies, then registers routes directly. Routes will use `/categories` base path.

### 5. Route Registration
The category controller will be imported and registered in `routes.ts`, and the service will be wired in `app.ts` following the existing dependency injection pattern.

## Risks / Trade-offs

- **In-memory data loss**: All category data is lost on server restart → Mitigation: Document this limitation; future database repo swap is supported by the interface
- **No concurrency safety**: Map operations are not thread-safe → Acceptable for single-threaded Node.js
- **No input validation**: Controllers don't validate input yet → Will be addressed with Zod validation middleware later
