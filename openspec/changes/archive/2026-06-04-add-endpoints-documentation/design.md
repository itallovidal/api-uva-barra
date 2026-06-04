## Context

Atualmente não existe documentação centralizada de rotas. As únicas referências são o código-fonte dos controllers e os schemas Zod. Existem dois documentos em `_docs/` (`news.md` e `fluxo-acesso-colaborador.md`) que documentam fluxos específicos, mas não cobrem todas as rotas de forma sistemática.

## Goals / Non-Goals

**Goals:**
- Criar estrutura de diretório `_docs/endpoints/` com arquivos separados por recurso
- Documentar cada rota com: método, path, autenticação, validação (Zod schema), parâmetros, body, query string, respostas de sucesso (status + shape) e erro (status + código)
- Seguir o estilo dos documentos existentes (português, tabelas, blocos de código JSON)
- Mapear tipos/DTOs para os arquivos de código-fonte correspondentes

**Non-Goals:**
- Alterar código-fonte, rotas, controllers ou schemas
- Gerar documentação automaticamente (tudo será escrito manualmente)

## Decisions

- **Separar por recurso**: Um arquivo por domínio (`user.md`, `news.md`, `category.md`, `registration.md`, `healthcheck.md`) em vez de um único arquivo gigante — facilita manutenção e navegação
- **Formato**: Markdown puro (sem geradores) — consistente com `_docs/` existente, sem dependências extras
- **Seção padrão por endpoint**: Tabela resumo com método, path, auth, schemas; depois seções detalhadas de request (body/params/query) e response (sucesso/erro) com exemplos JSON
- **Mapeamento de tipos**: Cada documento incluirá tabela ligando DTOs/entities aos arquivos em `src/types/`
- **Nome dos arquivos**: kebab-case, mesmo padrão do código (`user.md`, `news.md`, `category.md`, etc.)
- **Documentar rota `GET /user/email/:email` sem validação Zod**: Incluir observação explícita de que o parâmetro `email` não passa por schema de validação (ponto de melhoria futura)

## Risks / Trade-offs

- **Documentação dessincronizada**: Conforme a API evolui, a doc pode ficar desatualizada → Mitigação: incluir tasks de revisão periódica e manter os arquivos próximos do código em `_docs/`
- **Esforço inicial de mapeamento**: 23 rotas para documentar → Mitigação: dividir em tarefas por recurso, cada uma autocontida
