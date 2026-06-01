## Context

The project currently has a single `http/user.http` file that only covers registration endpoints. With 21 API routes now implemented across healthcheck, category, news, user, and registration controllers, there is no comprehensive set of HTTP request files for testing.

Each `.http` file follows the REST Client format (used by VS Code's REST Client extension), with `###` separating requests and inline JSON bodies.

## Goals / Non-Goals

**Goals:**
- Create one `.http` file per domain: healthcheck, category, news, registration
- Update `http/user.http` to include all user routes (login, CRUD, email lookup)
- Use realistic example data in request bodies
- Document auth requirements clearly (which routes need Bearer token)

**Non-Goals:**
- Automated test scripts or CI integration
- Response validation or assertions
- Authentication token generation (user must obtain token manually)

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| File organization | One `.http` file per domain controller | Matches existing `user.http` pattern; easy to find routes |
| Auth header comments | Comment at top of protected routes listing auth requirement | Avoids requiring a real token for every request; user can add header when testing |
| Placeholder IDs | Use descriptive placeholders like `:id`, `replace-with-uuid` | Makes it obvious which values need to be replaced |

## Risks / Trade-offs

- **Placeholder values can become stale** → Users must update UUIDs manually after creating entities
- **No auth token flow** → User must manually copy token from login response; acceptable for manual testing
