## MODIFIED Requirements

### Requirement: Create Category
The system SHALL allow creating a new category with only a name. The system SHALL generate a unique ID automatically.

#### Scenario: Successful category creation
- **WHEN** a POST request is sent to `/categories` with a valid name
- **THEN** the system returns 201 with the created category including id and name

#### Scenario: Create category without name
- **WHEN** a POST request is sent to `/categories` without a valid name
- **THEN** the system returns 400 with a validation error

### Requirement: List Categories
The system SHALL return all categories in the system.

#### Scenario: List all categories
- **WHEN** a GET request is sent to `/categories`
- **THEN** the system returns 200 with an array of all categories

#### Scenario: List categories when none exist
- **WHEN** a GET request is sent to `/categories` and no categories exist
- **THEN** the system returns 200 with an empty array

### Requirement: Delete Category
The system SHALL allow deleting an existing category by its unique identifier.

#### Scenario: Successful category deletion
- **WHEN** a DELETE request is sent to `/categories/:id` with a valid existing ID
- **THEN** the system returns 204 with no content

#### Scenario: Delete non-existent category
- **WHEN** a DELETE request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error

## REMOVED Requirements

### Requirement: Get Category by ID
**Reason**: The simplified category domain no longer exposes a read-by-id operation.
**Migration**: Use category listing for discovery or store the created identifier if direct deletion is needed later.

### Requirement: Update Category
**Reason**: Categories now only carry their name and do not support editing beyond recreation.
**Migration**: Delete the category and create a replacement with the desired name.
