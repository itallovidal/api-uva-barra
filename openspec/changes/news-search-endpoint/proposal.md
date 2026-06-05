## Why

Não existe atualmente nenhuma forma de buscar notícias por palavra-chave. Front-end e consumidores da API precisam baixar toda a listagem e filtrar no cliente, o que é ineficiente. Um endpoint de busca por termo no título ou slug permite funcionalidades de pesquisa sem trafegar dados desnecessários.

## What Changes

- Novo endpoint `GET /news/search?q=<term>` para busca de notícias por palavra-chave
- O parâmetro `q` é obrigatório e pesquisa por prefixo no campo `title` e por match exato no campo `slug`
- Parâmetro opcional `order` controla ordenação por data de publicação (`newest` | `oldest`, default `newest`)
- Retorna apenas notícias com `status === "published"`
- Resposta paginada com `meta` (`page`, `perPage`, `total`, `totalPages`)
- Novo método `search` adicionado à interface `NewsRepository`
- Implementação Firebase usando range queries (prefix search) para `title` e query `==` para `slug`
- Implementação in-memory para testes

## Capabilities

### New Capabilities
- `news-search`: Endpoint de busca de notícias publicadas por termo no título ou slug, com suporte a ordenação e paginação

### Modified Capabilities

*Nenhuma — nenhum requisito existente muda.*

## Impact

- `src/repository/news.ts` — novo método `search` na interface
- `src/repository/firebase/news.ts` — implementação Firebase do `search`
- `src/repository/in-memory/news.ts` — implementação in-memory do `search`
- `src/services/news.service.ts` — método `search` no service
- `src/controllers/news.controller.ts` — handler e rota `GET /news/search`
- `src/validation/news.ts` — novo schema `newsSearchQuerySchema`
- `_docs/endpoints/news.md` — atualização da documentação de rotas
