# Notícias (News)

**Versão:** 1.0
**Data:** 2026-06-04

## Visão Geral

Endpoints para gerenciamento de notícias. Operações de criação, edição e remoção são protegidas (autenticação JWT). Listagem e leitura são públicas.

## Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | `/news` | JWT (Bearer) | Criar nova notícia |
| GET | `/news/:id` | Nenhuma | Buscar notícia por ID |
| GET | `/news/slug/:slug` | Nenhuma | Buscar notícia por slug |
| PUT | `/news/:id` | JWT (Bearer) | Atualizar notícia |
| DELETE | `/news/:id` | JWT (Bearer) | Remover notícia |
| GET | `/news` | `status=published`: Nenhuma; `status=unpublished`: JWT Bearer | Listar notícias com filtro de publicação (paginado) |
| GET | `/news/category/:category` | `status=published`: Nenhuma; `status=unpublished`: JWT Bearer | Listar notícias por categoria com filtro de publicação (paginado) |
| GET | `/news/search` | Nenhuma | Buscar notícias por termo (paginado) |

## Detalhamento

### `POST /news`

Cria uma nova notícia.

**Request body:**

```json
{
  "title": "Título da Notícia",
  "summary": "Resumo curto do artigo",
  "content": "Conteúdo completo do artigo...",
  "coverImageUrl": "https://exemplo.com/capa.jpg",
  "category": "tecnologia",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "status": "draft",
  "slug": "titulo-da-noticia",
  "author": "Nome do Autor"
}
```

**Campos:**
- `title` (string, obrigatório) — Título da notícia
- `summary` (string, obrigatório) — Resumo curto
- `content` (string, obrigatório) — Conteúdo completo
- `coverImageUrl` (string, opcional, default `""`) — URL da imagem de capa
- `category` (string, obrigatório) — Categoria da notícia
- `tags` (string[], opcional, default `[]`) — Tags associadas
- `featured` (boolean, opcional, default `false`) — Destaque
- `status` (enum: `draft | review | published | archived`, obrigatório) — Status
- `slug` (string, opcional) — Slug personalizado; gerado via `slugify(title)` se omitido
- `author` (string, opcional) — Nome do autor

**Validação:** `src/validation/news.ts` — `createNewsSchema`

**Resposta (201 Created):**

```json
{
  "status": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Título da Notícia",
    "slug": "titulo-da-noticia",
    "summary": "Resumo curto do artigo",
    "content": "Conteúdo completo do artigo...",
    "coverImageUrl": "https://exemplo.com/capa.jpg",
    "category": "tecnologia",
    "author": "Nome do Autor",
    "status": "draft",
    "tags": ["tag1", "tag2"],
    "featured": false,
    "readingTime": 3,
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-06-04T10:00:00.000Z",
    "publishedAt": null
  }
}
```

**Resposta (400 Bad Request):**

```json
{
  "status": 400,
  "data": null,
  "error": {
    "message": "Dados inválidos",
    "code": "VALIDATION_ERROR"
  }
}
```

### `GET /news/:id`

Busca uma notícia pelo ID.

**Parâmetros:**
- `id` (string, uuid) — ID da notícia

**Validação:** `src/validation/news.ts` — `newsParamsSchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Título da Notícia",
    "slug": "titulo-da-noticia",
    "summary": "Resumo curto do artigo",
    "content": "Conteúdo completo do artigo...",
    "coverImageUrl": "https://exemplo.com/capa.jpg",
    "category": "tecnologia",
    "author": "Nome do Autor",
    "status": "published",
    "tags": ["tag1", "tag2"],
    "featured": false,
    "readingTime": 3,
    "createdAt": "2026-06-04T10:00:00.000Z",
    "updatedAt": "2026-06-04T10:00:00.000Z",
    "publishedAt": "2026-06-04T12:00:00.000Z"
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Notícia não encontrada",
    "code": "NOT_FOUND"
  }
}
```

### `GET /news/slug/:slug`

Busca uma notícia pelo slug.

**Parâmetros:**
- `slug` (string) — Slug da notícia

**Validação:** `src/validation/news.ts` — `newsSlugSchema`

**Resposta (200 OK):** Mesmo formato de `GET /news/:id`.

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Notícia não encontrada",
    "code": "NOT_FOUND"
  }
}
```

### `PUT /news/:id`

Atualiza uma notícia existente. Todos os campos são opcionais (parcial).

**Parâmetros:**
- `id` (string, uuid) — ID da notícia

**Request body (todos opcionais):**

```json
{
  "title": "Título Atualizado",
  "summary": "Resumo atualizado",
  "content": "Conteúdo atualizado...",
  "coverImageUrl": "https://exemplo.com/nova-capa.jpg",
  "category": "nova-categoria",
  "tags": ["tag1", "tag3"],
  "featured": true,
  "status": "published",
  "slug": "titulo-atualizado",
  "author": "Outro Autor"
}
```

**Validação:** `src/validation/news.ts` — `newsParamsSchema` + `updateNewsSchema`

**Resposta (200 OK):** Mesmo formato de criação com dados atualizados.

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Notícia não encontrada",
    "code": "NOT_FOUND"
  }
}
```

