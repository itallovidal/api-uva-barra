## 1. ESLint Setup

- [x] 1.1 Install ESLint 9.x, `@typescript-eslint/parser`, and `@typescript-eslint/eslint-plugin` as dev dependencies
- [x] 1.2 Create `eslint.config.js` with flat config, TypeScript parser, and `src/` as the target directory
- [x] 1.3 Add `lint` and `lint:fix` scripts to `package.json`
- [x] 1.4 Verify ESLint runs successfully on the codebase with no rules enabled yet

## 2. Named Function Lint Rule

- [x] 2.1 Add `no-restricted-syntax` rule with AST selector `VariableDeclarator[init.type="ArrowFunctionExpression"]` to flag arrow function assignments
- [x] 2.2 Configure the rule as `warn` initially (not `error`) to allow gradual migration
- [x] 2.3 Add a custom message explaining the named function convention
- [x] 2.4 Run ESLint and verify it detects arrow function assignments in existing code
- [x] 2.5 Run ESLint and verify it does NOT flag arrow functions in inline callback positions

## 3. Migrate Source Files

- [x] 3.1 Audit all `src/` files and catalog arrow function assignments that need migration
- [x] 3.2 Migrate `src/app.ts` — convert arrow functions to named functions
- [x] 3.3 Migrate `src/server.ts` — convert arrow functions to named functions
- [x] 3.4 Migrate `src/controllers/routes.ts` — convert arrow functions to named functions
- [x] 3.5 Migrate all `src/controllers/*.controller.ts` files — convert route handlers to named functions
- [x] 3.6 Migrate all `src/services/*.service.ts` files — convert factory methods to method shorthand or named functions
- [x] 3.7 Migrate all `src/repository/*.ts` files — convert arrow functions to named functions
- [x] 3.8 Migrate all `src/repository/in-memory/*.ts` files — convert arrow functions to named functions
- [x] 3.9 Migrate all `src/types/*.ts` files — convert arrow functions to named functions
- [x] 3.10 Migrate all `src/validation/*.ts` files — convert arrow functions to named functions
- [x] 3.11 Migrate all `src/shared/**/*.ts` files — convert arrow functions to named functions

## 4. Verification and Escalation

- [x] 4.1 Run `npm run typecheck` and fix any TypeScript errors introduced by the migration
- [x] 4.2 Run `npm run lint` and verify zero warnings remain
- [x] 4.3 Escalate the `no-restricted-syntax` rule from `warn` to `error`
- [x] 4.4 Run `npm run build` and verify the build succeeds
- [x] 4.5 Run `npm run dev` and verify the application starts correctly
