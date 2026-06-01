## Why

The application has 21 API routes across 5 controllers but no complete set of HTTP request files for manual testing during development. The existing `http/user.http` only covers registration endpoints. Creating HTTP files for all routes enables quick testing and serves as living documentation of request/response formats.

## What Changes

- Create `http/healthcheck.http` with health check endpoint
- Create `http/category.http` with full category CRUD endpoints
- Create `http/news.http` with news CRUD and latest listing endpoints
- Create `http/registration.http` with registration request flow
- Update `http/user.http` to include user login, CRUD, and email lookup

## Capabilities

### New Capabilities
- `http-test-files`: HTTP request files for all API routes, organized by domain

### Modified Capabilities
_(none)_

## Impact

- New files: `http/healthcheck.http`, `http/category.http`, `http/news.http`, `http/registration.http`
- Modified files: `http/user.http` (updated with complete user routes)
- No changes to source code