### `DELETE /news/:id`

Remove uma notícia.

**Parâmetros:**
- `id` (string, uuid) — ID da notícia

**Validação:** `src/validation/news.ts` — `newsParamsSchema`

**Resposta (204 No Content):**

```json
{
  "status": 204
}
```

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Notícia não encontrada",
    "code": "NOT_FOUND"
  }
}
```

### `GET /news/search`

Busca notícias publicadas por palavra-chave no título ou slug. Retorna resultados ordenados por data de publicação.

**Query params:**
- `q` (string, obrigatório) — Termo de busca (mínimo 1 caractere)
- `order` (string, opcional, default `newest`) — Ordenação: `newest` (mais recente primeiro) ou `oldest` (mais antigo primeiro)
- `page` (number, opcional, coerced, default `1`) — Página atual
- `perPage` (number, opcional, coerced, default `10`, max `50`) — Itens por página

**Validação:** `src/validation/news.ts` — `newsSearchQuerySchema`

**Resposta (200 OK):** Mesmo formato de `/news`. Retorna array vazio em `data` se nenhum resultado for encontrado.

**Resposta (400 Bad Request):**

```json
{
  "status": 400,
  "data": null,
  "error": {
    "message": "Parâmetros de busca inválidos",
    "code": "VALIDATION_ERROR"
  }
}
```

### `GET /news`

Lista notícias com filtro de publicação. Por padrão, retorna apenas artigos publicados. Registros antigos sem `status` salvo são tratados como `published` na leitura. A consulta `status=unpublished` exige autenticação JWT.

**Query params:**
- `page` (number, opcional, coerced, default `1`) — Página atual
- `perPage` (number, opcional, coerced, default `10`, max `50`) — Itens por página
- `status` (string, opcional, default `published`) — `published` ou `unpublished`

**Validação:** `src/validation/news.ts` — `newsListQuerySchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Título da Notícia",
      "summary": "Resumo curto",
      "coverImageUrl": "https://exemplo.com/capa.jpg",
      "category": "tecnologia",
      "tags": ["tag1", "tag2"],
      "featured": false,
      "readingTime": 3,
      "publishedAt": "2026-06-04T12:00:00.000Z",
      "authorName": "Nome do Autor"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### `GET /news/category/:category`

Lista notícias por categoria com filtro de publicação. Por padrão, retorna apenas artigos publicados. Registros antigos sem `status` salvo são tratados como `published` na leitura. A consulta `status=unpublished` exige autenticação JWT.

**Parâmetros:**
- `category` (string) — Categoria para filtrar

**Query params:**
- `page` (number, opcional, coerced, default `1`) — Página atual
- `perPage` (number, opcional, coerced, default `10`, max `50`) — Itens por página
- `status` (string, opcional, default `published`) — `published` ou `unpublished`

**Validação:** `src/validation/news.ts` — `newsListQuerySchema`

**Resposta (200 OK):** Mesmo formato de `/news`, filtrado pela categoria.

## Validações aplicadas

| Schema | Arquivo | Descrição |
|--------|---------|-----------|
| `createNewsSchema` | `src/validation/news.ts` | Valida body de criação de notícia |
| `updateNewsSchema` | `src/validation/news.ts` | Valida body de atualização (parcial) |
| `newsParamsSchema` | `src/validation/news.ts` | Valida `id` como UUID |
| `newsSlugSchema` | `src/validation/news.ts` | Valida `slug` como string |
| `newsListQuerySchema` | `src/validation/news.ts` | Valida `page`, `perPage` e `status` para listagem |
| `newsSearchQuerySchema` | `src/validation/news.ts` | Valida `q`, `order`, `page` e `perPage` |

## Tipos e DTOs

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| `News` | `src/types/news/entities.ts` | Entidade completa da notícia |
| `NewsStatus` | `src/types/news/entities.ts` | Enum: `draft`, `review`, `published`, `archived` |
| `CreateNewsDTO` | `src/types/news/dtos.ts` | DTO de criação |
| `NewsPreviewDTO` | `src/types/news/dtos.ts` | DTO de listagem (preview) |

## Comportamentos importantes

- Listagens (`/news` e `/news/category/:category`) aceitam `status=published|unpublished`; por padrão retornam artigos publicados.
- Registros sem `status` salvo são normalizados como `published` na leitura.
- `slug` é gerado automaticamente via `slugify(title)` se não fornecido.
- `readingTime` é calculado automaticamente por `calculateReadingTime(content)`.
- Ao criar/atualizar: se `status` passar para `published` e `publishedAt` for nulo, o repositório define `publishedAt = now`.

## Arquivos relevantes

- `src/controllers/news.controller.ts` — handlers de rota
- `src/services/news.service.ts` — lógica de negócio
- `src/repository/news.ts` — interface do repositório
- `src/types/news/entities.ts` — definição de `News` e `NewsStatus`
- `src/types/news/dtos.ts` — `CreateNewsDTO` e `NewsPreviewDTO`
- `src/validation/news.ts` — schemas Zod
- `src/utils/news-utils.ts` — `slugify`, `calculateReadingTime` e normalização de status de notícia
