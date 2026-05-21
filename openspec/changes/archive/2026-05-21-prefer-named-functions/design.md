## Context

The project uses Fastify, TypeScript, Zod, and tsx with a layered architecture (controllers → services → repositories). Currently there is no linting tool configured. Functions are defined inconsistently using both arrow functions and named functions across all layers.

## Goals / Non-Goals

**Goals:**
- Establish a project-wide convention: named functions as the default, arrow functions only for inline callbacks
- Add ESLint with a rule that enforces this convention
- Migrate existing source files to comply with the new rule
- Zero runtime behavior changes

**Non-Goals:**
- No changes to application logic, APIs, or data models
- No performance optimizations
- No changes to test files (tests are out of scope for this convention)

## Decisions

### 1. Add ESLint with flat config (`eslint.config.js`)

**Decision**: Use ESLint 9.x with flat config format and `@typescript-eslint` parser.

**Rationale**: Flat config is the modern ESLint standard. TypeScript support is essential for this codebase. `tsup` is already used for building, and ESLint integrates well with this setup.

**Alternatives considered**:
- Biome: Faster but less mature TypeScript rule ecosystem for function-style enforcement
- No linter: Rely on code review only — not enforceable at scale

### 2. Use `@typescript-eslint/no-expressions-in-function-declaration` or custom rule

**Decision**: Use the `func-style` approach — configure ESLint to prefer `function` declarations/expressions over arrow functions assigned to variables. The specific rule will be `prefer-arrow-functions` inverted via a custom rule or use `no-restricted-syntax` to flag arrow function assignments at module and method level.

**Rationale**: There is no built-in ESLint rule that directly enforces "prefer named functions over arrow functions." The `no-restricted-syntax` rule with an AST selector can match patterns like `VariableDeclarator` where the init is an `ArrowFunctionExpression`. This catches `const fn = () => {}` but allows arrow functions in callback positions.

**AST selector**:
```
VariableDeclarator[init.type="ArrowFunctionExpression"]
```

**Alternatives considered**:
- `prefer-arrow-callback`: Only covers callbacks, not the inverse of what we want
- Custom ESLint plugin: Overkill for a single rule

### 3. Exception for inline callbacks

**Decision**: Arrow functions remain allowed in inline callback positions (`.map()`, `.filter()`, `.forEach()`, `.reduce()`, event handlers, promise chains).

**Rationale**: Arrow functions in callbacks are idiomatic and improve readability. The `no-restricted-syntax` selector naturally excludes these since they are not variable declarators.

### 4. Migration strategy

**Decision**: Add the ESLint rule as a warning first, then manually convert files, then escalate to error.

**Rationale**: Converting all files at once risks introducing bugs. A phased approach allows verification at each step.

## Risks / Trade-offs

- **[Risk]** `no-restricted-syntax` AST selector may have false positives or miss edge cases → **Mitigation**: Test the selector against existing code before enforcing
- **[Risk]** Module-level exports like `export const handler = async () => {}` (common in serverless) need named functions → **Mitigation**: Convert to `export async function handler() {}` — this is actually better for stack traces
- **[Risk]** TypeScript type inference with `const fn = () => {}` vs `function fn()` differs in some edge cases → **Mitigation**: Run typecheck after each migration batch
- **[Trade-off]** Named functions are slightly more verbose for single-expression functions → Accepted for the benefit of debuggability
