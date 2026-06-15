## 1. Cache Service — Adicionar `status` ao cache e buscar todas as notícias

- [x] 1.1 Adicionar campo `status: NewsStatusType` ao `CachedNewsPreview` (`src/services/cache.service.ts`)
- [x] 1.2 Ajustar `warmUpNewsIndex` para buscar **todas** as notícias (buscar published e unpublished e concatenar)
- [x] 1.3 Mapear `status` no `CachedNewsPreview` durante o warm-up
- [x] 1.4 Adicionar fallback: se `warmUpNewsIndex` falhar, logar erro e continuar (cache vazio, fallback para Firebase nos endpoints)

## 2. News Service — Cache como fonte primária para todos os endpoints

- [x] 2.1 Refatorar `findLatest` (published) para buscar do cache e filtrar por `status === "published"`; adicionar fallback para `newsRepo.findLatest` se cache vazio
- [x] 2.2 Refatorar `findLatest` (unpublished) para buscar do cache e filtrar por `status !== "published"` (draft, review, archived); adicionar fallback para `newsRepo.findLatest` se cache vazio
- [x] 2.3 Refatorar `findLatest` (category + published) para buscar do cache e filtrar por `category` + `status === "published"`; fallback se cache vazio
- [x] 2.4 Refatorar `findLatest` (category + unpublished) para buscar do cache e filtrar por `category` + `status !== "published"`; fallback se cache vazio
- [x] 2.5 Refatorar `search` para buscar do cache; adicionar fallback para `newsRepo.search` se cache vazio
- [x] 2.6 Ajustar `create` para inserir no cache com `status` correto (independentemente do status)
- [x] 2.7 Ajustar `update` para atualizar no cache com `status` correto (sempre atualiza, não remove mais)
- [x] 2.8 Ajustar `delete` para remover do cache (já funciona, sem mudanças)
- [x] 2.9 Manter `findById` e `findBySlug` buscando no Firebase (sem mudanças — detalhe não entra no escopo)

## 3. Repository — Implementar `search` no Firebase repo

- [x] 3.1 Implementar `search` no `NewsFirebaseRepository` para suportar fallback do cache

## 4. Testes e Validação

- [x] 4.1 Testar `GET /news?status=published` — deve retornar do cache; verificar no log se não há leitura no Firebase
- [x] 4.2 Testar `GET /news?status=unpublished` — deve retornar do cache (filtrando status); verificar no log se não há leitura no Firebase
- [x] 4.3 Testar `GET /news/category/:c?status=published` — deve retornar do cache
- [x] 4.4 Testar `GET /news/category/:c?status=unpublished` — deve retornar do cache
- [x] 4.5 Testar `GET /news/search` — deve retornar do cache; fallback para Firebase se cache vazio
- [x] 4.6 Testar `GET /news/:id` — deve buscar no Firebase (sem mudança esperada)
- [x] 4.7 Testar `GET /news/slug/:slug` — deve buscar no Firebase (sem mudança esperada)
- [x] 4.8 Testar `POST /news` — deve adicionar ao cache com `status` correto
- [x] 4.9 Testar `PUT /news/:id` — deve atualizar no cache com `status` correto
- [x] 4.10 Testar `DELETE /news/:id` — deve remover do cache
- [x] 4.11 Testar cenário de cache vazio (simular restart) — verificar se fallback para Firebase funciona
- [x] 4.12 Verificar logs: nenhum "findLatest - NewsFirebaseRepository" ou "findManyByIds - NewsFirebaseRepository" em listagens publicadas/unpublished

## 5. Documentação

- [x] 5.1 Atualizar `_docs/endpoints/news.md` para refletir que **todos os endpoints de listagem e busca** usam cache em memória
- [x] 5.2 Documentar que `GET /news?status=unpublished` agora também usa cache
- [x] 5.3 Documentar que cache contém todas as notícias (não só publicadas) e é filtrado por status em memória
