## 1. Domain Types and Validation

- [x] 1.1 Create `src/types/newsletter/entities.ts` with `NewsletterEmail` and `Newsletter` entities
- [x] 1.2 Create `src/types/newsletter/dtos.ts` with DTOs for registration, listing, pagination, and content management
- [x] 1.3 Create `src/validation/newsletter.ts` with Zod schemas for email registration and newsletter content (use non-deprecated email validation)

## 2. Repository Layer

- [x] 2.1 Create `src/repository/newsletter-email.ts` interface for newsletter email repository (create, findAll, findByEmail, exists)
- [x] 2.2 Create `src/repository/newsletter.ts` interface for newsletter repository (create, findById, findAll, update, delete)
- [x] 2.3 Create `src/repository/firebase/newsletter-email.ts` Firebase implementation for newsletter email repository (use `uuid` package `v4` for document IDs)
- [x] 2.4 Create `src/repository/firebase/newsletter.ts` Firebase implementation for newsletter repository (use `uuid` package `v4` for document IDs)
- [x] 2.5 Create `src/repository/in-memory/newsletter-email.ts` in-memory implementation for testing/guide (use `uuid` package `v4` for IDs)
- [x] 2.6 Create `src/repository/in-memory/newsletter.ts` in-memory implementation for testing/guide (use `uuid` package `v4` for IDs)

## 3. Service Layer

- [x] 3.1 Create `src/services/newsletter-email.service.ts` with factory function for email registration, listing, and retrieval (verify email existence before registration, return CONFLICT if duplicate)
- [x] 3.2 Create `src/services/newsletter.service.ts` with factory function for newsletter CRUD operations

## 4. Controller Layer

- [x] 4.1 Create `src/controllers/newsletter.controller.ts` with routes for email registration (`POST /newsletter/register`)
- [x] 4.2 Create `src/controllers/newsletter-admin.controller.ts` with authenticated routes (`GET /newsletter/email`, `GET /newsletter/email/:email`, `POST /newsletter/`, `DELETE /newsletter/:id`, `PUT /newsletter/:id`)
- [x] 4.3 Update `src/controllers/routes.ts` to register newsletter routes

## 5. Application Wiring

- [x] 5.1 Update `src/app.ts` to wire newsletter repositories, services, and controllers
- [x] 5.2 Add newsletter collections to Firebase initialization if needed
- [x] 5.3 Update `src/types/fastify.d.ts` if new decorators are needed

## 6. HTTP Test Files

- [x] 6.1 Create `http/newsletter.http` with manual test requests for all newsletter endpoints
- [x] 6.2 Include auth token examples for authenticated endpoints

## 7. Testing and Verification

- [x] 7.1 Verify `POST /newsletter/register` validates email and stores in Firestore
- [x] 7.2 Verify `GET /newsletter/email` requires auth and returns paginated results
- [x] 7.3 Verify `GET /newsletter/email/:email` returns specific email or 404
- [x] 7.4 Verify `POST /newsletter/` creates newsletter content with auth
- [x] 7.5 Verify `DELETE /newsletter/:id` deletes newsletter with auth
- [x] 7.6 Verify `PUT /newsletter/:id` updates newsletter with auth
