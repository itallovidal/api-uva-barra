# Design: Controller de Usuário — Como vai funcionar

Visão geral

O sistema suporta um fluxo de contribuição controlada: um candidato (ex.: desenvolvedor, redator, designer) envia uma *solicitação de registro* com seu nome, e‑mail, senha, profissão e bio. Essas solicitações ficam com status PENDING. Um administrador analisa a solicitação — visualiza nome, e‑mail, bio e o que o usuário oferece — e decide aprovar ou rejeitar. Ao aprovar, o sistema cria o usuário ativo no repositório de `users` e muda o status da solicitação para APPROVED; ao rejeitar, o status vira REJECTED.

Principais entidades e status

- RegistrationRequest
  - id: string (UUID)
  - name: string
  - email: string
  - passwordHash: string
  - profession: string
  - bio?: string | null
  - status: "PENDING" | "APPROVED" | "REJECTED"
  - createdAt: Date
  - reviewedBy?: string | null (admin id)
  - reviewedAt?: Date | null

- User (após aprovação)
  - id: string (UUID)
  - name, email, passwordHash, profession, bio
  - role: enum (e.g., COLLABORATOR, ADMIN)
  - status: enum (ACTIVE, PENDING, SUSPENDED)
  - createdAt, updatedAt

API Endpoints (HTTP)

1. POST /user/register-request
- Descrição: cria uma solicitação de registro (PENDING)
- Permissão: público
- Body (application/json):
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "profession": "string",
    "bio": "string?"
  }
- Resposta 201: payload com RegistrationRequest (sem password em claro)
- Erros: 400 (invalid payload), 409 (email já solicitado/usuário existe)

2. GET /admin/registration-requests
- Descrição: lista solicitações (filter por status)
- Permissão: admin
- Query params: status (PENDING|APPROVED|REJECTED), page, per_page
- Resposta 200: lista paginada de RegistrationRequest

3. POST /admin/registration-requests/:id/approve
- Descrição: aprova solicitação — cria usuário ativo
- Permissão: admin
- Response 200: created User (sem password em claro)
- Efeitos: altera status da solicitação para APPROVED, reviewedBy/reviewedAt preenchidos
- Erros: 404 (request not found), 409 (user with email already exists)

4. POST /admin/registration-requests/:id/reject
- Descrição: rejeita solicitação
- Permissão: admin
- Body (optional): { reason?: string }
- Response 200: request with status REJECTED

5. POST /users (opcional — criação direta por admin)
- Permissão: admin
- Uso: criar usuário sem passar pela solicitação (útil para importações/override)

6. PUT /users/:id
- Descrição: atualizar dados do usuário (name, profession, bio)
- Permissão: admin ou próprio usuário

7. DELETE /users/:id
- Descrição: deletar ou marcar usuário como suspended/inactive
- Permissão: admin

Validação e segurança

- Senhas: aceitar senha em texto no request, sempre armazenar hash (bcrypt) via `src/utils/password-handler.ts`.
- Validação: zod schemas (já usados no projeto) para validar payloads.
- Autenticação/Autorização: endpoints admin devem checar role==ADMIN; endpoints de usuário permitem acesso do próprio recurso via token/session.
- Proteção contra race conditions: ao aprovar, verificar novamente se já existe usuário com mesmo email — operação atômica no repo (ou checar e falhar com 409).

Fluxo de aprovação (sequência)

1. Usuário envia POST /user/register-request → criação RegistrationRequest status=PENDING.
2. Admin lista solicitações e escolhe uma.
3. Admin chama POST /admin/registration-requests/:id/approve.
   - Serviço valida que request está PENDING.
   - Serviço verifica se usuário com email existe → se existir retorna 409.
   - Cria usuário com role=COLLABORATOR, status=ACTIVE e passwordHash do request.
   - Atualiza RegistrationRequest.status = APPROVED, reviewedBy, reviewedAt.

Observabilidade e auditoria

- Registrar eventos de aprovação/rejeição (logs estruturados) contendo admin id, request id, outcome e timestamp.
- Emitir métricas simples: número de solicitações PENDING, taxa de aprovação, tempo médio de revisão.

Considerações de compatibilidade

- Como a implementação atual usa um repositório in-memory para desenvolvimento, garantir que a API de repositório seja estável para permitir troca futura por persistência real.
- Retornar respostas compatíveis com o envelope de resposta do projeto (usar `ResponsePayload` comum).

Exemplos de DTOs (zod)

- RegisterRequestDTO
- RegistrationRequestResponse
- AdminActionResponse

