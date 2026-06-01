## Why

The shared code is split across `src/shared/` and top-level `src/` folders in a way that makes core application modules harder to find and maintain. This change consolidates those utilities, middlewares, and API response types into the top-level source layout so imports follow the project structure more consistently.

## What Changes

- Move `src/shared/middlewares/auth-middleware.ts` to `src/auth-middleware.ts`.
- Move `src/shared/types/index.ts` and `src/shared/types/response.ts` to `src/types/api/`.
- Move `src/shared/utils/index.ts` to `src/utils/index.ts`.
- Update all imports and re-exports to point at the new locations.
- Remove the now-empty shared subdirectories after references are updated.

## Capabilities

### New Capabilities

- `module-reorganization`: keep existing behavior while standardizing the source layout for shared middlewares, API types, and utilities.

### Modified Capabilities


## Impact

Affected code includes shared middleware, API response type exports, utility helpers, and any consumers importing from the moved paths. No API contract changes are intended.
