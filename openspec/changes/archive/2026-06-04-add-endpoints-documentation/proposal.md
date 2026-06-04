## Why

A aplicação não possui documentação centralizada de rotas da API. Cada desenvolvedor precisa ler o código-fonte dos controllers e schemas de validação para entender como usar cada endpoint. Isso dificulta a integração (especialmente para o time de front-end), aumenta o custo de onboarding e gera retrabalho em mudanças na API.

## What Changes

- Criar a pasta `_docs/endpoints/` com arquivos de documentação por recurso
- Documentar todas as rotas da aplicação com método, path, autenticação, parâmetros, body, query, e respostas (sucesso e erro)
- Organizar a documentação seguindo a mesma estrutura e estilo dos documentos existentes em `_docs/` (em português, com tabelas e exemplos JSON)

## Capabilities

### New Capabilities
- `endpoints-doc`: Documentacão de rotas da API no diretório `_docs/endpoints/`, organizada por recurso, com especificação de requisição e resposta para cada endpoint

### Modified Capabilities

*- Nenhuma — este é um artefato de documentação, não altera requirements de funcionalidades existentes.*

## Impact

- Criação de múltiplos arquivos em `_docs/endpoints/` (não afeta código em produção)
- Nenhuma alteração em `src/`, rotas, ou lógica de negócio
- A documentação precisará ser mantida em sincronia com futuras mudanças de API
