## 1. Repository Layer

- [x] 1.1 Add `findBySlug(slug: string): Promise<News | null>` method to `NewsRepository` interface in `src/repository/news.ts`
- [x] 1.2 Implement `findBySlug` in Firebase repository (`src/repository/firebase/news.ts`) using `collection("news").where("slug", "==", slug).limit(1).get()`
- [x] 1.3 Implement `findBySlug` in in-memory repository (`src/repository/in-memory/news.ts`) using `Array.from(store.values()).find(n => n.slug === slug)`

## 2. Validation Layer

- [x] 2.1 Add `newsSlugSchema` to `src/validation/news.ts`: `z.object({ slug: z.string().min(1) })`

## 3. Service Layer

- [x] 3.1 Add `findBySlug(slug: string): Promise<News>` method to `NewsService` in `src/services/news.service.ts`, throwing `AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404)` if not found

## 4. Controller Layer

- [x] 4.1 Add `findNewsBySlugHandler` function in `src/controllers/news.controller.ts` following the same pattern as `findNewsByIdHandler` (parse params, call service, catch AppErrorClass)
- [x] 4.2 Register `GET /news/slug/:slug` route in `src/controllers/news.controller.ts`

## 5. HTTP Test File

- [x] 5.1 Add slug-based test requests to `http/news.http` (successful lookup and 404 cases)
