## Context

The codebase currently splits cross-cutting modules between `src/shared/` and top-level source folders. That creates avoidable indirection for modules that are effectively application-wide primitives: the auth middleware, API response types, and utility helpers.

This change is a source-layout migration only. The runtime behavior of the moved modules must remain stable while import paths are updated throughout the project.

## Goals / Non-Goals

**Goals:**
- Consolidate shared middleware, API types, and utilities into top-level `src/` locations.
- Update every in-repo import to use the new paths.
- Keep module behavior unchanged.

**Non-Goals:**
- No new runtime features.
- No API contract changes.
- No behavior changes to auth, response typing, or utility logic.

## Decisions

- Move files directly instead of keeping compatibility shims.
  - Rationale: the user explicitly asked to remove the modules from `src/shared/`, so keeping re-export stubs would preserve the old structure and add maintenance overhead.
  - Alternative considered: leave re-export files in `src/shared/` temporarily. Rejected because it prolongs duplication and obscures the target layout.

- Group response types under `src/types/api/` rather than `src/shared/types/`.
  - Rationale: these are API-facing contracts, so they belong with the rest of the type organization rather than under shared internals.
  - Alternative considered: move them to `src/shared/types/response.ts` with a flatter shared layout. Rejected because it keeps the shared namespace as the primary home for API contracts.

- Update imports globally before removing empty directories.
  - Rationale: this avoids broken references during the move and keeps the repository consistent in one pass.
  - Alternative considered: stage directory cleanup first. Rejected because it increases the chance of transient import breakage.

## Risks / Trade-offs

- Broken imports during migration -> Update all references in the same change and verify the workspace compiles/tests after the move.
- Incomplete path updates in documentation or tests -> Search the repository for old `@/shared/middlewares`, `@/shared/types`, and `@/shared/utils` imports before finalizing.
- Empty legacy directories left behind -> Remove or preserve only `.gitkeep` files as needed after confirming no references remain.

## Migration Plan

1. Move the middleware file to `src/auth-middleware.ts`.
2. Move the response type files to `src/types/api/`.
3. Move the shared utility index to `src/utils/index.ts`.
4. Update all imports and re-exports across the repo.
5. Remove or tidy the old `src/shared/` subdirectories once references are gone.
6. Run the relevant tests/build checks to confirm the move is behavior-neutral.

Rollback strategy: if any import or test fails, restore the original paths and re-apply the changes in a smaller batch, keeping the file contents identical.

## Open Questions

- None. The requested destination paths and behavior-preservation constraints are clear.
