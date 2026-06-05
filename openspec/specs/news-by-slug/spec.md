# news-by-slug Specification

## Purpose
TBD - created by archiving change get-news-by-slug. Update Purpose after archive.
## Requirements
### Requirement: Get News Article by Slug
The system SHALL return a single news article by its SEO-friendly slug, including full content.

#### Scenario: Successful news article retrieval by slug
- **WHEN** a GET request is sent to `/news/slug/:slug` with a valid existing slug
- **THEN** the system returns 200 with the full news article data (including content, slug, and all fields)

#### Scenario: News article not found by slug
- **WHEN** a GET request is sent to `/news/slug/:slug` with a non-existent slug
- **THEN** the system returns 404 with a NOT_FOUND error

#### Scenario: Slug with special characters
- **WHEN** a GET request is sent to `/news/slug/:slug` with a slug containing hyphens, numbers, or lowercase letters
- **THEN** the system returns 200 if the slug exists, or 404 if it does not

