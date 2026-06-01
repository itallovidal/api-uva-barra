# Notícias (News)

**Versão:** 1.0  
**Data:** 2026-06-01

## Visão Geral

Esta documentação descreve o módulo de Notícias (News): como criar, atualizar, deletar e listar artigos via API. Os artigos possuem lifecycle (draft → review → published → archived). Endpoints para criação/edição/remover são protegidos; listagem e leitura são públicas.

## Papéis e Permissões

- `admin`: pode criar, atualizar e deletar artigos (`POST`, `PUT`, `DELETE`). As rotas já exigem autenticação via `authMiddleware`, mas recomenda-se checar explicitamente `request.user.role === 'admin'` antes de permitir alterações.
- Público: pode listar e visualizar notícias publicadas (`GET /news/latest`, `GET /news/:id`).

## Endpoints

- POST /news — Permissão: admin (autenticado)
  - Cria um artigo. Body: `CreateNewsDTO`.
  - Resposta: 201 Created com o objeto `News` criado.

- GET /news/:id — Permissão: pública
  - Retorna o artigo completo (campo `content`, `readingTime`, etc.).

- PUT /news/:id — Permissão: admin (autenticado)
  - Atualiza campos do artigo. Body: `Partial<CreateNewsDTO>` (usa `updateNewsSchema`).

- DELETE /news/:id — Permissão: admin (autenticado)
  - Remove o artigo.

- GET /news/latest?page=&perPage= — Permissão: pública
  - Retorna previews de notícias publicadas ordenadas por `publishedAt` desc. Resposta inclui `meta` com paginação.

- GET /news/latest/:category?page=&perPage= — Permissão: pública
  - Filtra por `category` e devolve previews paginados.

## Tipos e DTOs

- Tipos principais: `src/types/news/entities.ts` (`News`, `NewsStatus`) e `src/types/news/dtos.ts` (`CreateNewsDTO`, `NewsPreviewDTO`).

- `CreateNewsDTO` (campos obrigatórios):

```json
{
  "title": "Título da notícia",
  "summary": "Resumo curto",
  "content": "Conteúdo completo",
  "coverImageUrl": "https://.../capa.jpg",
  "category": "categoria-exemplo",
  "tags": ["tag1", "tag2"],
  "featured": false,
  "status": "draft|review|published|archived"
}
```

- `News` (exemplo parcial de resposta):

```json
{
  "id": "uuid",
  "title": "Título",
  "slug": "titulo",
  "summary": "Resumo",
  "content": "Conteúdo...",
  "coverImageUrl": "https://.../capa.jpg",
  "category": "categoria-exemplo",
  "author": "Nome do autor",
  "status": "published",
  "tags": ["x","y"],
  "featured": false,
  "readingTime": 3,
  "createdAt": "2026-06-01T00:00:00.000Z",
  "updatedAt": "2026-06-01T00:00:00.000Z",
  "publishedAt": "2026-06-01T00:00:00.000Z"
}
```

- `NewsPreviewDTO` (listagem): contém `id`, `title`, `summary`, `coverImageUrl`, `category`, `tags`, `featured`, `readingTime`, `publishedAt`, `authorName`.

## Validações aplicadas

- `src/validation/news.ts` define as validações (Zod):
  - `title`, `summary`, `content`, `category` são strings obrigatórias.
  - `coverImageUrl` deve ser uma URL válida.
  - `tags` é array de strings (padrão: []).
  - `featured` boolean (padrão: false).
  - `status` deve ser um dos valores de `NewsStatus` (`draft`, `review`, `published`, `archived`).
  - `page` e `perPage` são coerced numbers com limites (perPage máximo 50).

## Comportamentos importantes

- Listagens (`/news/latest`) retornam APENAS artigos com `status === 'published'` e ordenados por `publishedAt` desc.
- `slug` é gerado automaticamente (ex.: `slugify(title)`).
- `readingTime` é calculado automaticamente por `calculateReadingTime(content)` (em `src/utils/news-utils.ts`).
- Ao criar/atualizar: se `status` passar para `published` e `publishedAt` ainda for nulo, o repositório define `publishedAt = now`.
- Implementação atual em memória (`src/repository/in-memory/news.ts`) define `author` como string vazia no momento da criação; recomenda-se popular `author` com o usuário autenticado nas rota protegidas.

## Exemplos de resposta de listagem

```json
{
  "status": 200,
  "data": [ /* array de NewsPreviewDTO */ ],
  "meta": { "page": 1, "perPage": 10, "total": 42, "totalPages": 5 }
}
```

## Observações e recomendações

- Verificar `request.user.role` nas rotas protegidas e retornar `403 Forbidden` quando o usuário não for `admin`.
- Garantir unicidade de `slug` quando necessário (evitar colisões ao criar artigos com títulos iguais).
- Incluir auditoria (quem criou/atualizou/deletou) para rastreabilidade.
- Adicionar testes automatizados cobrindo: criação, atualização, deleção, publicação (publishedAt), e listagem paginada/por categoria.
- Caching (ex.: CDN ou cache no serviço) para endpoints de listagem pode melhorar performance para conteúdo publicado.

## Arquivos relevantes

- `src/controllers/news.controller.ts` — handlers de rota
- `src/services/news.service.ts` — lógica de negócio e mapeamento `News` → `NewsPreviewDTO`
- `src/repository/news.ts` — interface do repositório
- `src/repository/in-memory/news.ts` — implementação em memória (exemplo)
- `src/types/news/entities.ts` — definição de `News` e `NewsStatus`
- `src/types/news/dtos.ts` — `CreateNewsDTO` e `NewsPreviewDTO`
- `src/validation/news.ts` — validações Zod para entrada e query params
