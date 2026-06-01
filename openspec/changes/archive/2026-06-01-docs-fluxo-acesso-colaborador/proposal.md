# Proposal: Documentar fluxo de acesso de colaborador

## O que

Criar uma pasta `_docs/` na raiz do projeto para centralizar documentação de fluxos de negócio. O primeiro fluxo a ser documentado é o fluxo de acesso de colaborador: desde a solicitação de registro, passando pela revisão do admin, até a aprovação ou rejeição.

## Por que

- Não existe documentação visual/clara dos fluxos de negócio da aplicação
- A pasta `_docs/` serve como ponto de entrada para novos desenvolvedores e stakeholders entenderem o funcionamento do sistema
- O fluxo de acesso de colaborador é o primeiro contato de um usuário com o sistema e precisa estar bem documentado
- A documentação deve explicar os papéis (roles) disponíveis e como cada um interage com o fluxo

## Escopo

- Criar `_docs/` na raiz do projeto
- Criar `_docs/fluxo-acesso-colaborador.md` documentando:
  - Visão geral do fluxo
  - Papéis/roles do sistema (COLLABORATOR, ADMIN)
  - Etapa 1: Colaborador solicita acesso (dados enviados: name, email, profession, bio)
  - Etapa 2: Solicitação fica pendente (status PENDING)
  - Etapa 3: Admin lista e revisa solicitações
  - Etapa 4: Admin aprova (criação de usuário) ou rejeita (com motivo opcional)
  - Diagrama de sequência ou fluxograma (textual)
  - Relação com os tipos e entidades do domínio (`src/types/registration/`, `src/types/user/`)

## Critérios de aceitação

- `_docs/` criado na raiz do projeto
- `_docs/fluxo-acesso-colaborador.md` criado com toda a documentação do fluxo
- Roles do sistema estão documentadas (COLLABORATOR, ADMIN)
- Estados da solicitação estão documentados (PENDING, APPROVED, REJECTED)
- O documento referencia corretamente os tipos do código-fonte
- O documento pode ser lido e entendido por um novo desenvolvedor sem conhecimento prévio
