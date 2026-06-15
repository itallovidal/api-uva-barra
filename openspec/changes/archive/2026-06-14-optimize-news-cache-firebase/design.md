## Context

Hoje o cache de notícias (`CacheService`) está **ativo** e populado com `CachedNewsPreview[]` completo no startup. A atualização do cache em `create`, `update` e `delete` já funciona corretamente no `NewsService`. No entanto, **apenas os endpoints de listagem publicada (`GET /news?status=published`) e busca (`GET /news/search`) usam o cache**. Os demais endpoints continuam consultando o Firebase Firestore diretamente:

- **`GET /news/:id`** — `findById` no `NewsService` chama `newsRepo.findById(id)` diretamente, sem verificar cache
- **`GET /news/slug/:slug`** — `findBySlug` no `NewsService` chama `newsRepo.findBySlug(slug)` diretamente, sem verificar cache
- **`GET /news?status=unpublished`** — `findLatest` no `NewsService` cai no `else` e chama `newsRepo.findLatest(params)`, que lê **todos** os documentos do Firestore para filtrar em memória
- **`GET /news/category/:c?status=unpublished`** — mesmo problema acima

O `CachedNewsPreview` atual **não contém o campo `status`**, o que impede a filtragem de `unpublished` no cache. O cache também não permite buscar por `id` ou `slug` para fallback.

## Goals / Non-Goals

**Goals:**
- **Todos os endpoints de notícias** devem consultar o cache como fonte primária
- `findById` e `findBySlug` buscam no cache primeiro; se não encontrar, fazem fallback para Firebase
- `findLatest` (unpublished) busca no cache e filtra por `status`; se cache vazio, fallback para Firebase
- `search` busca no cache; se cache vazio, fallback para Firebase
- `findLatest` (published) busca no cache; se cache vazio, fallback para Firebase
- Adicionar `status` ao `CachedNewsPreview` para permitir filtragem de unpublished
- Manter invalidação de cache em `create`, `update`, `delete`

**Non-Goals:**
- Cachear notícia completa (`News` com `content`) — apenas preview continua no cache
- Mudanças no contrato de API ou schemas Zod
- Otimização de `findLatest` no Firebase repo (usar `where` no Firestore) — não bloqueante
- Cache distribuído entre instâncias

## Decisions

### 1. Adicionar `status` ao `CachedNewsPreview`
- **Rationale:** O cache precisa conter o `status` para permitir que `findLatest` filtre `published` vs `unpublished` sem consultar o Firestore. O campo `status` é pequeno (string) e não aumenta significativamente o tamanho do cache.
- **Impacto:** `warmUpNewsIndex` precisa popular `status` para todas as notícias. Hoje ele só popula notícias `published`, mas vamos mudar para popular **todas** as notícias (ou pelo menos manter o campo `status` no cache).

### 2. `warmUpNewsIndex` popula cache com **todas** as notícias (published + unpublished)
- **Rationale:** Se o cache só tiver `published`, `findLatest` com `status=unpublished` teria que fazer fallback para o Firebase. Populando todas as notícias, o cache serve como fonte primária para qualquer filtro de status.
- **Alternativa considerada:** Manter cache só com `published` e fazer fallback para Firebase quando `status=unpublished`. Rejeitada porque o objetivo é reduzir leituras no Firebase; se o CMS faz muitas listagens de rascunhos, não resolve o problema.
- **Trade-off:** Cache fica maior, mas preview é pequeno (sem `content`). Se necessário, limitar TTL ou adicionar paginação no warm-up.

### 3. `findById` e `findBySlug` consultam cache primeiro, fallback para Firebase
- **Rationale:** O cache contém `id`, `slug`, e todos os campos de preview. Para `findById`, podemos buscar no cache por `id`; se não encontrar, fazer fallback para `newsRepo.findById(id)`. Para `findBySlug`, buscar no cache por `slug`; se não encontrar, fazer fallback para `newsRepo.findBySlug(slug)`.
- **Trade-off:** Se uma notícia foi criada diretamente no Firestore (fora da API), ela não estará no cache até o próximo warm-up. O fallback garante que a notícia ainda seja encontrada.
- **Nota:** O retorno de `findById` e `findBySlug` é `News` (com `content`), mas o cache só tem `NewsPreviewDTO`. Precisamos decidir: retornar preview do cache + buscar `content` no Firebase, ou só usar o cache para verificar existência e buscar completa no Firebase?

