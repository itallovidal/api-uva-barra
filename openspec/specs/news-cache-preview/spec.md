## Purpose
This specification covers the capabilities for caching news articles in memory to avoid excessive Firebase Firestore reads.

## Requirements

### Requirement: Cache de previews no startup
O cache de notícias (`news-index`) SHALL ser populado automaticamente durante o startup da aplicação com todos os `NewsPreviewDTO` de notícias publicadas (`status === "published"`).

#### Scenario: Warm-up no startup
- **WHEN** a aplicação inicia
- **THEN** o cache `news-index` contém um array de `NewsPreviewDTO` com todas as notícias publicadas

#### Scenario: Cache pronto antes do primeiro request
- **WHEN** o primeiro request de listagem ou busca é recebido
- **THEN** o cache já está populado e não há cache miss

### Requirement: Cache como fonte primária para listagem
O endpoint `GET /news` SHALL retornar resultados diretamente do cache em memória, sem consultar o Firebase Firestore.

#### Scenario: Listagem via cache
- **WHEN** um cliente envia `GET /news`
- **THEN** o sistema retorna 200 com `NewsPreviewDTO[]` proveniente do cache, ordenado por `publishedAt` descendente

#### Scenario: Listagem por categoria via cache
- **WHEN** um cliente envia `GET /news/category/:category`
- **THEN** o sistema retorna 200 com `NewsPreviewDTO[]` filtrado por categoria, proveniente do cache

#### Scenario: Paginação via cache
- **WHEN** um cliente envia `GET /news?page=2&perPage=5`
- **THEN** o sistema retorna a página correta baseada no array em cache, sem consultar Firebase

### Requirement: Cache como fonte primária para busca
O endpoint `GET /news/search` SHALL retornar resultados diretamente do cache em memória, filtrando por `title` ou `slug` (case-insensitive, sem acentos).

#### Scenario: Busca via cache
- **WHEN** um cliente envia `GET /news/search?q=educação`
- **THEN** o sistema retorna 200 com `NewsPreviewDTO[]` cujos `title` ou `slug` contêm o termo, sem consultar Firebase

#### Scenario: Busca sem resultados via cache
- **WHEN** um cliente envia `GET /news/search?q=termoinexistente`
- **THEN** o sistema retorna 200 com `data: []` e `meta.total: 0`, sem consultar Firebase

### Requirement: Invalidação do cache em mutações
O cache `news-index` SHALL ser atualizado quando uma notícia publicada é criada, editada ou deletada.

#### Scenario: Criação invalida cache
- **WHEN** uma notícia com `status === "published"` é criada via `POST /news`
- **THEN** o cache `news-index` é atualizado para incluir o novo `NewsPreviewDTO`

#### Scenario: Deleção invalida cache
- **WHEN** uma notícia é deletada via `DELETE /news/:id`
- **THEN** o cache `news-index` é atualizado para remover o `NewsPreviewDTO` correspondente

#### Scenario: Update altera cache
- **WHEN** uma notícia publicada é editada via `PUT /news/:id`
- **THEN** o cache `news-index` é atualizado para refletir os novos dados do `NewsPreviewDTO`

### Requirement: Busca completa por id ou slug
Endpoints `GET /news/:id` e `GET /news/slug/:slug` SHALL continuar buscando a notícia completa no Firebase Firestore, incluindo o campo `content`.

#### Scenario: Busca por id usa Firebase
- **WHEN** um cliente envia `GET /news/:id`
- **THEN** o sistema consulta o Firebase Firestore e retorna o objeto `News` completo

#### Scenario: Busca por slug usa Firebase
- **WHEN** um cliente envia `GET /news/slug/:slug`
- **THEN** o sistema consulta o Firebase Firestore e retorna o objeto `News` completo

### Requirement: Formato de resposta do preview
O `NewsPreviewDTO` SHALL conter `id`, `title`, `summary`, `coverImageUrl`, `category`, `tags`, `featured`, `readingTime`, `publishedAt`, `author`.

#### Scenario: Shape do preview
- **WHEN** qualquer endpoint de listagem ou busca retorna resultados
- **THEN** cada item contém `id`, `title`, `summary`, `coverImageUrl`, `category`, `tags`, `featured`, `readingTime`, `publishedAt`, `author`

#### Scenario: Campo author renomeado
- **WHEN** o sistema serializa um `NewsPreviewDTO`
- **THEN** o campo é `author` e não `authorName`
