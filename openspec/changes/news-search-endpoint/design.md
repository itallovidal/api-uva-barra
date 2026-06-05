## Context

O Firestore (Firebase) não suporta queries de `contains` (substring) nativamente. Só suporta igualdade exata (`==`) e range queries (prefixo). Para busca por substring em `title` e `slug`, a abordagem mais pragmática para a escala atual é buscar todas as notícias publicadas e filtrar em memória no servidor.

## Goals / Non-Goals

**Goals:**
- Expor `GET /news/search?q=<term>` público e paginado
- Buscar notícias publicadas cujo `title` ou `slug` contenha o termo (case-insensitive)
- Suportar ordenação via `order=newest` (default) | `order=oldest`
- Reutilizar o padrão de resposta paginada já existente (`NewsPreviewDTO[]` + `meta`)

**Non-Goals:**
- Busca em outros campos (`content`, `summary`, `tags`)
- Full-text search indexado (Algolia, Typesense, etc.)
- Autenticação — rota pública

## Decisions

### 1. HTTP Method: GET (não POST)
Busca é uma operação de leitura idempotente. Parâmetros via query string (`?q=`) são idiomáticos para search endpoints REST. POST seria inadequado aqui pois não há body semântico.

### 2. Estratégia de busca no Firestore: fetch + filter in-memory
**Escolhido:** Buscar todas as notícias publicadas (`where("status", "==", "published")`) e filtrar em memória por substring.

**Alternativas consideradas:**
- **Range query Firestore** (`where("title", ">=", q).where("title", "<=", q + "\uf8ff")`): só funciona para prefixo, não substring. Além disso, conflita com `orderBy("publishedAt")` — Firestore exige que o `orderBy` use o mesmo campo do range filter.
- **Algolia / Typesense**: full-text search real, mas dependência externa fora de escopo agora.

**Limitação documentada:** abordagem não escala bem além de ~1 000 documentos. Aceita para a escala atual da aplicação.

### 3. Assinatura do método `search` na interface `NewsRepository`

```ts
search(params: {
  q: string;
  order: "newest" | "oldest";
  page: number;
  perPage: number;
}): Promise<{ items: News[]; total: number }>
```

Retorna `items` já mapeados para `News` e `total` para paginação. Filtragem, ordenação e paginação ocorrem dentro do repositório.

### 4. Retornar `NewsPreviewDTO` (não `News` completo)
Consistente com `findLatest`. O service mapeia `News → NewsPreviewDTO` antes de retornar ao controller. Evita trafegar `content` (campo pesado) em listagens.

### 5. Parâmetro `order`
- `newest` (default): ordena por `publishedAt` desc
- `oldest`: ordena por `publishedAt` asc
- Validação via Zod enum com default `newest`

## Risks / Trade-offs

- **[Performance]** Fetch in-memory de todas as notícias publicadas → Mitigação: documentar limite e planejar migração para full-text search quando necessário
- **[Consistência]** Busca case-insensitive via `.toLowerCase().includes()` pode não normalizar acentos → Mitigação: usar `.normalize("NFD")` para remover diacríticos antes de comparar, igual ao `slugify` existente
