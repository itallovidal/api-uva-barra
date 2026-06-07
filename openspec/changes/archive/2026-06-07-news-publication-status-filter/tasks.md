## 1. Query and Type Contracts

- [ ] 1.1 Add a publication-state query schema for the news collection endpoints in `src/validation/news.ts`
- [ ] 1.2 Extend the listing DTO or repository contract so `/news` and `/news/category/:category` can receive the publication-state filter

## 2. Data Normalization and Listing Logic

- [ ] 2.1 Normalize missing `status` values to `published` when reading news records from persistence
- [ ] 2.2 Update the news repository listing logic so the publication-state filter is applied before pagination
- [ ] 2.3 Add or document a legacy-data backfill path for existing Firestore records without `status`

## 3. Service and Controller Cleanup

- [ ] 3.1 Rename `findLatestNewsHandler` to `listNewsHandler` in `src/controllers/news.controller.ts`
- [ ] 3.2 Update the category listing handler naming if needed so both collection handlers read as list operations
- [ ] 3.3 Thread the new publication-state query through the news service into the repository

## 4. Documentation and HTTP Examples

- [ ] 4.1 Update `http/news.http` with published and unpublished list examples for both `/news` and `/news/category/:category`
- [ ] 4.2 Update `_docs/endpoints/news.md` to document the new query behavior and the missing-status fallback
- [ ] 4.3 Add or adjust tests that cover legacy records without a stored status