### 4. Decisão sobre `findById`/`findBySlug`: usar cache apenas para verificar existência
- **Rationale:** O cache tem `NewsPreviewDTO`, mas os endpoints de detalhe retornam `News` completo (com `content`). A abordagem mais simples é: buscar no cache por `id`/`slug` para verificar se existe; se existir, buscar completa no Firebase. Se não existir no cache, também buscar no Firebase (fallback). Isso reduz a carga? **Não diretamente** — ainda faz 1 leitura no Firebase para o `content`. Mas garante consistência.
- **Alternativa considerada:** Retornar `NewsPreviewDTO` do cache para `findById`/`findBySlug`. Rejeitada porque muda o contrato da API (deixa de retornar `content`).
- **Alternativa considerada 2:** Cachear `News` completo (com `content`). Rejeitada porque `content` é grande e raramente acessado; aumenta muito o uso de memória.
- **Decisão final:** Para `findById`/`findBySlug`, **manter busca direta no Firebase** por enquanto. O foco deste change é reduzir leituras em **listagens e busca**, não em detalhe. Detalhe é 1 leitura por request, aceitável. → **Ajustar escopo do proposal!**

### 5. `findLatest` (unpublished) consulta cache e filtra por `status`
- **Rationale:** Com `status` no cache, `findLatest` pode buscar todas as notícias no cache e filtrar por `status === unpublished` em memória. Zero leituras no Firebase.
- **Fallback:** Se cache vazio, fazer fallback para `newsRepo.findLatest(params)`.

### 6. `findLatest` (published) consulta cache e filtra por `status`; fallback se vazio
- **Rationale:** Hoje já usa cache, mas não faz fallback. Se cache expirar ou falhar, retorna `[]`. Adicionar fallback para Firebase quando cache vazio.

### 7. `search` consulta cache; fallback se vazio
- **Rationale:** `search` já usa cache, mas se cache vazio retorna `[]`. Adicionar fallback para `newsRepo.search()` quando cache vazio.

### 8. `warmUpNewsIndex` no startup continua ativo
- **Rationale:** Uma leitura no startup é aceitável. Como agora vai buscar todas as notícias (não só published), pode ser mais lenta, mas ainda é uma query única com `perPage=100000`.

## Risks / Trade-offs

- [Cache stale] Se uma notícia for editada no Firestore diretamente, o cache fica desatualizado. → Mitigação: cache é atualizado via API; TTL de 15 dias; warm-up no startup.
- [Cache vazio no meio da execução] Se o cache for invalidado/expirar, o fallback para Firebase deve funcionar. → Testar cenário de cache miss.
- [Memória] Cachear todas as notícias (incluindo unpublished) aumenta o tamanho do cache. → Mitigação: PreviewDTO é pequeno (sem `content`). Se crescer muito, pode-se limitar warm-up a published e manter fallback para unpublished.
- [Warm-up lento] Buscar todas as notícias no startup pode demorar se houver muitas. → Mitigação: uma query única; aceitável para o volume atual.
- [findById/findBySlug não otimizados] Decidimos manter busca direta no Firebase para detalhes. → Trade-off aceitável: 1 leitura por request é muito menor que listar todos.

## Migration Plan

1. Adicionar `status` ao `CachedNewsPreview` e `warmUpNewsIndex`
2. Mudar `warmUpNewsIndex` para buscar todas as notícias (sem filtro de status)
3. Atualizar `findLatest` no `NewsService` para consultar cache primeiro (todos os status), com fallback
4. Atualizar `search` no `NewsService` para fallback quando cache vazio
5. Decidir sobre `findById`/`findBySlug` — manter como está (Firebase direto) por enquanto
6. Testar endpoints de listagem, busca, criação, edição e deleção
7. Verificar que leituras no Firebase caíram para zero em listagens

## Open Questions

- O volume de notícias `unpublished` é grande o suficiente para justificar cacheá-las também? → Se sim, `warmUpNewsIndex` busca tudo. Se não, pode-se manter fallback para Firebase em `unpublished`.
- A resposta de `findById`/`findBySlug` deve ser otimizada? → Decisão: não neste change, foco é listagem/busca.
