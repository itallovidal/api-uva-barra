## 1. Type Definitions

- [x] 1.1 Create `src/types/category.ts` with `Category` and `CreateCategoryRequest` interfaces
- [x] 1.2 Add `UpdateCategoryRequest` interface for partial updates

## 2. Repository Layer

- [x] 2.1 Create `src/repository/category.ts` with `CategoryRepository` interface (findById, findAll, create, update, delete)
- [x] 2.2 Create `src/repository/in-memory/category.ts` with in-memory implementation using `Map<string, Category>`

## 3. Service Layer (Use Cases)

- [x] 3.1 Create `src/services/category.service.ts` with `createCategoryService` factory function
- [x] 3.2 Implement `create` use case: validate input, generate ID/timestamps, persist via repository
- [x] 3.3 Implement `findAll` use case: return all categories from repository
- [x] 3.4 Implement `findById` use case: return category by ID or throw NOT_FOUND
- [x] 3.5 Implement `update` use case: find category, merge updates, persist, return updated
- [x] 3.6 Implement `delete` use case: find and remove category, return success boolean

## 4. Controller Layer

- [x] 4.1 Create `src/controllers/category.controller.ts` with Fastify controller function
- [x] 4.2 Implement POST `/categories` route for category creation (201 response)
- [x] 4.3 Implement GET `/categories` route for listing all categories (200 response)
- [x] 4.4 Implement GET `/categories/:id` route for single category retrieval (200/404)
- [x] 4.5 Implement PUT `/categories/:id` route for category update (200/404)
- [x] 4.6 Implement DELETE `/categories/:id` route for category deletion (204/404)

## 5. Wiring & Registration

- [x] 5.1 Add `categoryService` to `AppServices` type in `src/app.ts`
- [x] 5.2 Instantiate in-memory category repository and service in `app.ts`
- [x] 5.3 Register `categoryController` in `src/controllers/routes.ts`

## 6. Verification

- [x] 6.1 Run `npm run typecheck` to verify no TypeScript errors
- [x] 6.2 Start dev server and manually test all CRUD endpoints
