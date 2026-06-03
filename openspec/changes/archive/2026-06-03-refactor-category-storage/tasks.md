## 1. Data Layer

- [x] 1.1 Add `tags: string[]` to the `Category` entity in `src/types/category/entities.ts`
- [x] 1.2 Add `tags?: string[]` to `CreateCategoryRequestDTO` in `src/types/category/dtos.ts`
- [x] 1.3 Create `UpdateCategoryRequestDTO` with `name` and `tags` fields in `src/types/category/dtos.ts`
- [x] 1.4 Add `findById` and `update` methods to `CategoryRepository` interface in `src/repository/category.ts`
- [x] 1.5 Implement `findById` and `update` in `src/repository/in-memory/category.ts`

## 2. Validation & Service

- [x] 2.1 Update `createCategorySchema` in `src/validation/category.ts` with optional `tags: z.array(z.string())`
- [x] 2.2 Create `updateCategorySchema` with `name` and `tags` fields in `src/validation/category.ts`
- [x] 2.3 Add `findById` and `update` methods to `CategoryService` in `src/services/category.service.ts` with tags deduplication/trimming logic

## 3. Controller

- [x] 3.1 Add `GET /categories/:id` route handler in `src/controllers/category.controller.ts`
- [x] 3.2 Add `PUT /categories/:id` route handler in `src/controllers/category.controller.ts`
- [x] 3.3 Update `POST /categories` handler to accept and pass optional tags
- [x] 3.4 Register new routes in `src/controllers/category.controller.ts`

## 4. Tests & Docs

- [x] 4.1 Update `http/category.http` with GET by ID, PUT, and POST with tags examples
- [x] 4.2 Update `tests/category-smoke.ts` to cover findById and update operations
- [x] 4.3 Run smoke test to verify everything works
