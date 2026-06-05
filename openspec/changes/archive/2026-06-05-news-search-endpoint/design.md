## Context

O Firestore não suporta queries de `contains` (substring) nativamente. A abordagem escolhida é manter um índice leve de notícias em memória usando `@isaacs/ttlcache`, evitando fetch completo a cada requisição de busca.

## Goals / Non-Goals

**Goals:**
- Expor `GET /news/search?q=<term>` público e paginado
- Buscar notícias publicadas cujo `title` ou `slug` contenha o termo (case-insensitive, normalizado)
- Suportar ordenação via `order=newest` (default) | `order=oldest`
- Reutilizar o padrão de resposta paginada já existente (`NewsPreviewDTO[]` + `meta`)
- Cache de índice com TTL de 15 dias, warm-up no startup

**Non-Goals:**
- Busca em outros campos (`content`, `summary`, `tags`)
- Full-text search indexado (Algolia, Typesense, etc.)
- Autenticação — rota pública
- Invalidação granular por TTL (o vetor inteiro expira em bloco)

## Decisions

### 1. Estratégia de busca: índice cacheado em memória

**Escolhido:** Manter um vetor de `{ id, slug, title }` cacheado com `@isaacs/ttlcache` (TTL de 15 dias). A busca filtra esse vetor in-memory, extrai os `id`s que batem, e busca os documentos completos no Firebase via `findManyByIds`.

```
GET /news/search?q=termo
  │
  ├─ cacheService.get("news-index")        → NewsIndexEntry[] (re-popula se expirado)
  ├─ filter: entry.title.includes(q) || entry.slug.includes(q)   ← normalizado, lowercase
  ├─ extrai ids[]
  ├─ repo.findManyByIds(ids[])             → News[] do Firebase
  └─ mapeia → NewsPreviewDTO[] + pagina    → resposta
```

**Alternativas descartadas:**
- **Range query Firestore** (`where("title", ">=", q)`): só funciona para prefixo, não substring. Conflita com `orderBy("publishedAt")`.
- **Fetch all a cada request**: sem cache, escala mal e desperdiça banda/leitura do Firestore.
- **Algolia / Typesense**: fora de escopo para a escala atual.

### 2. Estrutura do índice cacheado

```ts
type NewsIndexEntry = {
  id: string;
  slug: string;
  title: string;
};
// Armazenado como: TTLCache key = "news-index", value = NewsIndexEntry[]
```

Uma única entrada no cache por namespace. Expiração em bloco: quando o TTL de 15 dias expira, o próximo acesso faz warm-up automático buscando todos os publicados no Firebase.

### 3. CacheService genérico

Um único `CacheService` gerencia múltiplos namespaces de cache via um `Map<string, TTLCache>` interno. Isso permite adicionar caches futuros (ex: `"categories-index"`) sem criar novos services.

```ts
// Assinatura do CacheService
interface CacheService {
  get<T>(namespace: string): T | undefined;
  set<T>(namespace: string, value: T, ttl?: number): void;
  update<T>(namespace: string, updater: (current: T | undefined) => T): void;
  delete(namespace: string): void;
  reset(namespace: string): void;
}
```

### 4. Warm-up eager no startup

O `app.ts` instancia o `CacheService` e chama `warmUpNewsIndex()` (método específico que busca todos os publicados e popula `"news-index"`) **antes** de o servidor começar a aceitar requisições. Garante que a primeira busca não seja lenta.

```
app.ts
  ├─ newsRepo = NewsFirebaseRepositoryFactory(db)
  ├─ cacheService = createCacheService()
  ├─ await cacheService.warmUpNewsIndex(newsRepo)   ← eager warm-up
  └─ newsService = createNewsService(newsRepo, cacheService)
```

### 5. Consistência do cache em mutações

| Operação | Comportamento do cache |
|---|---|
| `POST /news/` | Adiciona `{ id, slug, title }` ao vetor `"news-index"` |
| `DELETE /news/:id` | Remove a entrada com o `id` correspondente do vetor |
| `PUT /news/:id` | **Não altera o cache** — mudanças de slug/title são raras; o TTL de 15 dias garante consistência eventual |

### 6. `findManyByIds` no repositório Firebase

Novo método que busca múltiplos documentos por ID em paralelo via `Promise.all`. Para volumes maiores pode ser migrado para queries Firestore com `in` (limite de 10 por chunk — implementar chunking se necessário).

```ts
findManyByIds(ids: string[]): Promise<News[]>
```

### 7. HTTP Method: GET

Busca é uma operação de leitura idempotente. Parâmetros via query string (`?q=`) são idiomáticos para search endpoints REST.

### 8. Retornar `NewsPreviewDTO` (não `News` completo)

Consistente com `findLatest`. O service mapeia `News → NewsPreviewDTO` antes de retornar. Evita trafegar `content` (campo pesado) em listagens.

## Risks / Trade-offs

- **[Performance — warm-up]** O startup faz um fetch de todos os publicados no Firebase. Aceitável para a escala atual; pode ser lazy se o volume crescer muito.
- **[Consistência eventual — update]** Mudanças de `slug` ou `title` só refletem no cache após expiração do TTL de 15 dias. Decisão consciente: esses campos raramente mudam.
- **[Volume de IDs]** Se a busca retornar muitos IDs, `findManyByIds` com `Promise.all` pode gerar muitas leituras paralelas no Firestore. Mitigação: paginação antes do fetch (só busca os IDs da página atual).
