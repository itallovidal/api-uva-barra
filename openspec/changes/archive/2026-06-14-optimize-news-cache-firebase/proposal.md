## Why

O cache de notícias (`warmUpNewsIndex`) está ativo e populado com `NewsPreviewDTO` completo, mas ainda existem muitas leituras desnecessárias no Firebase Firestore. O problema é que nem todos os endpoints de notícias consultam o cache como fonte primária:

1. **`GET /news/:id`** e **`GET /news/slug/:slug`** — buscam diretamente no Firestore, sem verificar o cache primeiro
2. **`GET /news?status=unpublished`** e **`GET /news/category/:c?status=unpublished`** — o `findLatest` do Firebase repo lê TODOS os documentos da coleção para filtrar em memória, em vez de usar cache + filtrar
3. **`findLatest` para `published`** — já usa cache, mas não faz fallback para o banco se o cache estiver vazio

A consequência é que mesmo com cache ativo, endpoints de detalhe e listagens de rascunhos continuam gerando leituras no Firestore. O objetivo é fazer com que **todos os endpoints de notícias consultem o cache primeiro**, e só acessem o Firebase quando estritamente necessário.

## What Changes

- Fazer com que **todos os endpoints de notícias** consultem o cache primeiro
- **`GET /news/:id`** — buscar no cache primeiro; se não encontrar, fazer fallback para o Firebase
- **`GET /news/slug/:slug`** — buscar no cache primeiro; se não encontrar, fazer fallback para o Firebase
- **`GET /news?status=unpublished`** — buscar no cache e filtrar por status; o cache contém o campo `status`
- **`GET /news/category/:c?status=unpublished`** — buscar no cache e filtrar por categoria + status
- **`GET /news/search`** — já usa cache, mas adicionar fallback para Firebase se cache vazio
- **`GET /news?status=published`** — adicionar fallback para Firebase se cache vazio
- Garantir que o cache contenha o campo `status` para permitir filtragem de unpublished
- Manter a atualização do cache em create, update, delete (já funciona hoje)

## Capabilities

### New Capabilities
- `news-cache-read`: Cache como fonte primária para leitura de notícias, com fallback para Firebase apenas quando não encontrado no cache.

### Modified Capabilities
- `news-detail`: Requisito de fonte de dados altera de "Firebase Firestore" para "Cache em memória (com fallback para Firebase se não encontrado)" para endpoints de detalhe (`/news/:id`, `/news/slug/:slug`).
- `news-listing-unpublished`: Requisito de fonte de dados altera de "Firebase Firestore (lê todos os documentos)" para "Cache em memória (filtra por status)" para listagens de rascunhos.
- `news-search`: Adicionar fallback para Firebase quando cache vazio.

## Impact

- `src/services/news.service.ts` — `findById`, `findBySlug`, `findLatest` (unpublished), `search` devem consultar cache primeiro
- `src/services/cache.service.ts` — adicionar `status` ao `CachedNewsPreview` para permitir filtragem de unpublished
- `src/repository/firebase/news.ts` — `findLatest` pode ser otimizado com `where` no Firestore (não bloqueante para este change, mas bom ter)
- `src/controllers/news.controller.ts` — sem mudanças estruturais (mesma interface), apenas dados vindos de cache
- Firebase Firestore — redução drástica de leituras em todos os endpoints de notícias

## Out of Scope

- Cache de notícias completas (com `content`) — não é necessário, pois o `content` é grande e raramente acessado; os endpoints de detalhe podem fazer fallback para o Firebase
- Expiração do cache por TTL — o TTL já está configurado (15 dias) e o warm-up é feito no startup
