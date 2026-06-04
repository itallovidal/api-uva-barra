# Registration (Solicitação de Acesso)

**Versão:** 1.0
**Data:** 2026-06-04

## Visão Geral

Endpoints para o fluxo de solicitação de acesso de colaboradores. Um colaborador solicita registro, um admin revisa e aprova ou rejeita. Rotas de admin exigem autenticação JWT.

## Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | `/registration/` | Nenhuma | Criar solicitação de registro |
| GET | `/registration/requests` | JWT (Bearer) | Listar solicitações (admin) |
| POST | `/registration/:id/approve` | JWT (Bearer) | Aprovar solicitação (admin) |
| POST | `/registration/:id/reject` | JWT (Bearer) | Rejeitar solicitação (admin) |

## Detalhamento

### `POST /registration/`

Cria uma nova solicitação de registro de colaborador.

**Request body:**

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "profession": "desenvolvedor",
  "bio": "Desenvolvedor full-stack"
}
```

**Campos:**
- `name` (string, obrigatório) — Nome completo
- `email` (string, obrigatório) — Email (deve ser único)
- `password` (string, mínimo 6 caracteres, obrigatório) — Senha
- `profession` (enum: `designer | redator | desenvolvedor | social_media | editor_chefe | outro`, obrigatório) — Profissão
- `bio` (string, opcional, nullable) — Biografia

**Validação:** `src/validation/user.ts` — `createRegistrationSchema`

**Resposta (201 Created):**

```json
{
  "status": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "profession": "desenvolvedor",
    "bio": "Desenvolvedor full-stack",
    "status": "PENDING",
    "reviewedBy": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-06-04T10:00:00.000Z"
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "status": 400,
  "data": null,
  "error": {
    "message": "Dados inválidos, verifique e envie novamente.",
    "code": "INVALID_PAYLOAD"
  }
}
```

**Resposta (409 Conflict — email já existe):**

```json
{
  "status": 409,
  "data": null,
  "error": {
    "message": "Email já cadastrado",
    "code": "EMAIL_ALREADY_EXISTS"
  }
}
```

### `GET /registration/requests`

Lista solicitações de registro. Apenas admins (autenticados).

**Query params:**
- `status` (enum: `PENDING | APPROVED | REJECTED`, opcional) — Filtro por status
- `page` (number, opcional, default `1`) — Página atual
- `perPage` (number, opcional, default `10`, max `100`) — Itens por página

**Validação:** `src/validation/user.ts` — `listRegistrationQuerySchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "profession": "desenvolvedor",
      "bio": "Desenvolvedor full-stack",
      "status": "PENDING",
      "reviewedBy": null,
      "reviewedAt": null,
      "rejectionReason": null,
      "createdAt": "2026-06-04T10:00:00.000Z",
      "updatedAt": "2026-06-04T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### `POST /registration/:id/approve`

Aprova uma solicitação pendente. Cria um novo usuário com `role = collaborator`.

**Parâmetros:**
- `id` (string, uuid) — ID da solicitação

**Validação:** `src/validation/user.ts` — `approveRegistrationParamsSchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "user": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "role": "collaborator",
      "profession": "desenvolvedor",
      "bio": "Desenvolvedor full-stack",
      "status": "active",
      "createdAt": "2026-06-04T10:00:00.000Z",
      "updatedAt": "2026-06-04T10:00:00.000Z"
    },
    "request": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "profession": "desenvolvedor",
      "bio": "Desenvolvedor full-stack",
      "status": "APPROVED",
      "reviewedBy": "admin-uuid",
      "reviewedAt": "2026-06-04T12:00:00.000Z",
      "rejectionReason": null,
      "createdAt": "2026-06-04T10:00:00.000Z",
      "updatedAt": "2026-06-04T12:00:00.000Z"
    }
  }
}
```

**Resposta (404 — solicitação não encontrada):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Solicitação não encontrada",
    "code": "NOT_FOUND"
  }
}
```

**Resposta (409 — email já em uso):**

```json
{
  "status": 409,
  "data": null,
  "error": {
    "message": "Email já cadastrado",
    "code": "EMAIL_ALREADY_EXISTS"
  }
}
```

### `POST /registration/:id/reject`

Rejeita uma solicitação pendente.

**Parâmetros:**
- `id` (string, uuid) — ID da solicitação

**Request body (opcional):**

```json
{
  "reason": "Documentação insuficiente"
}
```

**Campos:**
- `reason` (string, opcional, nullable) — Motivo da rejeição

**Validação:** `src/validation/user.ts` — `approveRegistrationParamsSchema` + `rejectRegistrationBodySchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "profession": "desenvolvedor",
    "bio": "Desenvolvedor full-stack",
    "status": "REJECTED",
    "reviewedBy": "admin-uuid",
    "reviewedAt": "2026-06-04T12:00:00.000Z",
    "rejectionReason": "Documentação insuficiente",
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-06-04T12:00:00.000Z"
  }
}
```

**Resposta (404 — solicitação não encontrada):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Solicitação não encontrada",
    "code": "NOT_FOUND"
  }
}
```

## Estados da Solicitação

| Status | Descrição |
|--------|-----------|
| `PENDING` | Aguardando revisão de um admin |
| `APPROVED` | Aprovada — usuário criado |
| `REJECTED` | Rejeitada — motivo registrado |

## Validações aplicadas

| Schema | Arquivo | Descrição |
|--------|---------|-----------|
| `createRegistrationSchema` | `src/validation/user.ts` | Valida body de criação de solicitação |
| `listRegistrationQuerySchema` | `src/validation/user.ts` | Valida query params de listagem |
| `approveRegistrationParamsSchema` | `src/validation/user.ts` | Valida `id` como UUID |
| `rejectRegistrationBodySchema` | `src/validation/user.ts` | Valida body de rejeição |

## Tipos e DTOs

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| `RegistrationRequest` | `src/types/registration/entities.ts` | Entidade da solicitação |
| `RegistrationRequestStatus` | `src/types/registration/entities.ts` | Enum: `PENDING`, `APPROVED`, `REJECTED` |
| `RegistrationRequestDTO` | `src/types/registration/dtos.ts` | DTO de criação |
| `RegistrationRequestResponse` | `src/types/registration/dtos.ts` | DTO de resposta |
| `RegistrationRequestListQuery` | `src/types/registration/dtos.ts` | DTO de query params |
| `ApproveRegistrationDTO` | `src/types/registration/dtos.ts` | DTO de aprovação |
| `RejectRegistrationDTO` | `src/types/registration/dtos.ts` | DTO de rejeição |

## Arquivos relevantes

- `src/controllers/registration.controller.ts` — handlers de rota
- `src/services/registration.service.ts` — lógica de negócio
- `src/repository/registration.ts` — interface do repositório
- `src/types/registration/entities.ts` — definição de `RegistrationRequest`
- `src/types/registration/dtos.ts` — DTOs do fluxo
- `src/validation/user.ts` — schemas Zod
