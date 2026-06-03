## Why

Categories currently only store a name, limiting their usefulness for organizing content with subcategories. Adding tags (subcategory labels) and full CRUD endpoints enables richer content organization and more granular filtering, matching the site's need for hierarchical category structures like "Saúde & Bem Estar" containing "Saúde", "Saúde Mental", and "Psicologia".

## What Changes

- Add `tags` field (string array) to the Category entity
- Add `GET /categories/:id` endpoint to fetch a single category
- Add `PUT /categories/:id` endpoint to update a category (name + tags)
- Update `POST /categories` to accept an optional `tags` field
- Update `GET /categories` to return categories with their tags
- Update `DELETE /categories/:id` to cascade error handling
- Update repository interface, in-memory implementation, service, controller, and validation schemas

## Capabilities

### New Capabilities

- `category-tags`: Support for subcategory tags within categories, including create, read, update, and delete operations with tags

### Modified Capabilities

- `category-management`: Category entity now includes `tags` (string[]); endpoints updated to include `GET /:id`, `PUT /:id`, and tags support in create and list responses

## Impact

- **Types**: `Category` entity adds `tags: string[]`; `CreateCategoryRequestDTO` adds optional `tags`; new `UpdateCategoryRequestDTO` required
- **Repository**: `CategoryRepository` interface adds `findById` and `update` methods
- **In-memory repo**: Updated with `findById` and `update` implementations
- **Service**: `CategoryService` adds `findById` and `update` methods
- **Controller**: Added `GET /categories/:id` and `PUT /categories/:id` routes; updated `POST /categories` to accept tags
- **Validation**: Update `createCategorySchema` with optional tags; new `updateCategorySchema` and `tagsSchema`
- **HTTP test file**: Updated with new endpoint examples
- **Smoke test**: Updated to cover new operations
