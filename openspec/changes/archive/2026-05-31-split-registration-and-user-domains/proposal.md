# Proposal: Separar domínios de Registro e Usuário em controllers/services próprios

## O que

Dividir o atual `user.controller.ts` e `user.service.ts` em dois pares separados:

1. **Registration** (`registration.controller.ts` + `registration.service.ts`) — responsável por solicitações de registro: criação, listagem, aprovação, rejeição
2. **User** (`user.controller.ts` + `user.service.ts`) — responsável por gerenciamento de usuários: CRUD direto (admin), consultas

## Por que

Atualmente o mesmo controller/service acumula responsabilidades de dois fluxos distintos:

- **Fluxo de solicitação de registro** (público cria pedido → admin avalia → aprova/rejeita)
- **Fluxo de gerenciamento de usuários** (admin cria/edita/deleta usuários diretamente)

Manter tudo misturado aumenta a complexidade cognitiva, dificulta manutenção e fere o princípio da responsabilidade única. Cada domínio tem seu próprio ciclo de vida, validações e permissões — merecem artefatos separados.

## Escopo

- Criar `src/controllers/registration.controller.ts` com handlers de registro
- Criar `src/services/registration.service.ts` com lógica de registro
- Reduzir `src/controllers/user.controller.ts` para conter apenas CRUD de usuário
- Reduzir `src/services/user.service.ts` para conter apenas CRUD de usuário
- Manter `UserRepository` e `RegistrationRequestRepository` já separados (não requer mudanças)
- Atualizar `src/app.ts` (composition root) para instanciar os novos services
- Atualizar `src/controllers/routes.ts` para registrar os novos controllers
- Repositórios e tipos/entidades já estão separados — sem mudanças esperadas neles

## Estado atual

- `src/controllers/user.controller.ts` (324 linhas) — contém ambos os grupos de handlers
- `src/services/user.service.ts` (192 linhas) — contém ambos os grupos de métodos
- `src/repository/user.ts` — interface UserRepository
- `src/repository/registration-request.ts` — interface RegistrationRequestRepository
- `src/types/entities.ts` — entidades User e RegistrationRequest já separadas
- `src/types/dto.ts` — DTOs já separados
- `src/validation/user.ts` — schemas zod (podem ser separados ou mantidos)

## Critérios de aceitação

- `registration.controller.ts` contém: createRegistrationHandler, listRegistrationRequestsHandler, approveRegistrationHandler, rejectRegistrationHandler + rotas
- `registration.service.ts` contém: createRegistrationRequest, listRegistrationRequests, approveRegistrationRequest, rejectRegistrationRequest
- `user.controller.ts` contém apenas: createUserHandler, getUserByIdHandler, getUserByEmailHandler, updateUserHandler, deleteUserHandler + rotas
- `user.service.ts` contém apenas: createUser, getUserById, getUserByEmail, updateUser, deleteUser
- `app.ts` e `routes.ts` atualizados para registrar ambos os novos controllers/services
- Nenhuma quebra nos endpoints existentes
- Código compila sem erros de tipo
