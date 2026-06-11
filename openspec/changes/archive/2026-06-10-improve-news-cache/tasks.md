## 1. DTO e Tipos

- [x] 1.1 Renomear `authorName` para `author` no `NewsPreviewDTO` (`src/types/news/dtos.ts`)
- [x] 1.2 Ajustar mapeamentos de `NewsPreviewDTO` no `NewsService` para usar `author` ao invés de `authorName`
- [x] 1.3 Verificar se há alguma referência a `authorName` no projeto (controllers, testes, docs) e ajustar

## 2. Cache Service

- [x] 2.1 Substituir `NewsIndexEntry` por `CachedNewsPreview` no `CacheService` (`src/services/cache.service.ts`)
- [x] 2.2 Ajustar `warmUpNewsIndex` para popular o cache com `CachedNewsPreview[]` completo (mapear `News` → `CachedNewsPreview`)
- [x] 2.3 Garantir que `warmUpNewsIndex` só armazene notícias com `status === "published"`
- [x] 2.4 Ajustar tipos de `update`, `set`, `get` no `CacheService` para refletir `CachedNewsPreview[]`

## 3. News Service

- [x] 3.1 Refatorar `findLatest` para buscar do cache `news-index` ao invés de consultar `newsRepo.findLatest` (para status `published`)
- [x] 3.2 Manter `findLatest` consultando `newsRepo.findLatest` apenas para status `unpublished` (não-publicadas)
- [x] 3.3 Refatorar `search` para buscar do cache `news-index` ao invés de consultar `newsRepo.findManyByIds`
- [x] 3.4 Ajustar `create` para inserir `CachedNewsPreview` completo no cache quando `status === "published"`
- [x] 3.5 Ajustar `update` para atualizar o `CachedNewsPreview` correspondente no cache
- [x] 3.6 Ajustar `delete` para remover o `CachedNewsPreview` correspondente do cache
- [x] 3.7 Manter `findById` e `findBySlug` buscando no `newsRepo` (notícia completa, com `content`)

## 4. App e Startup

- [x] 4.1 Descomentar `await cacheService.warmUpNewsIndex(newsRepo)` no `app.ts`
- [x] 4.2 Garantir que `warmUpNewsIndex` seja chamada após a inicialização do Firebase e antes do registro de rotas
- [x] 4.3 Verificar se o cache é populado corretamente no startup e adicionar log de diagnóstico

## 5. Testes e Validação

- [ ] 5.1 Testar `GET /news` — deve retornar lista do cache sem consultar Firebase
- [ ] 5.2 Testar `GET /news/category/:category` — deve retornar lista filtrada do cache
- [ ] 5.3 Testar `GET /news/search` — deve retornar resultados do cache
- [ ] 5.4 Testar `GET /news/:id` — deve buscar notícia completa no Firebase
- [ ] 5.5 Testar `GET /news/slug/:slug` — deve buscar notícia completa no Firebase
- [ ] 5.6 Testar `POST /news` com `published` — deve adicionar ao cache
- [ ] 5.7 Testar `DELETE /news/:id` — deve remover do cache
- [ ] 5.8 Testar `PUT /news/:id` — deve atualizar o cache
- [ ] 5.9 Verificar se `author` aparece no `NewsPreviewDTO` de listagem/busca

## 6. Documentação

- [x] 6.1 Atualizar `_docs/endpoints/news.md` se houver menção a `authorName` ou cache
- [x] 6.2 Documentar que endpoints de listagem e busca agora usam cache em memória
- [x] 6.3 Documentar que endpoints de detalhe (`id`/`slug`) continuam buscando no Firebase
