## Why

The platform needs a news section where administrators can publish, manage, and surface articles to visitors. Currently there are no news endpoints — only type definitions exist. This change adds the full controller layer so news can be created, updated, deleted, and retrieved via the API.

## What Changes

- Create `NewsRepository` interface and an in-memory implementation
- Create `NewsService` with business logic for CRUD + latest-news queries
- Create `NewsController` with Fastify route handlers
- Create Zod validation schemas for news input
- Register news routes in the central router and wire dependencies in `app.ts`

Endpoints added:
- `POST /news` — create a news article
- `GET /news/:id` — get a single article by ID (full content)
- `PUT /news/:id` — update a news article
- `DELETE /news/:id` — delete a news article
- `GET /news/latest` — get latest published articles
- `GET /news/latest/:category` — get latest published articles filtered by category

## Capabilities

### New Capabilities
- `news-crud`: Create, read, update, and delete news articles via the API
- `news-listing`: List latest published news articles, optionally filtered by category

### Modified Capabilities
_(none)_

## Impact

- New files: `src/repository/news.ts`, `src/repository/in-memory/news.ts`, `src/services/news.service.ts`, `src/controllers/news.controller.ts`, `src/validation/news.ts`
- Modified files: `src/controllers/routes.ts`, `src/app.ts`
- Existing `src/types/news/` types are used unchanged
