# Tasks: passos de implementação para o controller de usuário

1) Revisar estado atual (pré-requisitos)
- Ler e validar o código existente em `src/controllers/user.controller.ts`, `src/services/user.service.ts`, `src/repository/in-memory/user.ts` e `src/utils/password-handler.ts`.

2) Criar/Atualizar DTOs e validações
- Adicionar/atualizar `src/types/dto.ts` com `RegisterRequestDTO`, `RegistrationRequestResponse`, `AdminActionDTO`.
- Adicionar zod schemas em `src/validation/user.ts` para:
  - registerRequest
  - adminApproveRequest
  - adminRejectRequest

3) Expandir repositório para suportar RegistrationRequest
- Atualizar `src/repository/in-memory/user.ts` ou criar `src/repository/in-memory/registrationRequest.ts` com métodos:
  - createRequest(request)
  - findRequestById(id)
  - listRequests(filter)
  - updateRequest(id, patch)

4) Service layer
- Em `src/services/user.service.ts` (ou criar `registration-request.service.ts`):
  - adicionar método `createRegistrationRequest(input)` (gera id, hash, salva request PENDING)
  - `approveRegistrationRequest(id, adminId)` → cria User, atualiza request
  - `rejectRegistrationRequest(id, adminId, reason?)` → atualiza request status
- Garantir tratamento de erros com `API_ERROR_CODES` e causas (status, code, message)

5) Controller/rotas
- Em `src/controllers/user.controller.ts`:
  - expor `POST /user/register-request` (já implementado — revisar)
  - adicionar `GET /admin/registration-requests` (admin)
  - `POST /admin/registration-requests/:id/approve` (admin)
  - `POST /admin/registration-requests/:id/reject` (admin)
- Atualizar `src/controllers/routes.ts` para proteger rotas admin com middleware (checar role)

6) Autorização
- Implementar middleware simples (ou usar existente) que injeta user context e valida role==ADMIN para rotas admin.

7) Tests
- Unit tests para service (approve, reject, edge cases: race, existing email)
- Integration tests (spin up app via createApp, usar http/user.http collection para testar end-to-end)

8) Docs/Specs
- Atualizar `docs/README.md` com resumo do fluxo e endpoints.
- Incluir exemplos de requests no `http/user.http` (já existe — expandir com admin flows).

9) Observabilidade
- Adicionar logs informativos nos pontos de aprovação/rejeição.

10) Revisão e PR
- Rodar linters/tests
- Criar Pull Request com descrição baseada em `proposal.md` e `design.md`.

Ordem sugerida de implementação

1. DTOs + validações
2. Repositório (registration requests)
3. Service methods
4. Controller endpoints + rotas
5. Middleware de autorização
6. Tests e docs
7. PR

Estimativa rápida: 1–2 dias de trabalho dependendo de integração com persistência real.

Observações finais

- Priorizar segurança do hash e verificação de email duplicado.
- Manter compatibilidade com o envelope `ResponsePayload` do projeto.
