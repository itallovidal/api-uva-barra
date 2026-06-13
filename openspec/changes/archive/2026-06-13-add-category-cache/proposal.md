## Why

O endpoint de listagem de categorias (`GET /categories`) é acessado com alta frequência em praticamente todas as requisições de notícias, filtragem e montagem de menus. Atualmente, cada chamada dispara uma consulta ao Firebase Firestore via `CategoryRepository.findAll()`, gerando leituras desnecessárias e pressionando a quota diária. Como o volume de categorias é pequeno e relativamente estável, é ideal manter um cache em memória que elimine consultas repetidas ao Firestore.

## What Changes

- Adicionar método `warmUpCategories` no `CacheService` para popular o cache de categorias no startup
- Adicionar método `getCategories` no `CacheService` para recuperar categorias do cache
- Modificar o `CategoryService.findAll` para buscar do cache primeiro, com fallback para o repositório
- Modificar o `CategoryService.create`, `update` e `delete` para invalidar/atualizar o cache de categorias
- Chamar `warmUpCategories` no startup da aplicação (em `app.ts`), similar ao `warmUpNewsIndex`

## Capabilities

### New Capabilities
- `category-cache`: Cache em memória para a lista completa de categorias, com warm-up no startup, leitura rápida e invalidação síncrona em mutações.

### Modified Capabilities
- `category-listing`: Requisito de fonte de dados altera de "Firebase Firestore" para "Cache em memória (com fallback para Firebase se cache vazio)" para `GET /categories`.

## Impact

- `src/services/cache.service.ts` — adiciona `warmUpCategories` e `getCategories`
- `src/services/category.service.ts` — `findAll` lê do cache, `create`/`update`/`delete` invalidam cache
- `src/app.ts` — chama `warmUpCategories` no startup
- `src/controllers/category.controller.ts` — sem mudanças estruturais (mesma interface), apenas dados vindos de cache
- `src/repository/category.ts` — sem mudanças (interface permanece igual)
- Firebase Firestore — redução drástica de leituras em listagem de categorias
