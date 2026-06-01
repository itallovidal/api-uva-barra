# Design: Documentar fluxo de acesso de colaborador

## Visão geral

Será criada a pasta `_docs/` na raiz do projeto, servindo como repositório central de documentação de fluxos. O primeiro documento será `_docs/fluxo-acesso-colaborador.md`, detalhando o fluxo completo de um colaborador obter acesso à aplicação.

## Estrutura da pasta `_docs/`

```
_docs/
├── fluxo-acesso-colaborador.md   (primeiro fluxo)
└── ...                            (futuros fluxos)
```

## Conteúdo de `fluxo-acesso-colaborador.md`

### Seções do documento

1. **Título e meta**: nome do fluxo, data, versão
2. **Visão geral do fluxo**: parágrafo introdutório explicando o propósito
3. **Papéis (Roles)**: documentação dos papéis disponíveis:
   - `COLLABORATOR` — usuário comum que acessa a aplicação
   - `ADMIN` — usuário com permissão para gerenciar solicitações e revisar acessos
4. **Estados da solicitação**: `PENDING`, `APPROVED`, `REJECTED`
5. **Fluxo completo (passo a passo)**:

   **Etapa 1 — Solicitação de acesso**
   - Colaborador envia `POST /user/registration/` com:
     - `name`, `email`, `password`, `profession` (obrigatórios)
     - `bio` (opcional)
   - Sistema cria `RegistrationRequest` com status `PENDING`
   - Sistema retorna os dados da solicitação criada

   **Etapa 2 — Pendência**
   - Solicitação aguarda revisão de um admin
   - Admin pode listar solicitações via `GET /user/registration/requests`
   - Filtro opcional por status: `?status=PENDING`

   **Etapa 3 — Revisão**
   - Admin visualiza dados da solicitação
   - Admin decide: aprovar ou rejeitar

   **Etapa 4a — Aprovação**
   - Admin envia `POST /user/registration/:id/approve`
   - Sistema valida: solicitação deve estar `PENDING`
   - Sistema verifica duplicidade de email
   - Sistema cria `User` com `role=COLLABORATOR`, `status=ACTIVE`
   - `RegistrationRequest` atualizada: `status=APPROVED`, `reviewedBy`, `reviewedAt`

   **Etapa 4b — Rejeição**
   - Admin envia `POST /user/registration/:id/reject`
   - Body opcional: `{ "reason": "string" }`
   - Sistema valida: solicitação deve estar `PENDING`
   - `RegistrationRequest` atualizada: `status=REJECTED`, `rejectionReason`, `reviewedBy`, `reviewedAt`

6. **Relacionamento com tipos do código**

   | Tipo | Arquivo | Descrição |
   |------|---------|-----------|
   | `RegistrationRequest` | `src/types/registration/entities.ts` | Entidade da solicitação |
   | `RegistrationRequestDTO` | `src/types/registration/dtos.ts` | DTO de criação |
   | `RegistrationRequestResponse` | `src/types/registration/dtos.ts` | Resposta da solicitação |
   | `RegistrationRequestListQuery` | `src/types/registration/dtos.ts` | Query de listagem |
   | `ApproveRegistrationDTO` | `src/types/registration/dtos.ts` | DTO de aprovação |
   | `RejectRegistrationDTO` | `src/types/registration/dtos.ts` | DTO de rejeição |
   | `User` | `src/types/user/entities.ts` | Entidade do usuário |
   | `UserRole` | `src/types/user/entities.ts` | Roles: `collaborator`, `admin` |
   | `UserProfession` | `src/types/user/entities.ts` | Profissões disponíveis |
   | `UserStatus` | `src/types/user/entities.ts` | Status: `active`, `inactive`, `pending` |

7. **Endpoints envolvidos**

   | Método | Rota | Permissão | Descrição |
   |--------|------|-----------|-----------|
   | POST | `/user/registration/` | Público | Criar solicitação |
   | GET | `/user/registration/requests` | Admin | Listar solicitações |
   | POST | `/user/registration/:id/approve` | Admin | Aprovar solicitação |
   | POST | `/user/registration/:id/reject` | Admin | Rejeitar solicitação |

## Considerações

- O documento deve ser escrito em português (idioma do projeto)
- Deve usar markdown simples, legível tanto no GitHub quanto em editores
- Pode incluir blocos de código para exemplos de payload
- Novos fluxos devem seguir o mesmo padrão de nomenclatura: `fluxo-<nome>.md`
