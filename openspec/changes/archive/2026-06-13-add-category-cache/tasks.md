## 1. Cache Service

- [x] 1.1 Adicionar tipo `CachedCategory` (ou usar `Category[]` diretamente) no `CacheService` (`src/services/cache.service.ts`)
- [x] 1.2 Adicionar método `warmUpCategories(categoryRepo: CategoryRepository): Promise<void>` ao `CacheService` interface e implementação
- [x] 1.3 Adicionar método `getCategories(): Category[] | undefined` (ou `get<Category[]>("categories")`) ao `CacheService` interface e implementação
- [x] 1.4 Implementar `warmUpCategories` para buscar `categoryRepo.findAll()` e armazenar no cache com namespace `"categories"`
- [x] 1.5 Adicionar log de diagnóstico em `warmUpCategories` (similar ao `warmUpNewsIndex`)

## 2. Category Service

- [x] 2.1 Refatorar `findAll` para buscar do cache primeiro: `cacheService.getCategories()` ou `cacheService.get<Category[]>("categories")`
- [x] 2.2 Se cache estiver vazio (undefined), fazer fallback para `categoryRepo.findAll()` e popular o cache com o resultado
- [x] 2.3 Ajustar `create` para invalidar o cache de categorias após criação (`cacheService.delete("categories")` ou `cacheService.reset("categories")`)
- [x] 2.4 Ajustar `update` para invalidar o cache de categorias após atualização (`cacheService.delete("categories")` ou `cacheService.reset("categories")`)
- [x] 2.5 Ajustar `delete` para invalidar o cache de categorias após deleção (`cacheService.delete("categories")` ou `cacheService.reset("categories")`)
- [x] 2.6 Manter `findById` consultando `categoryRepo.findById` (sem cache)

## 3. App e Startup

- [x] 3.1 Adicionar `await cacheService.warmUpCategories(categoryRepo)` no `app.ts` (similar ao `warmUpNewsIndex`)
- [x] 3.2 Garantir que `warmUpCategories` seja chamada após a inicialização do Firebase e antes do registro de rotas
- [x] 3.3 Verificar se o cache é populado corretamente no startup e adicionar log de diagnóstico

## 4. Testes e Validação

- [x] 4.1 Testar `GET /categories` — deve retornar lista do cache sem consultar Firebase (ou com fallback)
- [x] 4.2 Testar `POST /categories` — deve criar e invalidar o cache
- [x] 4.3 Testar `GET /categories` após `POST` — deve buscar do repositório e re-popular o cache
- [x] 4.4 Testar `PUT /categories/:id` — deve atualizar e invalidar o cache
- [x] 4.5 Testar `DELETE /categories/:id` — deve deletar e invalidar o cache
- [x] 4.6 Verificar se `findById` continua buscando no Firebase

## 5. Documentação

- [x] 5.1 Atualizar `_docs/endpoints/category.md` se houver menção ao cache
- [x] 5.2 Documentar que `GET /categories` agora usa cache em memória
- [x] 5.3 Documentar que mutações (create/update/delete) invalidam o cache
