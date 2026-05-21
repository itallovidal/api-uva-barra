## Why

Repositories currently use direct function exports without interfaces, making it impossible to swap implementations (e.g., in-memory → postgres). Interfaces are needed to define contracts, and in-memory implementations serve as documented, working examples for future database-backed implementations.

## What Changes

- Define repository interfaces in `repository/user.ts` and `repository/auth.ts`
- Create in-memory implementations in `repository/in-memory/user.ts` and `repository/in-memory/auth.ts` using arrays/objects
- Refactor services to accept repository interfaces via factory functions and return service objects
- Update `app.ts` to wire: create in-memory repo → create service → register routes

## Capabilities

### New Capabilities

- `repository-pattern`: Repository interfaces with separate in-memory implementations as documented guides for future database providers

### Modified Capabilities

- `dependency-injection`: Services now receive repository interfaces instead of importing repository modules directly

## Impact

- `repository/user.ts` becomes an interface definition
- `repository/user.ts` current implementation moves to `repository/in-memory/user.ts`
- Services refactored to factory functions accepting repository interfaces
- `app.ts` updated to wire in-memory repositories
