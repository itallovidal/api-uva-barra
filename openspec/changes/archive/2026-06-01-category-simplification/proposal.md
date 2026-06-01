## Why

The current category domain is out of sync with the rest of the codebase and carries more fields and behaviors than it needs. The new document-oriented storage model makes it a good time to simplify categories to a minimal shape and keep only the operations that are actually needed.

## What Changes

- **BREAKING** Simplify category data to a minimal record centered on `name`.
- **BREAKING** Remove category retrieval by ID as a user-facing capability.
- **BREAKING** Remove category update as a user-facing capability.
- Keep category creation, deletion, and listing.
- Align the category implementation with a document-oriented persistence model.

## Capabilities

### New Capabilities

- `category-management`: simplified category lifecycle with create, list, and delete operations.

### Modified Capabilities

- `category-management`: remove description and update/get behavior from the category contract; categories now focus on the minimal data needed for storage and listing.

## Impact

Category controllers, services, repository contracts, validation, and tests will need updates. Any API consumers relying on category get/update or description fields will need to migrate to the simplified model.
