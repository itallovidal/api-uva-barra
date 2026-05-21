## Why

Initialize a new Fastify + TypeScript API project for the "api-site-uva-barra" application. This establishes the foundational project structure, tooling, and a healthcheck route to verify the server is operational before building out additional features.

## What Changes

- Initialize a TypeScript project with Fastify as the HTTP framework
- Establish a layered architecture (controllers → services → repository → database)
- Add a healthcheck endpoint (`GET /health`) for operational monitoring
- Define a standardized response envelope (`ResponsePayload`, `AppError`, `Meta`) for all API endpoints
- Create a CODING-RULES document enforcing the project structure
- Set up environment validation, shared utilities, and documentation scaffolding

## Capabilities

### New Capabilities

- `healthcheck`: A `GET /health` endpoint that returns server status and uptime for operational monitoring
- `project-structure`: Enforced directory layout and coding conventions for the Fastify API
- `response-envelope`: Standardized response envelope (`ResponsePayload`, `AppError`, `Meta`, `ErrorCode`) for all API endpoints, ensuring consistent frontend consumption

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- New project initialization: `package.json`, `tsconfig.json`, Fastify dependencies
- New directory structure under `src/` with controllers, services, repository, types, validation, shared, docs, and tests
- CODING-RULES.md added to project root to enforce architectural conventions
