## Why

The current endpoint `/news/latest` deviates from standard RESTful API conventions. Standardizing it to `/news` better aligns with REST principles, where a GET request to a resource collection returns a list of items.

## What Changes

- **BREAKING**: Rename the endpoint `GET /news/latest` to `GET /news` for listing latest news articles.
- **BREAKING**: Rename the endpoint `GET /news/latest/:category` to `GET /news/category/:category` for listing news articles by category.
- Update route definitions, controllers, and tests to reflect the new paths.
- Ensure `GET /news/:id` from the CRUD spec does not conflict with the listing endpoints.

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `news-listing`: Update endpoint paths for listing news articles, changing `/news/latest` to `/news` and `/news/latest/:category` to `/news/category/:category`.

## Impact

- **API Consumers**: Any client or frontend application currently calling `/news/latest` will need to be updated to use `/news`.
- **Codebase**: `src/controllers/news.controller.ts` (or similar) and `src/controllers/routes.ts` will need to be updated.
- **Tests**: HTTP test files and any other automated tests targeting `/news/latest` must be updated.
- **Documentation**: API documentation will reflect the new standardized endpoint paths.
