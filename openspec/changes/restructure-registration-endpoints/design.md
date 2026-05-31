# Design: Restruturar endpoints de registro para prefixo /registration/

## Visão geral

Atualmente o único endpoint de registro é `POST /user/register`, que cria uma solicitação de registro com status PENDING. Precisamos:
1. Renomear esse endpoint para `POST /user/registration/` (mantendo mesma lógica de negócio)
2. Adicionar novos endpoints de administração sob o mesmo prefixo `/user/registration/`

## API Endpoints

### 1. POST /user/registration/
- **Descrição**: Cria uma solicitação de registro (status PENDING)
- **Permissão**: Público
- **Body** (application/json):
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "profession": "designer | redator | desenvolvedor | social_media | editor_chefe | outro",
    "bio": "string | null"
  }
  ```
- **Resposta 201**: `ResponsePayload<User>` (sem password)
- **Erros**: 400 (payload inválido), 409 (email já existe)

### 2. GET /user/registration/requests
- **Descrição**: Lista solicitações de registro com filtro opcional por status
- **Permissão**: Admin
- **Query params**: `status` (PENDING | APPROVED | REJECTED), `page`, `perPage`
- **Resposta 200**: `ResponsePayload<RegistrationRequest[]>` com `MetaApiPayload`
- **Erros**: 401 (não autenticado), 403 (não é admin)

### 3. POST /user/registration/:id/approve
- **Descrição**: Aprova uma solicitação pendente → cria usuário ativo
- **Permissão**: Admin
- **Resposta 200**: `ResponsePayload<User>` (usuário criado)
- **Efeitos**: RegistrationRequest.status → APPROVED, reviewedBy/reviewedAt preenchidos
- **Erros**: 404 (request não encontrada), 409 (email já existe), 422 (status não é PENDING)

### 4. POST /user/registration/:id/reject
- **Descrição**: Rejeita uma solicitação pendente
- **Permissão**: Admin
- **Body** (opcional):
  ```json
  { "reason": "string" }
  ```
- **Resposta 200**: `ResponsePayload<RegistrationRequest>` (request com status REJECTED)
- **Erros**: 404 (request não encontrada), 422 (status não é PENDING)

## Entidades e tipos

### RegistrationRequest (novo)
```typescript
export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profession: UserProfessionType;
  bio: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### DTOs
- Reutilizar `UserRequestDTO` renomeando para `RegistrationRequestDTO` — os campos são idênticos (name, email, password, profession, bio)
- O `UserRequestDTO` existente (`src/types/dto.ts:29`) já possui exatamente a mesma estrutura

```typescript
export interface ApproveRegistrationDTO {
  adminId: string;
}

export interface RejectRegistrationDTO {
  adminId: string;
  reason?: string;
}
```

## Fluxo de aprovação

1. Usuário envia `POST /user/registration/` → criação de RegistrationRequest com status PENDING
2. Admin lista solicitações via `GET /user/registration/requests`
3. Admin aprova via `POST /user/registration/:id/approve`:
   - Serviço valida que request está PENDING
   - Verifica se email já existe como User → 409 se existir
   - Cria User com role=COLLABORATOR, status=ACTIVE e passwordHash copiado
   - Atualiza RegistrationRequest: status=APPROVED, reviewedBy, reviewedAt
4. Ou admin rejeita via `POST /user/registration/:id/reject`:
   - Altera status para REJECTED com reason opcional

## Validação e segurança

- **DTOs explícitos**: interfaces manuais em `src/types/dto.ts` (sem `z.infer`)
- **Schemas zod**: em `src/validation/user.ts` para validação runtime apenas
- **Controller**: cast explícito do `safeParse().data as DTO` — mesmo padrão do endpoint atual
- Reutilizar schema `userRegisterRequest` do zod para `POST /user/registration/`
- Novos schemas: `approveRegistrationParams` e `rejectRegistrationBody` em `src/validation/user.ts`
- Hash de senha mantido em `src/utils/password-handler.ts`
- Endpoints admin devem validar role === ADMIN (via middleware de autorização)
- Envelope de resposta: `ResponsePayload` (mesmo padrão do projeto)

## Mudanças na arquitetura

### Repository
- Interface `UserRepository` ganha métodos específicos para RegistrationRequest:
  - `createRequest(request)`, `findRequestById(id)`, `listRequests(filter)`, `updateRequest(id, patch)`
- Ou criar `RegistrationRequestRepository` separado

### Service
- `UserService` ganha métodos: `createRegistrationRequest`, `approveRegistrationRequest`, `rejectRegistrationRequest`, `listRegistrationRequests`
- Extrair lógica de criação de User do `registerRequest` atual

### Controller
- `userController` ganha handlers: `createRegistrationHandler`, `listRegistrationRequestsHandler`, `approveRegistrationHandler`, `rejectRegistrationHandler`
- Rota antiga `POST /user/register` removida

### Routes
- `routes.ts` permanece igual (userController já é registrado)

## Compatibilidade

- Rota antiga `POST /user/register` deve ser removida (breaking change)
- Estrutura de resposta permanece idêntica (ResponsePayload)
- Repositório in-memory mantido para desenvolvimento
