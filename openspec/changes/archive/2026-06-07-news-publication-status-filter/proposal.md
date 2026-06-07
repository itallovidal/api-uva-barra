## Why

News listing currently only exposes the default published collection. There is no explicit way to ask for published versus unpublished items on the list endpoints, and legacy documents that do not store a status value still need to behave as published.

## What Changes

- Add a publication-status filter to `GET /news` and `GET /news/category/:category`
- Default missing `status` values to `published` when reading news from persistence
- Treat legacy records without a stored status as published in list responses
- Rename `findLatestNewsHandler` to a list-oriented name because it is a collection listing handler
- Keep the current route paths, pagination, and response envelope unchanged

## Capabilities

### Modified Capabilities

- `news-listing`: extend collection listings with a publication-status filter and legacy status fallback

### New Capabilities

None.

## Impact

- `src/controllers/news.controller.ts` - rename the collection handler and thread the new query filter through the request path
- `src/services/news.service.ts` - pass the filter to the repository layer
- `src/repository/news.ts` - extend the listing contract with publication-state filtering
- `src/repository/firebase/news.ts` and `src/repository/in-memory/news.ts` - apply the filter and normalize missing status values
- `src/types/news/entities.ts` and read helpers - define the fallback behavior for missing status
- `http/news.http` and `_docs/endpoints/news.md` - document the new query behavior
- Legacy Firestore data may need a backfill so older records without status participate in published listings consistently
