## ADDED Requirements

### Requirement: Named functions SHALL be used for all module-level and method-level function definitions

All functions defined at module scope, as object methods, or as class methods SHALL use named function syntax (`function name() {}` or `async function name() {}`) instead of arrow functions assigned to variables (`const name = () => {}`).

#### Scenario: Module-level function definition
- **WHEN** a developer defines a function at module level (controller, service, repository, utility, middleware, type definition, validation schema)
- **THEN** the function SHALL use named function syntax (`function name() {}` or `export function name() {}`)

#### Scenario: Object method definition
- **WHEN** a developer defines a method as a property of an object (e.g., service factory return object)
- **THEN** the method SHALL use method shorthand syntax (`methodName() {}`) or named function syntax, NOT an arrow function property

#### Scenario: Exported function
- **WHEN** a developer exports a function
- **THEN** the function SHALL use named export syntax (`export function name() {}` or `export async function name() {}`), NOT `export const name = () => {}`

### Requirement: Arrow functions SHALL only be used for inline callbacks

Arrow functions are permitted only in inline callback positions where the function is passed directly as an argument and not assigned to a variable.

#### Scenario: Array method callbacks
- **WHEN** a developer uses `.map()`, `.filter()`, `.forEach()`, `.reduce()`, `.find()`, `.some()`, `.every()`
- **THEN** arrow functions are allowed as the callback argument

#### Scenario: Promise chain callbacks
- **WHEN** a developer chains `.then()`, `.catch()`, `.finally()`
- **THEN** arrow functions are allowed as the callback argument

#### Scenario: Event handler callbacks
- **WHEN** a developer registers an event handler or hook callback inline
- **THEN** arrow functions are allowed as the callback argument

### Requirement: ESLint SHALL enforce the named function convention

The project SHALL include an ESLint configuration that automatically flags violations of the named function convention.

#### Scenario: Lint detects arrow function assigned to variable
- **WHEN** a developer writes `const fn = () => {}` at module level
- **THEN** ESLint SHALL report a violation

#### Scenario: Lint allows arrow function in callback
- **WHEN** a developer writes `items.map(item => item.name)`
- **THEN** ESLint SHALL NOT report a violation

#### Scenario: Lint allows named function
- **WHEN** a developer writes `function fn() {}` or `export async function fn() {}`
- **THEN** ESLint SHALL NOT report a violation

### Requirement: Existing source files SHALL be migrated to comply with the convention

All existing TypeScript source files in `src/` SHALL be updated to use named functions in place of arrow function assignments, except for allowed inline callback positions.

#### Scenario: Controller functions migrated
- **WHEN** a controller file contains arrow function route handlers
- **THEN** they SHALL be converted to named functions

#### Scenario: Service factory methods migrated
- **WHEN** a service factory returns an object with arrow function methods
- **THEN** they SHALL be converted to method shorthand or named function expressions

#### Scenario: Utility functions migrated
- **WHEN** a utility module exports arrow function assignments
- **THEN** they SHALL be converted to named function declarations
