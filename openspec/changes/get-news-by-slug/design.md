## Context

The news module currently supports fetching articles by UUID via `/news/:id`. However, public-facing pages need to reference articles by their human-readable slug (e.g., `novos-horarios-funcionamento`) for SEO-friendly URLs. The `slug` field already exists on the `News` entity and is persisted to Firestore; it is auto-generated from the title on creation. The missing piece is a lookup path: repository → service → controller → route.

## Goals / Non-Goals

**Goals:**
- Add `findBySlug(slug)` to `NewsRepository` interface
- Implement Firestore query: `collection("news").where("slug", "==", slug).limit(1).get()`
- Implement in-memory equivalent (array find)
- Expose `findBySlug(slug)` on `NewsService` with same 404 semantics as `findById`
- Add `GET /news/slug/:slug` endpoint returning full news article (including content)
- Add Zod validation for the slug param

**Non-Goals:**
- No changes to the `News` entity or DTO schemas
- No changes to auth (endpoint is public, same as `/news/:id`)
- No pagination or listing — single article lookup only
- No slug normalization at query time (slug is already normalized at creation)

## Decisions

- **Route path `/news/slug/:slug`**: Placed before `/:id` if both match `:slug` vs `:id` pattern? No conflict — `:slug` is under `/news/slug/:slug` and `:id` is `/news/:id`. Fastify matches `/news/slug/:slug` exactly. No ordering concern.
- **Slug validation**: Use `z.string().min(1)` — no UUID format enforcement since slugs are free-form strings. The `newsSlugSchema` follows the same pattern as the existing `email` param in user controller (a non-UUID path param).
- **Reuse `findById` pattern**: Controller handler follows the exact same structure as `findNewsByIdHandler` (parse params, call service, catch AppErrorClass). Keeps the codebase consistent.
- **No DTO mapping for single article**: `findById` returns the full `News` entity. The slug endpoint should do the same for consistency — the frontend receives all fields. This matches the existing `findById` behavior.

## Risks / Trade-offs

- **Slug collisions**: If two articles somehow end up with the same slug (e.g., manual slug assignment), `findBySlug` returns the first match. Mitigation: the `findBySlug` repository query uses `.limit(1)`. The creation logic already prevents this in practice since slug is auto-generated from title.
- **No slug uniqueness constraint in Firestore**: Firestore doesn't support unique indexes on document fields. This is an existing risk, not introduced by this change. The system relies on creation logic (auto-slugify ensuring uniqueness within a reasonable window).
