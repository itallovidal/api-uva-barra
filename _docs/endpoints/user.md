# Usuários (Users)

**Versão:** 1.0
**Data:** 2026-06-04

## Visão Geral

Endpoints para gerenciamento de usuários. Inclui autenticação (login), criação, consulta, atualização e remoção. Rotas de gerenciamento exigem autenticação JWT.

## Endpoints

| Método | Rota                 | Autenticação | Descrição                   |
| ------ | -------------------- | ------------ | --------------------------- |
| POST   | `/user/login`        | Nenhuma      | Autenticar usuário (login)  |
| POST   | `/user/`             | JWT (Bearer) | Criar novo usuário          |
| GET    | `/user/:id`          | JWT (Bearer) | Buscar usuário por ID       |
| GET    | `/user/list`         | JWT (Bearer) | Listar usuários cadastrados |
| GET    | `/user/email/:email` | JWT (Bearer) | Buscar usuário por email    |
| PUT    | `/user/:id`          | JWT (Bearer) | Atualizar usuário           |
| DELETE | `/user/:id`          | JWT (Bearer) | Remover usuário             |

## Detalhamento

### `POST /user/login`

Autentica um usuário e retorna um token JWT.

**Request body:**

```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Campos:**

- `email` (string, obrigatório) — Email do usuário
- `password` (string, obrigatório) — Senha

**Validação:** `src/validation/user.ts` — `loginSchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "avatarUrl": null,
      "role": "collaborator",
      "profession": "desenvolvedor",
      "bio": "Desenvolvedor full-stack",
      "status": "active",
      "createdAt": "2026-06-04T10:00:00.000Z",
      "updatedAt": "2026-06-04T10:00:00.000Z"
    }
  }
}
```

**Resposta (401 Unauthorized — credenciais inválidas):**

```json
{
  "status": 401,
  "data": null,
  "error": {
    "message": "Credenciais inválidas",
    "code": "INVALID_CREDENTIALS"
  }
}
```

### `POST /user/`

Cria um novo usuário. Rota protegida (apenas autenticados).

**Request body:**

```json
{
  "name": "Maria Souza",
  "email": "maria@exemplo.com",
  "password": "senha123",
  "profession": "designer",
  "bio": "Designer de produto",
  "role": "collaborator"
}
```

**Campos:**

- `name` (string, obrigatório) — Nome completo
- `email` (string, obrigatório) — Email (deve ser único)
- `password` (string, mínimo 6 caracteres, obrigatório) — Senha
- `profession` (enum: `designer | redator | desenvolvedor | social_media | editor_chefe | outro`, obrigatório) — Profissão
- `bio` (string, opcional, nullable) — Biografia
- `role` (enum: `collaborator | admin`, opcional, default `collaborator`) — Papel/função

**Validação:** `src/validation/user.ts` — `createUserSchema`

**Resposta (201 Created):**

```json
{
  "status": 201,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Maria Souza",
    "email": "maria@exemplo.com",
    "avatarUrl": null,
    "role": "collaborator",
    "profession": "designer",
    "bio": "Designer de produto",
    "status": "active",
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-06-04T10:00:00.000Z"
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

### `GET /user/:id`

Busca um usuário pelo ID.

**Parâmetros:**

- `id` (string, uuid) — ID do usuário

**Validação:** `src/validation/user.ts` — `userParamsSchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "avatarUrl": null,
    "role": "collaborator",
    "profession": "desenvolvedor",
    "bio": "Desenvolvedor full-stack",
    "status": "active",
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-06-04T10:00:00.000Z"
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Usuário não encontrado",
    "code": "USER_NOT_FOUND"
  }
}
```

### `GET /user/list`

Lista todos os usuários cadastrados. Rota protegida.

**Autenticação:** JWT (Bearer) obrigatória.

**Validação:** `src/middlewares/auth-middleware.ts` — `authMiddleware`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "avatarUrl": null,
      "role": "collaborator",
      "profession": "desenvolvedor",
      "bio": "Desenvolvedor full-stack",
      "status": "active",
      "createdAt": "2026-06-04T10:00:00.000Z",
      "updatedAt": "2026-06-04T10:00:00.000Z"
    }
  ]
}
```

**Observação:** o campo `password` não é retornado nessa rota.

**Resposta (401 Unauthorized):**

```json
{
  "status": 401,
  "data": null,
  "error": {
    "message": "Não autorizado.",
    "code": "UNAUTHORIZED"
  }
}
```

### `GET /user/email/:email`

Busca um usuário pelo email.

**Parâmetros:**

- `email` (string) — Email do usuário

**Observação:** Esta rota **não possui validação Zod** para o parâmetro `email`. O parâmetro é extraído diretamente de `request.params`.

**Resposta (200 OK):** Mesmo formato de `GET /user/:id`.

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Usuário não encontrado",
    "code": "USER_NOT_FOUND"
  }
}
```

