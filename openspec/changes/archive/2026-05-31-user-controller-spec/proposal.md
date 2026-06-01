# Proposal: Spec do controller de usuário

O que

Criar uma especificação para o controller de usuário que documente o fluxo de solicitações de registro (registro como solicitação), o fluxo de aprovação/rejeição por administrador e os endpoints para criação definitiva do usuário, atualização e deleção.

Por que

Atualmente há commits que implementam a rota de solicitação de registro, o serviço e utilitários (hash), porém não existe documentação formal do fluxo nem dos endpoints adicionais necessários (aprovação pelo admin, criação final do usuário, atualização e deleção). Ter uma spec garante alinhamento entre backend/front e permite testes e auditoria.

Escopo

- Documentar o fluxo de "registro por solicitação" (usuário envia request com nome, email, senha, profissão, bio).
- Documentar como o admin aprova/rejeita uma solicitação e como a aprovação leva à criação do usuário ativo.
- Especificar endpoints iniciais: criar solicitação, listar solicitações (admin), aprovar/rejeitar (admin), criar usuário (admin/manual), atualizar usuário, deletar usuário.
- Definir contratos (DTOs), códigos de erro, status, regras de validação e permissões.

Estado atual

- Implementado: controller de solicitação de registro (`src/controllers/user.controller.ts`), serviço (`src/services/user.service.ts`), utilitário de hash (`src/utils/password-handler.ts`), repositório in-memory (`src/repository/in-memory/user.ts`).
- Não implementado/pendente: endpoints de administração para listar/aprovar/rejeitar solicitações, endpoint final de criação do usuário a partir de uma solicitação, endpoints de update/delete, testes completos e documentação.

Critérios de aceitação

- A spec contém: endpoints, DTOs, exemplos de request/response, regras de negócio e fluxos de estado.
- Artefatos de design e tasks gerados e revisáveis.
- Pronto para rodar `/opsx:apply` para implementação automática/iniciada.
