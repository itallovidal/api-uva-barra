## Context

The news module already supports paginated collection listings for `/news` and `/news/category/:category`. Those endpoints currently assume a published-only collection, while the underlying data model also carries a `status` field with several states. Some legacy records may not have a stored `status` at all, and those records should be treated as published.

## Goals / Non-Goals

**Goals:**
- Add a query-based publication filter to the news collection endpoints
- Keep the default behavior equivalent to the current published listing
- Treat missing stored `status` values as `published`
- Rename the collection-list handler to a list-oriented name
- Keep pagination, meta, and response envelopes unchanged

**Non-Goals:**
- No route path changes for `/news` or `/news/category/:category`
- No changes to `/news/:id` or `/news/slug/:slug`
- No new moderation workflow or new status enum values
- No changes to the search endpoint in this change

## Decisions

1. **Query contract**
   - Use a publication-state query parameter on collection listings, with `published` as the default.
   - Support `published` and `unpublished` so callers can explicitly request either bucket.
   - `unpublished` means any record whose normalized status is not `published`.

2. **Missing status fallback**
   - Normalize news records at read time so `status` defaults to `published` when the field is absent.
   - Keep the fallback in the data layer so both single-record reads and list results share the same behavior.
   - If Firestore queries depend on the stored field for filtering, add a legacy-data backfill so older records without status are aligned with the read-time assumption.

3. **Handler naming**
   - Rename `findLatestNewsHandler` to `listNewsHandler` because the endpoint returns a collection, not a single latest item.
   - Apply the same naming style to the category-list handler if the controller is touched in the same slice, so the code stays consistent.

4. **Pagination behavior**
   - Preserve the existing `page`, `perPage`, `total`, and `totalPages` contract.
   - The chosen publication-state filter must be applied before pagination is calculated.

## Risks / Trade-offs

- Firestore filtering with legacy missing fields can be awkward if we depend only on the stored field. A backfill reduces that risk, but the read path should still normalize missing values defensively.
- Adding a publication-state filter changes the shape of the list query contract, so HTTP examples and docs need to move with the code.
- If the controller renaming is done only partially, the codebase will keep a misleading name for one of the list handlers.
