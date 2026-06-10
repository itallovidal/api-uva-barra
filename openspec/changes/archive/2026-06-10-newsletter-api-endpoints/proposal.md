## Why

The application needs a newsletter system to collect subscriber emails and manage newsletter content. This enables marketing communications and content distribution to registered users.

## What Changes

- Create `POST /newsletter/register` endpoint for email subscription with Zod validation
- Create `GET /newsletter/email` endpoint (authenticated) with pagination to list all registered emails
- Create `GET /newsletter/email/:email` endpoint (authenticated) to retrieve a specific email registration
- Create `POST /newsletter/` endpoint (authenticated) to create newsletter content
- Create `DELETE /newsletter/:id` endpoint (authenticated) to delete newsletter content
- Create `PUT /newsletter/:id` endpoint (authenticated) to update newsletter content
- Store newsletter emails in Firestore `newsletter-emails` collection
- Store newsletter content in Firestore `newsletter` collection
- Email entity: `id`, `email`, `createdAt` (id as document name and field)
- Newsletter entity: `id`, `createdAt`, `content`

## Capabilities

### New Capabilities
- `newsletter-email-registration`: Email subscription endpoint with Zod validation and Firestore storage
- `newsletter-admin-listing`: Authenticated endpoints for listing, viewing, and managing newsletter subscribers
- `newsletter-content-management`: CRUD operations for newsletter content in Firestore

### Modified Capabilities
<!-- No existing capabilities are being modified at the spec level -->

## Impact

- New routes in the Fastify application
- New Firestore collections: `newsletter-emails`, `newsletter`
- New repository layer for newsletter functionality
- New service layer for business logic
- Authentication middleware required for admin endpoints
- Zod validation schemas for email and newsletter content
