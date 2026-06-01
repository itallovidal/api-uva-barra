# Tasks: Separar domínios de Registro e Usuário

## 1. Criar `src/services/registration.service.ts`

Extrair métodos de registro do `user.service.ts` atual para novo service.

- Criar `RegistrationServiceFactory(registrationRequestRepo, userRepo)`
- Mover/copiar métodos:
  - `createRegistrationRequest(input)` — validar email duplicado (user + request), hasheiar senha, criar request PENDING
  - `listRegistrationRequests(query?)` — delegar ao repo com paginação
  - `approveRegistrationRequest(id, adminId)` — validar PENDING, verificar email, criar User, marcar APPROVED
  - `rejectRegistrationRequest(id, adminId, reason?)` — validar PENDING, marcar REJECTED
- Importar `hashPassword` de `@/utils/password-handler`
- Importar repos e tipos necessários

## 2. Reescrever `src/services/user.service.ts`

Manter apenas métodos de CRUD de usuário.

- `UserServiceFactory(userRepo)` — **sem** `registrationRequestRepo`
- Métodos:
  - `createUser(input: CreateUserDTO)` — criar usuário diretamente (admin). Hashear senha, gerar UUID.
  - `getUserById(id)` — delegar ao repo
  - `getUserByEmail(email)` — delegar ao repo
  - `updateUser(id, input)` — delegar ao repo
  - `deleteUser(id)` — delegar ao repo
- Remover todo código relacionado a RegistrationRequest

## 3. Adicionar `CreateUserDTO` em `src/types/dto.ts`

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

## 4. Criar `src/controllers/registration.controller.ts`

Controller dedicado ao domínio de registro.

- Assinatura: `registrationController(app: FastifyInstance, deps: { registrationService: RegistrationService })`
- Handlers (copiar do `user.controller.ts` atual, ajustando importações):
  - `createRegistrationHandler` → `POST /registration/` (público)
  - `listRegistrationRequestsHandler` → `GET /registration/requests` (admin)
  - `approveRegistrationHandler` → `POST /registration/:id/approve` (admin)
  - `rejectRegistrationHandler` → `POST /registration/:id/reject` (admin)
- Validar com schemas zod de `@/validation/user.ts`
- Usar envelope `ResponsePayload`
- Tratamento de erros com `error.cause`

## 5. Adicionar handlers de CRUD em `src/controllers/user.controller.ts`

Reescrever o controller para conter apenas handlers de usuário.

- Assinatura: `userController(app: FastifyInstance, deps: { userService: UserService })`
- Handlers novos:
  - `createUserHandler` → `POST /user/` (admin) — criar usuário
  - `getUserByIdHandler` → `GET /user/:id` (admin)
  - `getUserByEmailHandler` → `GET /user/email/:email` (admin)
  - `updateUserHandler` → `PUT /user/:id` (admin)
  - `deleteUserHandler` → `DELETE /user/:id` (admin)
- Validar com schemas zod
- Usar envelope `ResponsePayload`

## 6. Atualizar `src/validation/user.ts`

- Manter schemas de registro existentes (são usados pelo registration controller)
- Adicionar `createUserSchema` para validação de criação direta de usuário:
  ```typescript
  export const createUserSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6),
    profession: z.string().refine(...),
    bio: z.string().optional().nullable(),
    role: z.enum(["collaborator", "admin"]).optional().default("collaborator"),
  });
  ```
- Adicionar schemas para update, get params, delete params conforme necessário

## 7. Atualizar `src/app.ts` (composition root)

- Importar `RegistrationServiceFactory` de `@/services/registration.service`
- Importar `UserServiceFactory` de `@/services/user.service`
- Instanciar ambos os services:
  ```typescript
  const registrationService = RegistrationServiceFactory(registrationRequestRepo, userRepo);
  const userService = UserServiceFactory(userRepo);
  ```
- Atualizar `AppServices` type para incluir `registrationService`

## 8. Atualizar `src/controllers/routes.ts`

- Importar `registrationController`
- Registrar:
  ```typescript
  await registrationController(app, { registrationService: deps.registrationService });
  await userController(app, { userService: deps.userService });
  ```

## 9. Remover arquivos/imports antigos

- Remover importação não utilizada de `UserService` em `user.controller.ts` (se aplicável)
- Garantir que nenhum arquivo importa `UserServiceFactory` do local antigo com métodos de registro
- Verificar lint e type-check

## 10. Verificar compilação e testes

- Executar `npx tsx --no-cache src/server.ts` ou comando de build para verificar erros
- Verificar se todos os endpoints funcionam (testar manualmente ou com testes existentes)
- Rodar linter

## Ordem sugerida

1. [x] `CreateUserDTO` em `src/types/dto.ts`
2. [x] Schema `createUserSchema` em `src/validation/user.ts`
3. [x] `src/services/registration.service.ts` (extrair do user.service atual)
4. [x] `src/services/user.service.ts` (reescrever com apenas CRUD)
5. [x] `src/controllers/registration.controller.ts` (extrair handlers)
6. [x] `src/controllers/user.controller.ts` (reescrever com CRUD handlers)
7. [x] `src/app.ts` (atualizar composition root)
8. [x] `src/controllers/routes.ts` (registrar novos controllers)
9. [x] Limpeza e verificação final
