## ADDED Requirements

### Requirement: List Latest News Articles
The system SHALL return the most recently published news articles, ordered by `publishedAt` descending, with pagination via `page` and `perPage` query params (defaults: page=1, perPage=10). Only articles with status `published` SHALL be included. The response SHALL include a `meta` object with `page`, `perPage`, `total`, and `totalPages`.

#### Scenario: List latest published news
- **WHEN** a GET request is sent to `/news/latest`
- **THEN** the system returns 200 with an array of `NewsPreviewDTO` objects ordered by publishedAt descending and a `meta` object containing page, perPage, total, totalPages

#### Scenario: List latest news when none published
- **WHEN** a GET request is sent to `/news/latest` and no published articles exist
- **THEN** the system returns 200 with an empty array and meta with total=0

#### Scenario: List latest news with custom pagination
- **WHEN** a GET request is sent to `/news/latest?page=2&perPage=5`
- **THEN** the system returns 200 with the second page of 5 results and meta reflecting the requested page and perPage

### Requirement: List Latest News Articles by Category
The system SHALL return the most recently published news articles filtered by category, ordered by `publishedAt` descending.

#### Scenario: List latest news by existing category
- **WHEN** a GET request is sent to `/news/latest/:category` with a category that has published articles
- **THEN** the system returns 200 with an array of `NewsPreviewDTO` objects filtered to that category, ordered by publishedAt descending

#### Scenario: List latest news by category with no results
- **WHEN** a GET request is sent to `/news/latest/:category` and no published articles exist for that category
- **THEN** the system returns 200 with an empty array
