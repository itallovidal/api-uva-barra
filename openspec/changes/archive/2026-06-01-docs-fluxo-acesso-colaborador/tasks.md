# Tasks: Documentar fluxo de acesso de colaborador

## 1. Criar pasta `_docs/` na raiz do projeto

- Criar diretório `_docs/` em `/home/itallo/Projetos/api-uva-barra/_docs/`

## 2. Criar `_docs/fluxo-acesso-colaborador.md`

Escrever o documento seguindo o design especificado:

- Título e visão geral do fluxo
- Documentar papéis (roles): `COLLABORATOR` e `ADMIN` com descrições
- Documentar estados: `PENDING`, `APPROVED`, `REJECTED`
- Etapa 1: Solicitação de acesso (payload, validações, criação do registro)
- Etapa 2: Pendência (solicitação aguardando revisão)
- Etapa 3: Revisão (admin lista e analisa)
- Etapa 4a: Aprovação (validações, criação do usuário)
- Etapa 4b: Rejeição (com motivo opcional)
- Diagrama de sequência (textual)
- Tabela de tipos/entidades do código
- Tabela de endpoints envolvidos

## 3. Verificar consistência

- Confirmar que as roles no documento correspondem a `src/types/user/entities.ts`
- Confirmar que os status correspondem a `src/types/registration/entities.ts`
- Confirmar que os DTOs mencionados existem em `src/types/registration/dtos.ts`

## Ordem sugerida

1. Criar `_docs/`
2. Criar `_docs/fluxo-acesso-colaborador.md`
3. Verificar consistência com os tipos do código
