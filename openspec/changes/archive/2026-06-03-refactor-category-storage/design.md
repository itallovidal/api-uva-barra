## Context

Categories currently store only `id` and `name`, with three endpoints (POST, GET list, DELETE). The business now requires hierarchical categorization via tags (subcategory labels) and full CRUD (including get-by-id and update). The codebase uses Fastify + TypeScript with in-memory repositories, Zod validation, and manual DI wiring.

## Goals / Non-Goals

**Goals:**
- Add `tags: string[]` field to the Category entity
- Add `GET /categories/:id` endpoint
- Add `PUT /categories/:id` endpoint
- Update `POST /categories` to accept optional `tags`
- Update all layers (types, repository, service, controller, validation) consistently
- Update HTTP test file and smoke test

**Non-Goals:**
- No database migration (project uses in-memory storage)
- No auth/authorization on category endpoints (unchanged)
- No cascading deletes to news (category is a free-text string in news)
- No pagination on list endpoint

## Decisions

1. **Tags as `string[]` on the entity vs separate tag table**: Using a simple string array embedded in the Category entity. The tags are simple labels, not entities with their own lifecycle. A separate table would add complexity without proportional benefit.

2. **`UpdateCategoryRequestDTO` with partial vs full update**: Full replacement (PUT semantics). The client sends the complete name and tags array. This is simpler and avoids PATCH complexity.

3. **Optional tags on create, required (may be empty) on update**: On creation, tags default to `[]` if not provided. On update, the full state is always required for clarity and consistency.

4. **Same Zod validation pattern**: Reuses the existing `safeParse` pattern from other controllers, returning 400 with `VALIDATION_ERROR` on failure.

5. **Tags deduplication at service layer**: Tags are trimmed and deduplicated (no duplicates, no empty strings) at the service layer before persisting.

## Risks / Trade-offs

- **[No uniqueness enforcement]** Tags are not unique across categories. Two categories could have overlapping tag names. This is acceptable for the current use case.
- **[Tags not referenced by news]** News still uses a free-text `category` string. A future change could link news to a specific category+tag.
