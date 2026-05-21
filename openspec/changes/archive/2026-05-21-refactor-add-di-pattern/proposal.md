## Why

The current architecture uses direct imports between layers (controllers import services, services import repositories), making dependencies implicit and scattered across files. This complicates testing and obscures the application's dependency graph. A centralized dependency injection pattern makes all dependencies explicit, testable, and easy to trace.

## What Changes

- Refactor controllers to use factory functions that receive `(app, deps)` instead of importing services directly
- Centralize all dependency wiring in `app.ts` (composition root)
- Update `registerRoutes` to accept and distribute a `deps` object to each controller
- Update CODING-RULES.md documenting the DI pattern
- Update project-structure spec to require factory function DI

## Capabilities

### New Capabilities

- `dependency-injection`: Manual factory-based DI pattern with centralized wiring in `app.ts`, controllers receive `(app, deps)` factory functions

### Modified Capabilities

- `project-structure`: Controllers no longer import services directly; deps are injected via factory function signature

## Impact

- All controller files refactored to accept `deps` parameter
- `app.ts` becomes composition root with explicit dependency graph
- `controllers/routes.ts` signature changes to accept `deps` object
- CODING-RULES.md updated with DI conventions
