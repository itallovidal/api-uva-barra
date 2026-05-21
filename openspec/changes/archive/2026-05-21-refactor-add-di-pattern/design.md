## Context

The project uses a layered architecture (controllers → services → repository). Currently, each layer imports directly from the layer below, making dependencies implicit and hard to mock for testing.

## Goals / Non-Goals

**Goals:**
- Make all dependencies explicit via factory function injection
- Centralize wiring in `app.ts` as composition root
- Keep it simple — no DI container library, no classes
- Controllers receive `(app, deps)` — use only what they need

**Non-Goals:**
- No DI container (Awilix, TSyringe, etc.)
- No class-based controllers or services
- No auto-wiring or reflection

## Decisions

**Manual factory DI over container:** The project is small and benefits from explicit, readable wiring. A container adds indirection and "magic" that isn't needed yet. Can be added later if the dependency graph grows complex.

**Factory function `(app, deps)` over class constructor:** Functions are simpler, more testable, and align with Fastify's plugin pattern. No boilerplate of classes.

**Flat deps object:** All services passed as a single flat object. Controllers pick what they need. No nested deps or scoped containers.

```
app.ts (composition root)
  │
  ├── deps = { userService, categoryService, authService }
  │
  └── registerRoutes(app, deps)
        ├── healthcheckController(app, {})
        ├── categoryController(app, { categoryService })
        └── userController(app, { userService })
```

## Risks / Trade-offs

- **[Risk]** `deps` object grows large → **Mitigation:** Each controller only destructures what it needs; can split into scoped dep objects later
- **[Trade-off]** Manual wiring means updating `app.ts` when adding new services → **Mitigation:** This is actually a feature — `app.ts` is the single source of truth for the dependency graph
