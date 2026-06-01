## Context

The application currently has types defined for news entities and DTOs (`src/types/news/`) but no repository, service, or controller layer. The existing architecture follows a layered pattern (controller → service → repository interface) with manual dependency injection in `app.ts`. This design adds the missing layers for news management.

News articles have a lifecycle (draft → review → published → archived). The "latest" endpoints should only return articles with `status === "published"`.

## Goals / Non-Goals

**Goals:**
- Provide CRUD endpoints for news articles (`POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`)
- Provide listing endpoints for latest published news: `GET /news/latest` and `GET /news/latest/:category`
- Follow existing patterns: factory-based services, in-memory repository, Zod validation, `ResponsePayload` envelope
- Reuse existing `News`, `NewsPreviewDTO`, and `CreateNewsDTO` types

**Non-Goals:**
- Persistence to a real database (in-memory is sufficient for now)
- Slug generation (to be handled in a future change)

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Repository filter for latest | `findLatest(limit?, category?)` method on the interface | Keeps filtering at the data layer; service just delegates |
| Latest returns preview DTOs | Service maps `News` → `NewsPreviewDTO` | Avoids exposing full content in listing; follows the existing DTO pattern |
| No `UpdateNewsDTO` yet | Reuse `CreateNewsDTO` with all fields optional via `Partial` | Simpler for now; can extract a dedicated type later |
| `GET /news/latest/:category` with param | Path param instead of query string | Matches user's explicit requirement; simpler URL design |
| `readingTime` auto-calculated | Compute from `content` length (avg reading speed ~200 words/min) | Service concern, not repository; avoids requiring it in the create payload |
| Latest endpoint pagination | Query params `page` (default 1) and `perPage` (default 10) | Standard pagination pattern; `MetaApiPayload` in response envelope |
| Auth on mutating endpoints | `preHandler: [authMiddleware]` on POST/PUT/DELETE routes | Reuses existing `authMiddleware`; GET routes remain public |

## Risks / Trade-offs

- **In-memory storage is lost on restart** → Acceptable for now; database migration will be a separate change
- **Auth middleware blocks preflight or anonymous GET** → Only applied to POST/PUT/DELETE routes; GET routes (`/:id`, `/latest`, `/latest/:category`) remain unprotected
