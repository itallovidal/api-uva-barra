## 1. Repository Layer

- [x] 1.1 Create `NewsRepository` interface in `src/repository/news.ts` with methods: `findById`, `create`, `update`, `delete`, `findLatest` (with optional category and limit params)
- [x] 1.2 Create in-memory repository in `src/repository/in-memory/news.ts` with full implementation

## 2. Service Layer

- [x] 2.1 Create `NewsService` factory in `src/services/news.service.ts` with methods: `create`, `findById`, `update`, `delete`, `findLatest`, `findLatestByCategory`
- [x] 2.2 Implement `readingTime` calculation based on content word count (~200 words/min)
- [x] 2.3 Implement `findLatest` to return only published articles as `NewsPreviewDTO[]` with pagination support (page, perPage)
- [x] 2.4 Include `MetaApiPayload` in `findLatest` response for pagination metadata

## 3. Validation Layer

- [x] 3.1 Create Zod validation schemas in `src/validation/news.ts` for create and update news input

## 4. Controller Layer

- [x] 4.1 Create `newsController` in `src/controllers/news.controller.ts` with handlers for create, findById, update, delete (with auth middleware on POST, PUT, DELETE)
- [x] 4.2 Add `GET /news/latest` and `GET /news/latest/:category` handlers to the controller (public, no auth)
- [x] 4.3 Parse `page` and `perPage` query params in latest handlers for pagination

## 5. Wiring

- [x] 5.1 Add `newsService` to `AppServices` type and wire dependencies in `src/app.ts`
- [x] 5.2 Register news routes in `src/controllers/routes.ts`
