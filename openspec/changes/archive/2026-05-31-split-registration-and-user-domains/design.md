# Design: Separar domínios de Registro e Usuário

## Visão geral

A separação seguirá a arquitetura atual do projeto: controllers → services → repository interfaces. Os repositórios já estão separados (`UserRepository` e `RegistrationRequestRepository`), então o foco é extrair a lógica de negócio do service monolítico para dois services e criar controllers dedicados.

## Novos arquivos

### 1. `src/services/registration.service.ts`

Factory: `RegistrationServiceFactory(registrationRequestRepo, userRepo)`

Métodos extraídos do `user.service.ts` atual:
- `createRegistrationRequest(input: RegistrationRequestDTO)` — valida email duplicado, hasheia senha, cria request PENDING
- `listRegistrationRequests(query?: RegistrationRequestListQuery)` — lista com paginação
- `approveRegistrationRequest(id: string, adminId: string)` — valida PENDING, verifica email, cria User, marca APPROVED
- `rejectRegistrationRequest(id: string, adminId: string, reason?: string)` — valida PENDING, marca REJECTED

### 2. `src/services/user.service.ts` (reescrito)

Factory: `UserServiceFactory(userRepo)`

Métodos restantes (apenas CRUD de usuário):
- `createUser(input: CreateUserDTO)` — admin cria usuário diretamente (já aprovado, sem solicitação)
- `getUserById(id: string)` — busca por ID
- `getUserByEmail(email: string)` — busca por email
- `updateUser(id: string, input: Partial<User>)` — atualiza dados
- `deleteUser(id: string)` — remove usuário

### 3. `src/controllers/registration.controller.ts`

Controller que recebe `registrationService` como dependência. Handlers:
- `createRegistrationHandler` → `POST /registration/` (público)
- `listRegistrationRequestsHandler` → `GET /registration/requests` (admin)
- `approveRegistrationHandler` → `POST /registration/:id/approve` (admin)
- `rejectRegistrationHandler` → `POST /registration/:id/reject` (admin)

### 4. `src/controllers/user.controller.ts` (reescrito)

Controller que recebe `userService` como dependência. Handlers:
- `createUserHandler` → `POST /user/` (admin) — criar usuário diretamente
- `getUserByIdHandler` → `GET /user/:id` (admin)
- `getUserByEmailHandler` → `GET /user/email/:email` (admin)
- `updateUserHandler` → `PUT /user/:id` (admin)
- `deleteUserHandler` → `DELETE /user/:id` (admin)

## Mudanças em arquivos existentes

### `src/app.ts` (composition root)

Adicionar:
```typescript
const registrationService = RegistrationServiceFactory(registrationRequestRepo, userRepo);
const userService = UserServiceFactory(userRepo);
```

Atualizar `AppServices`:
```typescript
export type AppServices = {
  categoryService: ReturnType<typeof createCategoryService>;
  registrationService: ReturnType<typeof RegistrationServiceFactory>;
  userService: ReturnType<typeof UserServiceFactory>;
};
```

### `src/controllers/routes.ts`

Adicionar:
```typescript
import { registrationController } from "./registration.controller";
import { userController } from "./user.controller";
```

Registrar ambos:
```typescript
await registrationController(app, { registrationService: deps.registrationService });
await userController(app, { userService: deps.userService });
```

### Validação (zod)

Manter em `src/validation/user.ts` ou separar em `src/validation/registration.ts` — a critério da implementação. Schemas existentes (`createRegistrationSchema`, `listRegistrationQuerySchema`, `approveRegistrationParamsSchema`, `rejectRegistrationBodySchema`) já atendem ao domínio de registro. Adicionar `createUserSchema` se necessário para o CRUD de usuário.

### DTOs

Adicionar `CreateUserDTO` em `src/types/dto.ts`:
```typescript
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  profession: UserProfessionType;
  bio?: string | null;
  role?: UserRoleType;
}
```

## Endpoints finais

### Registration (prefixo `/registration/`)

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| POST | `/registration/` | Público | Criar solicitação |
| GET | `/registration/requests` | Admin | Listar solicitações |
| POST | `/registration/:id/approve` | Admin | Aprovar solicitação |
| POST | `/registration/:id/reject` | Admin | Rejeitar solicitação |

### User (prefixo `/user/`)

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| POST | `/user/` | Admin | Criar usuário diretamente |
| GET | `/user/:id` | Admin | Buscar por ID |
| GET | `/user/email/:email` | Admin | Buscar por email |
| PUT | `/user/:id` | Admin | Atualizar usuário |
| DELETE | `/user/:id` | Admin | Deletar usuário |

## Compatibilidade

- `POST /user/registration/` existente **muda** para `POST /registration/` (breaking change — prefixo muda de `/user/registration/` para `/registration/`)
- Os demais endpoints de registro também migram do prefixo `/user/registration/` para `/registration/`
- Estrutura de resposta (`ResponsePayload`) permanece idêntica
- Nenhuma mudança em repositórios, tipos de entidade, ou schemas de validação existentes
