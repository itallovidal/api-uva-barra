# Tasks: Implementar endpoints de registro sob prefixo /registration/

## 1. Criar entidade RegistrationRequest e DTOs

- Adicionar interface `RegistrationRequest` em `src/types/entities.ts` (com status PENDING | APPROVED | REJECTED, reviewedBy, reviewedAt, rejectionReason, passwordHash)
- Adicionar enums `RegistrationRequestStatus`
- Em `src/types/dto.ts`:
  - Renomear `UserRequestDTO` → `RegistrationRequestDTO` (mesma estrutura, apenas renomear)
  - Adicionar `RegistrationRequestResponse`, `ApproveRegistrationDTO`, `RejectRegistrationDTO`
  - Adicionar `AdminActionDTO

## 2. Expandir repositório para RegistrationRequest

- Adicionar métodos à interface `UserRepository` (ou criar `RegistrationRequestRepository` separada):
  - `createRequest(data)` → RegistrationRequest
  - `findRequestById(id)` → RegistrationRequest | null
  - `findRequestByEmail(email)` → RegistrationRequest | null
  - `listRequests(filter?)` → RegistrationRequest[]
  - `updateRequest(id, patch)` → RegistrationRequest
- Implementar em `src/repository/in-memory/user.ts` (ou novo arquivo `registration-request.ts`)

## 3. Atualizar service layer

- Em `src/services/user.service.ts`:
  - Renomear `registerRequest` para `createRegistrationRequest`
  - Adicionar `listRegistrationRequests(filter?)` (com suporte a paginação)
  - Adicionar `approveRegistrationRequest(id, adminId)`:
    - Validar status PENDING
    - Verificar se email já existe como User
    - Criar User com role=COLLABORATOR, status=ACTIVE
    - Atualizar request: status=APPROVED, reviewedBy, reviewedAt
  - Adicionar `rejectRegistrationRequest(id, adminId, reason?)`:
    - Validar status PENDING
    - Atualizar request: status=REJECTED, rejectionReason, reviewedBy, reviewedAt

## 4. Atualizar controller

- Em `src/controllers/user.controller.ts`:
  - Renomear `registerRequestHandler` → `createRegistrationHandler`
  - Adicionar `listRegistrationRequestsHandler`
  - Adicionar `approveRegistrationHandler`
  - Adicionar `rejectRegistrationHandler`
- Registrar rotas:
  - `POST /user/registration/` (público)
  - `GET /user/registration/requests` (admin)
  - `POST /user/registration/:id/approve` (admin)
  - `POST /user/registration/:id/reject` (admin)
- Remover `app.post("/user/register", registerRequestHandler)`

## 5. Schema de validação (zod — apenas runtime, sem z.infer)

- Em `src/validation/user.ts`:
  - Renomear `userRegisterRequest` → `createRegistrationSchema` (ou manter compatibilidade)
  - Adicionar `listRegistrationQuerySchema` (status opcional, page, perPage)
  - Adicionar `approveRegistrationParamsSchema` (id UUID)
  - Adicionar `rejectRegistrationBodySchema` (reason opcional)
- **Não usar `z.infer`** — tipos explícitos ficam em `dto.ts`
- Controller faz cast: `data as RegistrationRequestDTO`

## 6. Middleware de autorização

- Implementar middleware para validar role ADMIN em `src/shared/middlewares/index.ts`
- Aplicar nas rotas de admin (requests, approve, reject)

## 7. Atualizar composição root

- Em `src/app.ts`: nenhuma mudança necessária se mantiver UserServiceFactory

## 8. Documentação e exemplos

- Atualizar `http/user.http`:
  - Renomear `POST /user/register` → `POST /user/registration/`
  - Adicionar exemplos para requests, approve, reject
- Atualizar `docs/README.md` com novos endpoints

## 9. Testes

- Unit tests para service: criação, aprovação, rejeição, edge cases
- Integration tests para cada endpoint

## Ordem sugerida

1. [x] Entidades e DTOs
2. [x] Repositório
3. [x] Schemas de validação
4. [x] Service
5. [x] Controller e rotas
6. [x] Middleware de autorização
7. [x] Documentação e exemplos HTTP
8. [ ] Testes (pendente — aguardando configuração de test runner)
