## 1. Route Definitions Updates

- [x] 1.1 Update `src/controllers/routes.ts` or `src/controllers/news.controller.ts` to change the `GET /news/latest` route to `GET /news`.
- [x] 1.2 Update the `GET /news/latest/:category` route to `GET /news/category/:category`.

## 2. Test and Documentation Updates

- [x] 2.1 Update HTTP test files in the `http/` directory to use the new `GET /news` and `GET /news/category/:category` endpoints instead of `/news/latest`.
- [x] 2.2 Verify that no internal links or documentation strings reference the old `/news/latest` endpoint.
