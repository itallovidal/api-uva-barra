## Why

O projeto está tendo um volume excessivo de consultas ao Firebase Firestore, chegando perto da quota diária. O cache de notícias está comentado (`warmUpNewsIndex`) e, quando ativo, armazena apenas `id`, `slug` e `title`. Isso força os endpoints de listagem e busca a buscarem dados adicionais no Firebase, gerando consultas desnecessárias. A oportunidade é armazenar no cache os dados completos do `NewsPreviewDTO`, permitindo listagem e busca rápidas sem tocar no Firestore, e buscar a notícia completa apenas quando acessada por `slug` ou `id`.

## What Changes

- Ativar o cache de notícias no startup da aplicação (`warmUpNewsIndex`)
- Expandir o cache de notícias para armazenar `NewsPreviewDTO` completo ao invés de apenas `id`, `slug`, `title`
- Usar o cache como fonte primária para endpoints de listagem (`/news`, `/news/category/:category`) e busca (`/news/search`)
- Buscar notícia completa no Firebase apenas quando acessada por `id` (`/news/:id`) ou `slug` (`/news/slug/:slug`)
- Corrigir o campo `authorName` para `author` no `NewsPreviewDTO` para alinhar com a entidade `News`
- Ajustar o `findManyByIds` do Firebase para evitar consultas paralelas excessivas (executa N queries simultâneas)

## Capabilities

### New Capabilities
- `news-cache-preview`: Cache de notícias em memória com `NewsPreviewDTO` completo, suportando warm-up no startup, invalidação em create/update/delete, e fallback para Firebase quando vazio.

### Modified Capabilities
- `news-listing`: Requisito de fonte de dados altera de "Firebase Firestore" para "Cache em memória (com fallback para Firebase se cache vazio)" para endpoints de listagem.
- `news-search`: Requisito de fonte de dados altera de "Firebase Firestore" para "Cache em memória (com fallback para Firebase se cache vazio)" para busca de notícias.

## Impact

- `src/services/cache.service.ts` — expande `NewsIndexEntry` para `NewsPreviewDTO`, ativa `warmUpNewsIndex`
- `src/services/news.service.ts` — usa cache para `findLatest` e `search`, busca completa apenas em `findById`/`findBySlug`
- `src/app.ts` — descomenta `warmUpNewsIndex` no startup
- `src/types/news/dtos.ts` — renomeia `authorName` para `author` em `NewsPreviewDTO`
- `src/controllers/news.controller.ts` — sem mudanças estruturais (mesma interface), apenas dados vindos de cache
- `src/repository/firebase/news.ts` — `findManyByIds` pode ser otimizado para reduzir queries (não essencial para o cache, mas reduz carga)
- Firebase Firestore — redução drástica de leituras em listagem/busca

