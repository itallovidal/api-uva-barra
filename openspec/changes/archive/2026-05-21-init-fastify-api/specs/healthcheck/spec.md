## ADDED Requirements

### Requirement: Healthcheck endpoint
The system SHALL expose a `GET /health` endpoint that returns the server's operational status wrapped in the standard `ResponsePayload` envelope, including uptime and a timestamp.

#### Scenario: Successful healthcheck response
- **WHEN** a client sends a GET request to `/health`
- **THEN** the system responds with HTTP 200 and a JSON body following the `ResponsePayload` envelope: `status: 200`, `data` containing `{ status: "ok", uptime, timestamp }` in ISO 8601 format, and no `error` field

#### Scenario: Healthcheck uses correct content type
- **WHEN** a client sends a GET request to `/health`
- **THEN** the response `Content-Type` header SHALL be `application/json`

### Requirement: Fastify server initialization
The system SHALL initialize a Fastify server instance configured with TypeScript, listening on a port defined by environment variables with a sensible default.

#### Scenario: Server starts on configured port
- **WHEN** the server starts
- **THEN** it listens on the port specified by the `PORT` environment variable, defaulting to `3000` if not set

#### Scenario: Server logs startup confirmation
- **WHEN** the server successfully starts
- **THEN** it logs a message confirming the listening address and port
