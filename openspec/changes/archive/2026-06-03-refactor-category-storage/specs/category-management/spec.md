## MODIFIED Requirements

### Requirement: Create Category
The system SHALL allow creating a new category with a name and optional tags. The system SHALL generate a unique ID automatically. If no tags are provided, the system SHALL default to an empty array.

#### Scenario: Successful category creation with tags
- **WHEN** a POST request is sent to `/categories` with a valid name and tags array
- **THEN** the system returns 201 with the created category including id, name, and tags

#### Scenario: Successful category creation without tags
- **WHEN** a POST request is sent to `/categories` with a valid name and no tags
- **THEN** the system returns 201 with the created category including id, name, and an empty tags array

#### Scenario: Create category without name
- **WHEN** a POST request is sent to `/categories` without a valid name
- **THEN** the system returns 400 with a validation error

### Requirement: List Categories
The system SHALL return all categories in the system with their name and tags.

#### Scenario: List all categories
- **WHEN** a GET request is sent to `/categories`
- **THEN** the system returns 200 with an array of all categories including their tags

#### Scenario: List categories when none exist
- **WHEN** a GET request is sent to `/categories` and no categories exist
- **THEN** the system returns 200 with an empty array

### Requirement: Get Category by ID
The system SHALL return a single category by its unique identifier.

#### Scenario: Successful get by ID
- **WHEN** a GET request is sent to `/categories/:id` with a valid existing ID
- **THEN** the system returns 200 with the category including id, name, and tags

#### Scenario: Get non-existent category
- **WHEN** a GET request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error

#### Scenario: Get category with invalid ID
- **WHEN** a GET request is sent to `/categories/:id` with an invalid UUID format
- **THEN** the system returns 400 with a VALIDATION_ERROR

### Requirement: Update Category
The system SHALL allow updating a category's name and tags by its unique identifier.

#### Scenario: Successful category update
- **WHEN** a PUT request is sent to `/categories/:id` with a valid existing ID, name, and tags array
- **THEN** the system returns 200 with the updated category including id, name, and tags

#### Scenario: Update non-existent category
- **WHEN** a PUT request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error

#### Scenario: Update category without name
- **WHEN** a PUT request is sent to `/categories/:id` with a valid ID but no name
- **THEN** the system returns 400 with a VALIDATION_ERROR

### Requirement: Delete Category
The system SHALL allow deleting an existing category by its unique identifier.

#### Scenario: Successful category deletion
- **WHEN** a DELETE request is sent to `/categories/:id` with a valid existing ID
- **THEN** the system returns 204 with no content

#### Scenario: Delete non-existent category
- **WHEN** a DELETE request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error
