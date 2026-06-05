## Context

The current API exposes `GET /news/latest` to retrieve a paginated list of the most recent news articles, and `GET /news/latest/:category` to retrieve them filtered by category. This deviates from standard REST conventions, where a collection resource like `/news` should inherently return a list of items.

## Goals / Non-Goals

**Goals:**
- Rename `GET /news/latest` to `GET /news`.
- Rename `GET /news/latest/:category` to `GET /news/category/:category` to avoid path variable collisions with the existing `GET /news/:id` endpoint.
- Ensure all associated HTTP tests and OpenAPI documentation (if any) are updated.

**Non-Goals:**
- Modifying the underlying business logic or pagination mechanism of the `news.service.ts`.
- Changing the response payload structure.

## Decisions

1. **Endpoint Paths**: 
   - `GET /news/latest` -> `GET /news`
   - `GET /news/latest/:category` -> `GET /news/category/:category`
   - *Rationale*: Aligns with RESTful design. `GET /news` implies fetching the collection. We use `/news/category/:category` instead of just `/news/:category` to prevent fastify router conflicts with `GET /news/:id`, ensuring the router can distinguish between a category name and a news ID.

2. **Controller Routing Order**:
   - The `/news/category/:category` route must be registered before `/:id` if there's any ambiguity, though the explicit `/category/` segment should prevent routing issues.

## Risks / Trade-offs

- **[Risk] Breaking Changes for Clients** -> **Mitigation**: This is explicitly a breaking change. Clients consuming this API must be updated to use the new URLs before or concurrently with this deployment.
- **[Risk] Routing Collision with `GET /news/:id`** -> **Mitigation**: Using the `/category/:category` prefix completely isolates the category search from the ID lookup.
