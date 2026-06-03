## ADDED Requirements

### Requirement: Tags are deduplicated and trimmed
The system SHALL trim whitespace from tag strings and remove duplicate tags before persisting.

#### Scenario: Tags with whitespace are trimmed
- **WHEN** a tag contains leading or trailing whitespace
- **THEN** the system stores the tag with whitespace removed

#### Scenario: Duplicate tags are removed
- **WHEN** the tags array contains duplicate strings
- **THEN** the system stores only unique tags

### Requirement: Tags are optional on creation
The system SHALL allow creating a category without providing tags.

#### Scenario: Create category without tags
- **WHEN** a POST request is sent to `/categories` with a valid name and no tags field
- **THEN** the system creates the category with an empty tags array

### Requirement: Tags are returned in all category responses
The system SHALL include the tags array in all category responses (create, get, list, update).

#### Scenario: Tags present in get response
- **WHEN** a category with tags is fetched via GET /categories/:id
- **THEN** the response includes the tags array

#### Scenario: Tags present in list response
- **WHEN** categories are fetched via GET /categories
- **THEN** each category in the response includes its tags array
