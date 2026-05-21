## Context

Repositories currently export functions directly. Services import these functions directly. This couples services to a specific implementation and prevents swapping providers.

## Goals / Non-Goals

**Goals:**
- Define repository interfaces as contracts
- Implement in-memory repositories using arrays/objects as documented, working examples
- Services receive repository interfaces via factory functions
- In-memory impl serves as guide for future postgres implementations

**Non-Goals:**
- No postgres implementation yet
- No database connection changes

## Decisions

**Interface + impl separation:** Interfaces live in `repository/<name>.ts`. Implementations live in `repository/in-memory/<name>.ts`. This keeps contracts clean and makes adding new providers (postgres, redis, etc.) straightforward — just add a new directory.

**In-memory with real logic:** Not scaffolds — real implementations using arrays/Maps with proper CRUD logic. Serves as both working code and documentation for what a database implementation should do.

**Service factory pattern:** `createUserService(repo: UserRepository) → UserService` object. Service owns the repository, not the caller.

```
app.ts
  ├── userRepo = createUserInMemoryRepository()     ← in-memory impl
  ├── userService = createUserService(userRepo)     ← service wraps repo
  └── registerRoutes(app, { userService })          ← only service flows down
```

## Risks / Trade-offs

- **[Risk]** In-memory state lost on restart → **Mitigation:** Intentional — documented as dev/guide implementation
- **[Trade-off]** Two files per repository (interface + impl) → **Mitigation:** Pays off when adding postgres; interface stays the same
