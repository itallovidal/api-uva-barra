## Why

The current type definitions are split across too many files with redundant re-exports (`user.ts`, `category.ts`), creating maintenance overhead and confusion about where types live. DTO types are mixed with entity types, and the `*Request` naming lacks the `DTO` suffix convention used by `NewsRequestDTO`. This cleanup consolidates all DTOs into a single file and removes unnecessary proxy files.

## What Changes

- **Delete** `src/types/user.ts` — its re-exports are unnecessary; consumers should import directly from `@/types/entities` and `@/types/dto`
- **Rename** `CreateCategoryRequest` → `CreateCategoryRequestDTO` and `UpdateCategoryRequest` → `UpdateCategoryRequestDTO` to match the existing DTO convention
- **Delete** `src/types/category.ts` — move its DTO types into `src/types/dto.ts` and re-export `Category` from `entities.ts` directly
- **Update** all imports in `repository/`, `services/`, and `controllers/` to point to the correct source files

## Capabilities

### New Capabilities

None — this is purely a code organization refactor with no new runtime behavior.

### Modified Capabilities

None — no spec-level requirements change.

## Impact

- **6 files** with import changes: `repository/user.ts`, `repository/category.ts`, `repository/in-memory/category.ts`, `services/category.service.ts`, `controllers/category.controller.ts`, `services/user.service.ts`
- **2 files deleted**: `src/types/user.ts`, `src/types/category.ts`
- **2 files modified**: `src/types/dto.ts` (add category DTOs), `src/types/entities.ts` (export `Category` directly)
