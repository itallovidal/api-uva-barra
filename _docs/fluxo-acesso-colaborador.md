# Fluxo de Acesso de Colaborador

**Versão:** 1.0  
**Data:** 2026-06-01  

## Visão Geral

Este documento descreve o fluxo completo para um colaborador obter acesso à aplicação. O processo começa com uma solicitação de registro, passa por uma revisão administrativa, e termina com a aprovação ou rejeição da solicitação.

## Papéis (Roles)

| Role | Descrição |
|------|-----------|
| `collaborator` | Usuário comum que acessa a aplicação após ter sua solicitação aprovada |
| `admin` | Usuário com permissão para gerenciar solicitações de registro, revisar e aprovar/rejeitar acessos |

As roles são definidas em `src/types/user/entities.ts` (`UserRole`).

## Estados da Solicitação

| Status | Descrição |
|--------|-----------|
| `PENDING` | Solicitação aguardando revisão de um admin |
| `APPROVED` | Solicitação aprovada — usuário foi criado |
| `REJECTED` | Solicitação rejeitada — motivo opcional registrado |

Os estados são definidos em `src/types/registration/entities.ts` (`RegistrationRequestStatus`).

## Fluxo Completo

### Etapa 1 — Solicitação de Acesso

O colaborador envia uma requisição `POST /user/registration/` com os seguintes dados:

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "profession": "desenvolvedor",
  "bio": "Desenvolvedor full-stack"
}
```

**Campos obrigatórios:** `name`, `email`, `password`, `profession`  
**Campos opcionais:** `bio`

**Validações aplicadas:**
- Email deve ser único (não pode existir outro usuário ou solicitação com o mesmo email)
- `profession` deve ser um dos valores válidos: `designer`, `redator`, `desenvolvedor`, `social_media`, `editor_chefe`, `outro`
- Senha é armazenada como hash (nunca em texto puro)

**Resposta (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "profession": "desenvolvedor",
    "bio": "Desenvolvedor full-stack",
    "status": "PENDING",
    "reviewedBy": null,
    "reviewedAt": null,
    "rejectionReason": null,
    "createdAt": "2026-06-01T10:00:00.000Z",
    "updatedAt": "2026-06-01T10:00:00.000Z"
  }
}
```

### Etapa 2 — Pendência

Após a criação, a solicitação fica com status `PENDING` aguardando revisão. Nenhuma ação do colaborador é necessária nesta etapa.

### Etapa 3 — Revisão pelo Admin

O admin lista as solicitações pendentes:

```
GET /user/registration/requests?status=PENDING
```

**Permissão:** Apenas usuários com role `admin`.

