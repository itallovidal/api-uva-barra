## 1. Validação

- [ ] 1.1 Adicionar `newsSearchQuerySchema` em `src/validation/news.ts` com campos `q` (string, min 1), `order` (enum `newest|oldest`, default `newest`), `page` (coerced number, default 1), `perPage` (coerced number, default 10, max 50)

## 2. Repository

- [ ] 2.1 Adicionar método `search(params: { q: string; order: "newest" | "oldest"; page: number; perPage: number }): Promise<{ items: News[]; total: number }>` à interface `NewsRepository` em `src/repository/news.ts`
- [ ] 2.2 Implementar `search` em `src/repository/in-memory/news.ts` — filtrar por `title` e `slug` contendo `q` (normalizado, case-insensitive), ordenar por `publishedAt`, paginar
- [ ] 2.3 Implementar `search` em `src/repository/firebase/news.ts` — buscar todas as notícias publicadas, filtrar em memória por substring normalizada em `title` e `slug`, ordenar por `publishedAt`, paginar

## 3. Service

- [ ] 3.1 Adicionar método `search` em `src/services/news.service.ts` — chamar `newsRepo.search(params)` e mapear `News[]` para `NewsPreviewDTO[]`, retornar `{ items: NewsPreviewDTO[]; total: number }`

## 4. Controller

- [ ] 4.1 Adicionar handler `searchNewsHandler` em `src/controllers/news.controller.ts` — validar query com `newsSearchQuerySchema`, chamar `deps.newsService.search`, retornar 200 com `data` e `meta`
- [ ] 4.2 Registrar rota `app.get("/news/search", searchNewsHandler)` antes das rotas com parâmetros dinâmicos para evitar conflito de roteamento

## 5. Documentação e testes HTTP

- [ ] 5.1 Atualizar `_docs/endpoints/news.md` adicionando a seção do endpoint `GET /news/search` com parâmetros, validações e exemplos de request/response
- [ ] 5.2 Adicionar casos de teste em `http/news.http` para `GET /news/search` (com `q`, com `order`, com paginação, sem `q`)
