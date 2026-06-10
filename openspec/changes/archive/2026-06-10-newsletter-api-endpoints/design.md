## Context

The application currently has user authentication, news CRUD, and category management. We need to add newsletter functionality: email subscription collection and newsletter content management. The backend uses Fastify with TypeScript, Zod validation, and Firestore as the database.

## Goals / Non-Goals

**Goals:**
- Provide a public endpoint for email subscription with robust validation
- Provide authenticated admin endpoints for listing, viewing, and managing subscribers
- Provide authenticated admin endpoints for newsletter content CRUD
- Store data in Firestore with proper entity structure

**Non-Goals:**
- Email sending functionality (no SMTP integration)
- Unsubscribe functionality
- Newsletter scheduling or publishing workflow
- Email template management

## Decisions

- **Email validation**: Use Zod's `z.string().email()` with attention to deprecation warnings in newer Zod versions. If `email()` is deprecated, we will use `z.string().min(1).max(255).refine()` with a regex or custom validation. However, as of current Zod stable, `email()` is still functional. We should monitor for deprecation and be ready to migrate to a custom validator if needed.
- **Document ID strategy**: Use `uuid` package (`v4 as uuidv4`) to generate IDs, consistent with user creation pattern. The UUID is used as both the Firestore document ID and the `id` field within the document.
- **Pagination for email listing**: Use cursor-based pagination (limit + startAfter) with page size as query parameter. This is more efficient than offset-based pagination for Firestore.
- **Admin authentication**: Reuse existing auth middleware (`preHandler`) that checks JWT token. The middleware already reads `JWT_SECRET` from `request.server.env`.
- **Route structure**: Keep newsletter routes under `/newsletter` prefix for clarity.
- **Error handling**: Use existing `AppErrorClass` with appropriate `ErrorCode` values. Duplicate email registration should return `CONFLICT`.

## Risks / Trade-offs

- **Risk**: Duplicate email registration without unique constraint on Firestore
  - Mitigation: Check email existence before insert in the service layer, return CONFLICT error if already registered
- **Risk**: No rate limiting on public registration endpoint
  - Mitigation: Can be added later via Fastify rate-limit plugin; out of scope for now
- **Risk**: Large email collection without proper indexing
  - Mitigation: Ensure Firestore indexes are created for pagination queries
- **Trade-off**: Using UUID vs email as document ID
  - Decision: UUID to avoid issues with email normalization (case sensitivity, special chars) and to allow future metadata changes

## Migration Plan

No migration needed. This is a new feature. Firestore collections will be created automatically on first write.

## Open Questions

- Email uniqueness is verified at the application level before registration. Should we use a separate mapping collection for faster duplicate checks in the future?
