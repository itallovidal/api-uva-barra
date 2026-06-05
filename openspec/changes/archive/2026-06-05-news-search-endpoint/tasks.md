## 0. Dependência

- [x] 0.1 Instalar `@isaacs/ttlcache` — `npm install @isaacs/ttlcache`

## 1. CacheService

- [x] 1.1 Criar `src/services/cache.service.ts` com o `CacheService` genérico
  - Internamente usa `TTLCache` da lib `@isaacs/ttlcache`
  - TTL padrão de 15 dias configurável
  - Métodos: `get<T>(namespace)`, `set<T>(namespace, value, ttl?)`, `update<T>(namespace, updater)`, `delete(namespace)`, `reset(namespace)`
  - Método `warmUpNewsIndex(newsRepo: NewsRepository)`: busca todas as notícias publicadas no repo e popula `"news-index"` com `NewsIndexEntry[]`

## 2. Repository

- [x] 2.1 Adicionar método `findManyByIds(ids: string[]): Promise<News[]>` à interface `NewsRepository` em `src/repository/news.ts`
- [x] 2.2 Implementar `findManyByIds` em `src/repository/in-memory/news.ts` — filtrar por `id` incluso no array
- [x] 2.3 Implementar `findManyByIds` em `src/repository/firebase/news.ts` — `Promise.all` de `findById` para cada id
- [x] 2.4 Adicionar método `search(params: { q: string; order: "newest" | "oldest"; page: number; perPage: number }): Promise<{ items: News[]; total: number }>` à interface `NewsRepository` em `src/repository/news.ts`
- [x] 2.5 Implementar `search` em `src/repository/in-memory/news.ts` — filtrar por `title` e `slug` contendo `q` (normalizado, case-insensitive), ordenar por `publishedAt`, paginar
- [x] 2.6 Implementar `search` em `src/repository/firebase/news.ts` — delegar ao `newsService.search` via cache; o repositório apenas expõe `findManyByIds` como primitivo

## 3. Validação

- [x] 3.1 Adicionar `newsSearchQuerySchema` em `src/validation/news.ts` com campos `q` (string, min 1), `order` (enum `newest|oldest`, default `newest`), `page` (coerced number, default 1), `perPage` (coerced number, default 10, max 50)

## 4. Service

- [x] 4.1 Atualizar assinatura de `createNewsService` em `src/services/news.service.ts` para receber `cacheService: CacheService` como segundo parâmetro
- [x] 4.2 Adicionar método `search` em `src/services/news.service.ts`:
  - Obtém `NewsIndexEntry[]` via `cacheService.get("news-index")` (re-popula via `warmUpNewsIndex` se expirado/vazio)
  - Filtra por substring normalizada em `title` e `slug`
  - Pagina os IDs resultantes (só os da página atual)
  - Chama `newsRepo.findManyByIds(pageIds)`
  - Mapeia `News[]` para `NewsPreviewDTO[]` e retorna com metadados de paginação
- [x] 4.3 Atualizar `create` em `src/services/news.service.ts`: após `newsRepo.create()`, chamar `cacheService.update("news-index", ...)` adicionando `{ id, slug, title }` ao vetor
- [x] 4.4 Atualizar `delete` em `src/services/news.service.ts`: após `newsRepo.delete()`, chamar `cacheService.update("news-index", ...)` removendo a entrada com o `id` deletado

## 5. Controller

- [x] 5.1 Adicionar handler `searchNewsHandler` em `src/controllers/news.controller.ts` — validar query com `newsSearchQuerySchema`, chamar `deps.newsService.search`, retornar 200 com `data` e `meta`
- [x] 5.2 Registrar rota `app.get("/news/search", searchNewsHandler)` antes das rotas com parâmetros dinâmicos para evitar conflito de roteamento

## 6. Bootstrap

- [x] 6.1 Atualizar `src/app.ts`:
  - Importar e instanciar `createCacheService`
  - Chamar `await cacheService.warmUpNewsIndex(newsRepo)` antes de criar `newsService`
  - Passar `cacheService` para `createNewsService(newsRepo, cacheService)`

## 7. Documentação e testes HTTP

- [x] 7.1 Atualizar `_docs/endpoints/news.md` adicionando a seção do endpoint `GET /news/search` com parâmetros, validações e exemplos de request/response
- [x] 7.2 Adicionar casos de teste em `http/news.http` para `GET /news/search` (com `q`, com `order`, com paginação, sem `q`)
