# Proposal: Restruturar endpoints de registro para prefixo /registration/

## O que

Migrar todos os endpoints relacionados a registro de usuário para ficarem sob o prefixo `/user/registration/`, consolidando as rotas em um único local padronizado. Atualmente o único endpoint (`POST /user/register`) usa o termo "register" em vez de "registration". Os novos endpoints (listagem, aprovação, rejeição) devem seguir o mesmo padrão do prefixo `/user/registration/`.

## Por que

- Padronização: todas as operações de registro ficam agrupadas semanticamente sob `/registration/`
- Clareza: o termo "registration" é mais descritivo que "register" para um fluxo de solicitação
- Extensibilidade: novos endpoints (requests, approve, reject) seguem naturalmente o mesmo prefixo
- Consistência com a nomenclatura já usada nos artefatos de design (`user-controller-spec`)

## Escopo

- Renomear `POST /user/register` para `POST /user/registration/`
- Adicionar `GET /user/registration/requests` (listar solicitações com filtro por status)
- Adicionar `POST /user/registration/:id/approve` (aprovar solicitação)
- Adicionar `POST /user/registration/:id/reject` (rejeitar solicitação)
- Atualizar arquivos de código: controller, service, repository, routes
- Atualizar documentação e exemplos HTTP

## Estado atual

- `POST /user/register` implementado em `src/controllers/user.controller.ts`
- Service `registerRequest` em `src/services/user.service.ts`
- Repositório in-memory em `src/repository/in-memory/user.ts`
- Interface `UserRepository` em `src/repository/user.ts`

## Critérios de aceitação

- `POST /user/register` removido, substituído por `POST /user/registration/`
- Todos os novos endpoints implementados e funcionais
- Endpoints administrativos (approve/reject) validam papel de admin
- Respostas usam envelope `ResponsePayload`
- Código existente permanece funcional (sem quebras)
- Artefatos de design e tasks gerados e revisáveis
