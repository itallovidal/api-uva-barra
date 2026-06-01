## 1. Move shared modules

- [x] 1.1 Move `src/shared/middlewares/auth-middleware.ts` to `src/auth-middleware.ts`
- [x] 1.2 Move `src/shared/types/index.ts` and `src/shared/types/response.ts` to `src/types/api/`
- [x] 1.3 Move `src/shared/utils/index.ts` to `src/utils/index.ts`
- [x] 1.4 Move `src/shared/errors/index.ts` to `src/types/api/errors.ts`
- [x] 1.5 Rename the time helper file to `src/utils/time-handler.ts`

## 2. Update imports and exports

- [x] 2.1 Update all imports that reference `@/shared/middlewares/auth-middleware`
- [x] 2.2 Update all imports that reference `@/shared/types`
- [x] 2.3 Update all imports that reference `@/shared/utils`
- [x] 2.4 Update any barrel exports or re-export files that point to the moved modules
- [x] 2.5 Update all imports that reference `@/shared/errors`
- [x] 2.6 Update imports to the renamed time helper path

## 3. Cleanup and verification

- [x] 3.1 Remove or empty the old `src/shared/middlewares/`, `src/shared/types/`, and `src/shared/utils/` directories as appropriate
- [x] 3.2 Run the relevant test suite or typecheck to verify imports and behavior still work
- [x] 3.3 Remove or empty the old `src/shared/errors/` directory as appropriate
