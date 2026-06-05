## Why

Currently, news articles can only be fetched by their UUID (`/news/:id`). For SEO-friendly URLs and public-facing consumption, the frontend needs to fetch news by human-readable slug (e.g., `/noticia/novos-horarios-funcionamento`) instead of a UUID. This enables cleaner, more shareable URLs.

## What Changes

- Add `GET /news/slug/:slug` endpoint that returns a single news article by its `slug` field
- Add `findBySlug(slug)` method to `NewsRepository` interface
- Implement `findBySlug` in Firebase repository (Firestore `where("slug", "==", slug)`)
- Implement `findBySlug` in in-memory repository
- Add `findBySlug(slug)` method to `NewsService`
- Add Zod validation schema for slug param

## Capabilities

### New Capabilities
- `news-by-slug`: Fetch a single news article by its SEO-friendly slug

### Modified Capabilities

None.

## Impact

- `src/repository/news.ts` — add `findBySlug` to interface
- `src/repository/firebase/news.ts` — add Firebase implementation
- `src/repository/in-memory/news.ts` — add in-memory implementation
- `src/services/news.service.ts` — add `findBySlug` method
- `src/controllers/news.controller.ts` — add route handler + route registration
- `src/validation/news.ts` — add slug param Zod schema