**Resposta (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "profession": "desenvolvedor",
      "bio": "Desenvolvedor full-stack",
      "status": "PENDING",
      "createdAt": "2026-06-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 1
  }
}
```

O admin analisa os dados da solicitação e decide entre aprovar ou rejeitar.

### Etapa 4a — Aprovação

O admin envia uma requisição para aprovar a solicitação:

```
POST /user/registration/:id/approve
```

**Permissão:** Apenas usuários com role `admin`.

**Validações:**
- Solicitação deve estar com status `PENDING`
- Email não pode já estar em uso por um usuário existente

**Efeitos:**
- Um novo `User` é criado com `role=collaborator` e `status=active`
- A `RegistrationRequest` tem seu status alterado para `APPROVED`
- Os campos `reviewedBy` (ID do admin) e `reviewedAt` são preenchidos

**Resposta (200 OK):** Dados do usuário recém-criado (sem a senha).

### Etapa 4b — Rejeição

O admin envia uma requisição para rejeitar a solicitação:

```
POST /user/registration/:id/reject
```

**Permissão:** Apenas usuários com role `admin`.

**Body (opcional):**
```json
{
  "reason": "Documentação insuficiente"
}
```

**Validações:**
- Solicitação deve estar com status `PENDING`

**Efeitos:**
- A `RegistrationRequest` tem seu status alterado para `REJECTED`
- Os campos `reviewedBy`, `reviewedAt` e `rejectionReason` são preenchidos
- Nenhum usuário é criado

**Resposta (200 OK):** Dados da solicitação atualizada.

## Endpoints Envolvidos

| Método | Rota | Permissão | Descrição |
|--------|------|-----------|-----------|
| POST | `/user/registration/` | Público | Criar solicitação de registro |
| GET | `/user/registration/requests` | Admin | Listar solicitações (filtro opcional por status) |
| POST | `/user/registration/:id/approve` | Admin | Aprovar solicitação pendente |
| POST | `/user/registration/:id/reject` | Admin | Rejeitar solicitação pendente |

## Relacionamento com Tipos do Código

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| `RegistrationRequest` | `src/types/registration/entities.ts` | Entidade da solicitação de registro |
| `RegistrationRequestDTO` | `src/types/registration/dtos.ts` | DTO para criação da solicitação |
| `RegistrationRequestResponse` | `src/types/registration/dtos.ts` | Resposta da solicitação |
| `RegistrationRequestListQuery` | `src/types/registration/dtos.ts` | Parâmetros de listagem/filtro |
| `ApproveRegistrationDTO` | `src/types/registration/dtos.ts` | DTO para aprovação |
| `RejectRegistrationDTO` | `src/types/registration/dtos.ts` | DTO para rejeição |
| `User` | `src/types/user/entities.ts` | Entidade do usuário |
| `UserRole` | `src/types/user/entities.ts` | Roles: `collaborator`, `admin` |
| `UserProfession` | `src/types/user/entities.ts` | Profissões: `designer`, `redator`, `desenvolvedor`, `social_media`, `editor_chefe`, `outro` |
| `UserStatus` | `src/types/user/entities.ts` | Status: `active`, `inactive`, `pending` |

## Comentários e observações

- Resumo: este fluxo permite duas formas de criação de um `User`:
  - Criação direta por administradores através da rota `POST /user/` (rota protegida). Recomendação: a rota deve checar explicitamente que o usuário autenticado tem `role = admin` antes de permitir a criação.
  - Solicitação externa via `POST /registration/` seguida de aprovação por um admin (`POST /registration/:id/approve`), que cria o usuário com `role = collaborator`.

- Observações técnicas importantes:
  - A rota `POST /user/` já exige autenticação (`authMiddleware`) mas atualmente não há verificação explícita de `role` no middleware; considere criar um middleware `requireAdmin` ou verificar `request.user.role` no controller para retornar `403 Forbidden` quando necessário.
  - Ao aprovar uma solicitação, garanta a atomicidade da operação: verifique novamente a unicidade do email e crie o usuário + atualize o `RegistrationRequest` em uma transação ou com tratamento de falhas para evitar estados inconsistentes.
  - A validação de email único deve ocorrer tanto na criação direta quanto durante a aprovação da solicitação para evitar race conditions.
  - Senhas nunca devem ser armazenadas em texto: o fluxo atual armazena `passwordHash` na `RegistrationRequest` e usa esse hash ao criar o `User` — isso está correto.
  - Ao criar usuários diretamente por um admin, defina explicitamente o `role` pretendido (ex.: `UserRole.COLLABORATOR` ou `UserRole.ADMIN`) e o `status` (ex.: `active`).

- TODO:
  - Registrar (audit log) qual admin aprovou/rejeitou e quaisquer operações de criação direta para facilitar auditoria (o campo `reviewedBy` já cobre parte disso para solicitações).
  - Incluir testes automatizados cobrindo ambos os fluxos: criação direta por admin, criação via fluxo de solicitação + aprovação, rejeição, e tentativas de criação com email já existente.
  - Considerar expor um endpoint para admins listarem solicitações com filtros adicionais (por exemplo, por profession) e paginação consistente (o service já retorna `meta` com page/perPage/total).

Essas observações ajudam a garantir que o fluxo suportado na API seja seguro, previsível e auditável.
