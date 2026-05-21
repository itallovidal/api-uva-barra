## ADDED Requirements

### Requirement: Create Category
The system SHALL allow creating a new category with a name and optional description. The system SHALL generate a unique ID and timestamps automatically.

#### Scenario: Successful category creation
- **WHEN** a POST request is sent to `/categories` with a valid name
- **THEN** the system returns 201 with the created category including id, name, description, createdAt, and updatedAt

#### Scenario: Create category without description
- **WHEN** a POST request is sent to `/categories` with only a name
- **THEN** the system returns 201 with the created category and description as null or empty

### Requirement: List Categories
The system SHALL return all categories in the system.

#### Scenario: List all categories
- **WHEN** a GET request is sent to `/categories`
- **THEN** the system returns 200 with an array of all categories

#### Scenario: List categories when none exist
- **WHEN** a GET request is sent to `/categories` and no categories exist
- **THEN** the system returns 200 with an empty array

### Requirement: Get Category by ID
The system SHALL return a single category by its unique identifier.

#### Scenario: Successful category retrieval
- **WHEN** a GET request is sent to `/categories/:id` with a valid existing ID
- **THEN** the system returns 200 with the category data

#### Scenario: Category not found
- **WHEN** a GET request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error

### Requirement: Update Category
The system SHALL allow updating an existing category's name and/or description.

#### Scenario: Successful category update
- **WHEN** a PUT request is sent to `/categories/:id` with valid update data
- **THEN** the system returns 200 with the updated category and a new updatedAt timestamp

#### Scenario: Update non-existent category
- **WHEN** a PUT request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error

### Requirement: Delete Category
The system SHALL allow deleting an existing category by its unique identifier.

#### Scenario: Successful category deletion
- **WHEN** a DELETE request is sent to `/categories/:id` with a valid existing ID
- **THEN** the system returns 204 with no content

#### Scenario: Delete non-existent category
- **WHEN** a DELETE request is sent to `/categories/:id` with a non-existent ID
- **THEN** the system returns 404 with a NOT_FOUND error
