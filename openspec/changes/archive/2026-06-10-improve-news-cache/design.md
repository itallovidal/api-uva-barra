## Context

Hoje o cache de notícias (`CacheService`) está desativado — a chamada `warmUpNewsIndex` está comentada no `app.ts` e no `NewsService`. Quando ativo, o cache armazena apenas `id`, `slug` e `title` (`NewsIndexEntry`), o que obriga os endpoints de listagem e busca a consultarem o Firebase para montar `NewsPreviewDTO`. O `findManyByIds` do Firebase executa N queries paralelas (`Promise.all(ids.map(...))`), amplificando a carga no Firestore.

A aplicação serve listagens públicas (`/news`, `/news/category/:category`, `/news/search`) que são acessadas com alta frequência. Reduzir leituras ao Firestore nesses endpoints é essencial para evitar quota diária.

## Goals / Non-Goals

**Goals:**
- Cache em memória armazena `NewsPreviewDTO` completo para todas as notícias publicadas
- Aplicação faz warm-up do cache automaticamente no startup
- Endpoints de listagem e busca usam cache como fonte primária, sem consultar Firebase
- Notícia completa (incluindo `content`) só é buscada no Firebase quando acessada por `id` ou `slug`
- Cache é invalidado corretamente em `create`, `update` e `delete`

**Non-Goals:**
- Cache distribuído entre instâncias (continua in-memory, TTLCache)
- Cache de notícias não-publicadas (draft, review, archived)
- Mudanças no contrato de API ou nos schemas de validação Zod
- Otimização de `findManyByIds` (não bloqueante, mas pode ser feito depois)

## Decisions

### 1. Cache armazena `NewsPreviewDTO[]` ao invés de `NewsIndexEntry[]`
- **Rationale:** `NewsIndexEntry` só tinha `id`, `slug`, `title`. Para evitar N consultas ao Firebase, o cache precisa ter todos os campos de `NewsPreviewDTO`. Isso transforma `findLatest` e `search` em operações puramente em memória.
- **Alternativa considerada:** Manter `NewsIndexEntry` e usar `findManyByIds` otimizado. Rejeitada porque ainda exige round-trip ao Firestore, não resolve o problema de quota.

### 2. `warmUpNewsIndex` é chamada no startup (`app.ts`) e executa uma única leitura paginada no Firestore
- **Rationale:** Uma leitura no startup é aceitável e garante que o cache esteja populado antes do primeiro request. `findLatest` com `perPage=100000` e `status=PUBLISHED` já busca tudo.
- **Alternativa considerada:** Lazy warm-up no primeiro request. Rejeitada porque causaria cold start lento e cache miss no primeiro acesso.

### 3. `findLatest` e `search` no `NewsService` passam a consultar o cache primeiro
- **Rationale:** O cache contém `NewsPreviewDTO` com todos os campos necessários para listagem e busca. `search` filtra por `title` e `slug` diretamente no array em memória.
- **Alternativa considerada:** Manter `findLatest` no Firebase e usar cache apenas para `search`. Rejeitada porque `findLatest` é o endpoint mais acessado e também precisa de cache.

### 4. `findById` e `findBySlug` continuam buscando no Firebase (notícia completa)
- **Rationale:** Esses endpoints retornam `News` (com `content`), que não precisa estar no cache de preview. Manter separação reduz uso de memória.
- **Alternativa considerada:** Cache de notícia completa. Rejeitada porque aumenta memória e `content` não é usado em listagens.

### 5. Invalidação de cache síncrona no `NewsService`
- **Rationale:** `create`, `update`, `delete` já manipulam o cache via `update()`. Com preview completo, `update` precisa re-ler do Firebase para obter o `NewsPreviewDTO` atualizado, ou aplicar o delta.
- **Alternativa considerada:** Invalidar completamente e re-warm-up. Rejeitada porque é mais lenta; preferimos atualizar o item específico no cache.

### 6. Renomear `authorName` para `author` no `NewsPreviewDTO`
- **Rationale:** A entidade `News` usa `author`. O DTO usava `authorName` sem motivo. Alinhar nomes evita confusão e mapeamento desnecessário.
- **BREAKING:** Consumidores da API que esperam `authorName` precisam ajustar para `author`.

## Risks / Trade-offs

- [Cache stale] Se uma notícia for editada no Firestore diretamente (fora da API), o cache ficará desatualizado até restart ou invalidação. → Mitigação: cache tem TTL de 15 dias; aceitável para esse caso de uso.
- [Memória] Cachear preview de todas as notícias pode crescer. → Mitigação: PreviewDTO é pequeno (sem `content`). Se necessário, TTL de 15 dias limita o acúmulo; não publicadas não entram.
- [Warm-up lento] Se houver muitas notícias, `warmUpNewsIndex` pode demorar. → Mitigação: `findLatest` no Firestore com `perPage=100000` é uma query única; aceitável.
- [Campo renomeado] Renomear `authorName` para `author` é breaking para clientes. → Mitigação: Ajuste coordenado com frontend.

## Migration Plan

1. Ajustar `NewsPreviewDTO` (`authorName` → `author`)
2. Ajustar `CacheService` para usar `NewsPreviewDTO[]` e ativar `warmUpNewsIndex`
3. Ajustar `NewsService` para usar cache em `findLatest` e `search`
4. Ajustar `app.ts` para descomentar `warmUpNewsIndex`
5. Testar endpoints de listagem, busca, criação, edição e deleção
6. Ajustar frontend para usar `author` ao invés de `authorName` (coordenado)

## Open Questions

- Nenhuma. Decisões claras com base no contexto atual.