### `PUT /user/:id`

Atualiza um usuário existente. Todos os campos do body são opcionais.

**Parâmetros:**

- `id` (string, uuid) — ID do usuário

**Request body (todos opcionais):**

```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@exemplo.com",
  "profession": "redator",
  "bio": "Redator de tecnologia",
  "role": "admin"
}
```

**Campos:**

- `name` (string, opcional) — Nome atualizado
- `email` (string, opcional) — Email atualizado
- `profession` (enum, opcional) — Profissão atualizada
- `bio` (string, opcional, nullable) — Biografia atualizada
- `role` (enum: `collaborator | admin`, opcional) — Papel atualizado

**Validação:** `src/validation/user.ts` — `userParamsSchema` + `updateUserSchema`

**Resposta (200 OK):** Mesmo formato de criação com dados atualizados.

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Usuário não encontrado",
    "code": "USER_NOT_FOUND"
  }
}
```

### `DELETE /user/:id`

Remove um usuário.

**Parâmetros:**

- `id` (string, uuid) — ID do usuário

**Validação:** `src/validation/user.ts` — `userParamsSchema`

**Resposta (204 No Content):** Sem body.

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Usuário não encontrado",
    "code": "USER_NOT_FOUND"
  }
}
```

## Validações aplicadas

| Schema             | Arquivo                  | Descrição                                  |
| ------------------ | ------------------------ | ------------------------------------------ |
| `loginSchema`      | `src/validation/user.ts` | Valida body de login (`email`, `password`) |
| `createUserSchema` | `src/validation/user.ts` | Valida body de criação de usuário          |
| `userParamsSchema` | `src/validation/user.ts` | Valida `id` como UUID                      |
| `updateUserSchema` | `src/validation/user.ts` | Valida body de atualização (parcial)       |

## Regras de Acesso

- A rota `GET /user/list` exige autenticação JWT via `authMiddleware`
- A resposta da listagem expõe todos os campos públicos do usuário, exceto `password`

## Tipos e DTOs

| Tipo             | Arquivo                      | Descrição                                                                             |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| `User`           | `src/types/user/entities.ts` | Entidade completa do usuário                                                          |
| `UserRole`       | `src/types/user/entities.ts` | Enum: `collaborator`, `admin`                                                         |
| `UserProfession` | `src/types/user/entities.ts` | Enum: `designer`, `redator`, `desenvolvedor`, `social_media`, `editor_chefe`, `outro` |
| `UserStatus`     | `src/types/user/entities.ts` | Enum: `active`, `inactive`, `pending`                                                 |
| `CreateUserDTO`  | `src/types/user/dtos.ts`     | DTO de criação                                                                        |
| `UserProfileDTO` | `src/types/user/dtos.ts`     | DTO de perfil público                                                                 |

## Arquivos relevantes

- `src/controllers/user.controller.ts` — handlers de rota
- `src/services/user.service.ts` — lógica de negócio
- `src/repository/user.ts` — interface do repositório
- `src/types/user/entities.ts` — definição de `User` e enums
- `src/types/user/dtos.ts` — DTOs
- `src/validation/user.ts` — schemas Zod
- `src/middlewares/auth-middleware.ts` — middleware de autenticação JWT
