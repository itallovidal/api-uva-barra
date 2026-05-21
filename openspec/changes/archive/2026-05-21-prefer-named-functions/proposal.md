## Why

The codebase currently uses a mix of arrow functions and named functions without a consistent convention. Arrow functions obscure function names in stack traces, make debugging harder, and reduce code readability. Adopting named functions as the default improves debuggability (clear function names in stack traces), enables function hoisting, and makes the codebase more self-documenting.

## What Changes

- Add an ESLint rule to enforce named functions over arrow functions across the codebase
- Update existing source files to replace arrow functions with named functions where applicable
- Document the named function convention in project coding standards
- Exceptions: inline callbacks in array methods (`.map`, `.filter`, `.forEach`) and short closures may remain as arrow functions for readability

## Capabilities

### New Capabilities
- `named-functions-convention`: Project-wide coding standard enforcing named functions over arrow functions, including lint rule configuration and migration of existing code

### Modified Capabilities
<!-- No existing spec-level behavior changes -->

## Impact

- **Linting**: ESLint configuration will include a new rule enforcing named functions
- **Source files**: Controllers, services, repositories, utilities, and shared modules will be updated to use named functions
- **Build**: No runtime behavior changes — purely a code style enforcement
- **Developer experience**: Improved stack traces, better debugging, more readable code
