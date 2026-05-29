## Context

The `src/types/` directory currently has four files: `entities.ts`, `dto.ts`, `user.ts`, and `category.ts`. The last two are thin proxy files that re-export types from `entities.ts` and `dto.ts`. This adds unnecessary indirection — consumers must know which file to import from, and the `*Request` naming (without `DTO` suffix) is inconsistent with the existing `NewsRequestDTO` pattern.

The refactoring consolidates all DTO types into `dto.ts`, all entity types into `entities.ts`, and removes the proxy files entirely, updating all imports to reference the canonical source.

## Goals / Non-Goals

**Goals:**
- Remove `src/types/user.ts` — consumers import `User` from `entities.ts` and `UserRequestDTO` from `dto.ts` directly
- Rename `CreateCategoryRequest` → `CreateCategoryRequestDTO` and `UpdateCategoryRequest` → `UpdateCategoryRequestDTO`
- Move category DTO types into `src/types/dto.ts`
- Remove `src/types/category.ts` — consumers import `Category` from `entities.ts` and DTOs from `dto.ts`
- Update all 6 files that import from `@/types/user` or `@/types/category`

**Non-Goals:**
- No changes to entity definitions in `entities.ts`
- No changes to Zod validation schemas in `validation/`
- No runtime behavior changes
- No addition of new types

## Decisions

| Decision | Rationale |
|---|---|
| Move category DTOs into `dto.ts` rather than a dedicated `category-dto.ts` | Keeps all request/response DTOs in one file, consistent with existing pattern. DTOs are thin and cross-referencing is common (e.g., `NewsRequestDTO` references `categoryId`). |
| Keep `entities.ts` separate from `dto.ts` | Clear separation of domain entities (persisted data shape) from request/response contracts. Follows common DDD-adjacent patterns. |
| Direct imports instead of barrel index | Avoids reintroducing the same indirection problem. Consumers import exactly what they need from the canonical file. |
| Rename to `*DTO` suffix | Matches existing `NewsRequestDTO` and `UserRequestDTO`, reinforcing that these are API contracts, not domain types. |

## Risks / Trade-offs

- **Risk: Missed import** → Git will catch this at build time (TypeScript compilation). Verify with `tsc --noEmit` after changes.
- **Risk: Old imports in branches** → Any in-flight branch still referencing `@/types/user` or `@/types/category` will break after merge. Mitigation: include this in release notes if applicable.
