## 1. Refactor Controllers to Factory Pattern

- [x] 1.1 Refactor `healthcheck.controller.ts` to factory signature `(app, _deps)`
- [x] 1.2 Refactor `auth.controller.ts` to factory signature `(app, deps)`
- [x] 1.3 Refactor `user.controller.ts` to factory signature `(app, deps)`

## 2. Update Routes Registration

- [x] 2.1 Update `routes.ts` to accept `(app, deps)` and distribute deps to controllers

## 3. Update App Composition Root

- [x] 3.1 Update `app.ts` to assemble `deps` object and pass to `registerRoutes`

## 4. Update Documentation

- [x] 4.1 Update `CODING-RULES.md` with DI pattern, import rules, and controller signature convention
- [x] 4.2 Update `project-structure` spec to reflect DI conventions
