## 1. Spec and contract update

- [x] 1.1 Update the category spec to describe only create, list, and delete behavior
- [x] 1.2 Remove get-by-id and update requirements from the category contract
- [x] 1.3 Confirm the spec matches the simplified category shape

## 2. Domain and persistence redesign

- [x] 2.1 Redefine the category model around `id` and `name`
- [x] 2.2 Update repository contracts for create, list, and delete only
- [x] 2.3 Adjust validation schemas to require only category name input

## 3. API implementation

- [x] 3.1 Update category controller routes to expose create, list, and delete only
- [x] 3.2 Refactor category service logic for the reduced lifecycle
- [x] 3.3 Implement or adapt the document-oriented repository implementation

## 4. Verification

- [x] 4.1 Add or update tests for create, list, and delete flows
- [x] 4.2 Remove or update tests for deprecated get/update behavior
- [x] 4.3 Run the relevant test suite and confirm the category flow passes
