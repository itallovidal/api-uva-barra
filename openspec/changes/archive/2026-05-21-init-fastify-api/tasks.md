## 1. Project Initialization

- [x] 1.1 Initialize `package.json` with project metadata and scripts
- [x] 1.2 Install Fastify, TypeScript, and development dependencies
- [x] 1.3 Configure `tsconfig.json` with strict mode and `@/` path alias
- [x] 1.4 Create directory structure under `src/` (controllers, services, repository, types, validation, shared, docs, tests)

## 2. Environment Validation

- [x] 2.1 Create `src/validation/env.ts` with environment variable schema and validation
- [x] 2.2 Define required environment variables (PORT, NODE_ENV) with defaults

## 3. Shared Infrastructure

- [x] 3.1 Create `src/shared/types/` with `ResponsePayload`, `AppError`, `Meta`, and `ErrorCode` types
- [x] 3.2 Create barrel file `src/shared/types/index.ts` exporting all shared types
- [x] 3.3 Create `src/shared/errors/` with custom error classes
- [x] 3.4 Create `src/shared/constants/` with application constants
- [x] 3.5 Create `src/shared/utils/` with utility functions
- [x] 3.6 Create `src/shared/middlewares/` scaffold

## 4. Types and Validation Schemas

- [x] 4.1 Create `src/types/user.ts` with user type definitions
- [x] 4.2 Create `src/types/auth.ts` with auth type definitions
- [x] 4.3 Create `src/validation/user.ts` with user validation schemas
- [x] 4.4 Create `src/validation/auth.ts` with auth validation schemas

## 5. Repository Layer

- [x] 5.1 Create `src/repository/db.ts` with database connection scaffold
- [x] 5.2 Create `src/repository/user.ts` with user repository scaffold

## 6. Service Layer

- [x] 6.1 Create `src/services/user.service.ts` with user service scaffold
- [x] 6.2 Create `src/services/auth.service.ts` with auth service scaffold

## 7. Controller Layer and Routes

- [x] 7.1 Create `src/controllers/healthcheck.controller.ts` returning `ResponsePayload` envelope with status, uptime, and timestamp
- [x] 7.2 Create `src/controllers/auth.controller.ts` scaffold
- [x] 7.3 Create `src/controllers/user.controller.ts` scaffold
- [x] 7.4 Create `src/controllers/routes.ts` with route registration

## 8. Application Entry Points

- [x] 8.1 Create `src/app.ts` with Fastify app factory and route registration
- [x] 8.2 Create `src/server.ts` with environment validation and server startup

## 9. Documentation

- [x] 9.1 Create `CODING-RULES.md` documenting directory structure and architectural conventions
- [x] 9.2 Create `src/docs/` scaffold for API documentation
