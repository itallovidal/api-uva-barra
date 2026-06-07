## Purpose
This specification covers the capabilities for listing news articles, including standard pagination, category filtering, and publication-state filtering.
## Requirements
### Requirement: List Latest News Articles
The system SHALL return the most recent news articles ordered by `publishedAt` descending, with pagination via `page` and `perPage` query params (defaults: page=1, perPage=10). The query param `status` SHALL accept `published` and `unpublished`. `published` is the default. Records without a stored status SHALL be treated as `published`. Requests with `status=unpublished` SHALL require authentication. The response SHALL include a `meta` object with `page`, `perPage`, `total`, and `totalPages`.

#### Scenario: List latest published news
- **WHEN** a GET request is sent to `/news`
- **THEN** the system returns 200 with an array of `NewsPreviewDTO` objects ordered by publishedAt descending and a `meta` object containing page, perPage, total, totalPages

#### Scenario: List latest unpublished news
- **WHEN** a GET request is sent to `/news?status=unpublished`
- **THEN** the system returns 200 with only news whose normalized status is not `published`

#### Scenario: List latest news when none published
- **WHEN** a GET request is sent to `/news` and no published articles exist
- **THEN** the system returns 200 with an empty array and meta with total=0

#### Scenario: List latest news with custom pagination
- **WHEN** a GET request is sent to `/news?page=2&perPage=5`
- **THEN** the system returns 200 with the second page of 5 results and meta reflecting the requested page and perPage

### Requirement: List Latest News Articles by Category
The system SHALL return the most recent news articles filtered by category, ordered by `publishedAt` descending. The query param `status` SHALL accept `published` and `unpublished`, with the same fallback behavior for records without a stored status. Requests with `status=unpublished` SHALL require authentication.

#### Scenario: List latest news by existing category
- **WHEN** a GET request is sent to `/news/category/:category` with a category that has published articles
- **THEN** the system returns 200 with an array of `NewsPreviewDTO` objects filtered to that category, ordered by publishedAt descending

#### Scenario: List unpublished news by category
- **WHEN** a GET request is sent to `/news/category/:category?status=unpublished`
- **THEN** the system returns 200 with only news in that category whose normalized status is not `published`

#### Scenario: List latest news by category with no results
- **WHEN** a GET request is sent to `/news/category/:category` and no published articles exist for that category
- **THEN** the system returns 200 with an empty array

