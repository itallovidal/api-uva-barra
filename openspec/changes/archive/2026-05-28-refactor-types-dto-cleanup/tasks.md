## 1. Add category DTOs to dto.ts

- [x] 1.1 Add `CreateCategoryRequestDTO` and `UpdateCategoryRequestDTO` interfaces to `src/types/dto.ts`

## 2. Update imports across the codebase

- [x] 2.1 Update `src/repository/category.ts` — import `Category` from `@/types/entities`, import `CreateCategoryRequestDTO` and `UpdateCategoryRequestDTO` from `@/types/dto`
- [x] 2.2 Update `src/repository/in-memory/category.ts` — same import changes as 2.1
- [x] 2.3 Update `src/services/category.service.ts` — same import changes as 2.1
- [x] 2.4 Update `src/controllers/category.controller.ts` — import `CreateCategoryRequestDTO` and `UpdateCategoryRequestDTO` from `@/types/dto`
- [x] 2.5 Update `src/repository/user.ts` — import `User` from `@/types/entities`, import `UserRequestDTO` from `@/types/dto`

## 3. Delete obsolete proxy files

- [x] 3.1 Delete `src/types/user.ts`
- [x] 3.2 Delete `src/types/category.ts`

## 4. Verify

- [x] 4.1 Run `npx tsc --noEmit` to confirm no type errors
