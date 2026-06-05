## Why

Não existe atualmente nenhuma forma de buscar notícias por palavra-chave. Front-end e consumidores da API precisam baixar toda a listagem e filtrar no cliente, o que é ineficiente. Um endpoint de busca por termo no título ou slug permite funcionalidades de pesquisa sem trafegar dados desnecessários.

A estratégia de busca usa um índice in-memory cacheado com `@isaacs/ttlcache` (TTL de 15 dias), evitando fetch completo no Firebase a cada requisição.

## What Changes

- Novo endpoint `GET /news/search?q=<term>` para busca de notícias por palavra-chave
- O parâmetro `q` pesquisa por substring (case-insensitive, normalizado) nos campos `title` e `slug`
- Parâmetro opcional `order` controla ordenação por data de publicação (`newest` | `oldest`, default `newest`)
- Retorna apenas notícias com `status === "published"`
- Resposta paginada com `meta` (`page`, `perPage`, `total`, `totalPages`)
- Novo `CacheService` genérico que gerencia caches por namespace com TTL configurável
- Cache de índice de notícias (`"news-index"`) populado no startup (warm-up eager) e mantido consistente por `create` e `delete`
- Instalação da lib `@isaacs/ttlcache`

## Capabilities

### New Capabilities
- `news-search`: Endpoint de busca de notícias publicadas por termo no título ou slug, com suporte a ordenação e paginação, usando índice in-memory cacheado

### Modified Capabilities

- `news-create`: `POST /news/` passa a atualizar o cache de índice após criar uma notícia
- `news-delete`: `DELETE /news/:id` passa a remover a entrada do cache de índice após deletar

## Impact

- `package.json` — nova dependência `@isaacs/ttlcache`
- `src/services/cache.service.ts` — novo `CacheService` genérico (get, set, update, delete, reset por namespace)
- `src/repository/news.ts` — novo método `findManyByIds` na interface
- `src/repository/firebase/news.ts` — implementação Firebase de `findManyByIds`
- `src/repository/in-memory/news.ts` — implementação in-memory de `findManyByIds`
- `src/services/news.service.ts` — método `search` + atualização de cache em `create` e `delete`
- `src/controllers/news.controller.ts` — handler e rota `GET /news/search`
- `src/validation/news.ts` — novo schema `newsSearchQuerySchema`
- `src/app.ts` — instancia `CacheService`, injeta em `newsService`, executa warm-up no startup
- `_docs/endpoints/news.md` — atualização da documentação de rotas
