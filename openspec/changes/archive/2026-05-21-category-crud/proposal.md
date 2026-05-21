## Why

The application needs category management functionality to organize and classify content. Currently, there is no way to create, read, update, or delete categories through the API. This change introduces a complete CRUD API for categories using an in-memory repository for rapid development and testing.

## What Changes

- Add category CRUD endpoints (create, list, update, delete)
- Introduce use case layer for category business logic
- Add in-memory repository implementation for categories
- Define repository interface for future persistence layer swaps

## Capabilities

### New Capabilities
- `category-management`: Full CRUD operations for categories including creation, retrieval, update, and deletion

### Modified Capabilities
<!-- None -->

## Impact

- New controller: category controller with CRUD endpoints
- New use cases: create, list, update, delete category
- New repository interface and in-memory implementation
- No breaking changes to existing APIs
