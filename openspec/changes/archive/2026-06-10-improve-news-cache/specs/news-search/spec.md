## MODIFIED Requirements

### Requirement: Busca de notícias por termo
O sistema SHALL expor o endpoint `GET /news/search?q=<term>` que retorna notícias publicadas cujo `title` ou `slug` contenha o termo informado (busca case-insensitive, insensível a acentos). Apenas notícias com `status === "published"` são incluídos nos resultados. **A fonte de dados passa a ser o cache em memória; o endpoint não consulta o Firebase Firestore para busca.**

#### Scenario: Busca com termo que corresponde ao título
- **WHEN** o cliente envia `GET /news/search?q=educação`
- **THEN** o sistema retorna 200 com array de `NewsPreviewDTO` cujos títulos contêm "educação" (case e acento insensitive), proveniente do cache

#### Scenario: Busca com termo que corresponde ao slug
- **WHEN** o cliente envia `GET /news/search?q=semana-de`
- **THEN** o sistema retorna 200 com array de `NewsPreviewDTO` cujos slugs contêm "semana-de", proveniente do cache

#### Scenario: Busca sem resultados
- **WHEN** o cliente envia `GET /news/search?q=termoquenaoemxiste`
- **THEN** o sistema retorna 200 com `data: []` e `meta.total: 0`, sem consultar o Firebase Firestore

#### Scenario: Busca sem parâmetro `q`
- **WHEN** o cliente envia `GET /news/search` sem o parâmetro `q`
- **THEN** o sistema retorna 400 com `error.code: "VALIDATION_ERROR"`

#### Scenario: Busca com `q` vazio
- **WHEN** o cliente envia `GET /news/search?q=`
- **THEN** o sistema retorna 400 com `error.code: "VALIDATION_ERROR"`

### Requirement: Ordenação dos resultados de busca
O sistema SHALL aceitar o parâmetro `order` na query string com valores `newest` (default) e `oldest`. `newest` ordena por `publishedAt` decrescente; `oldest` ordena por `publishedAt` crescente.

#### Scenario: Ordenação padrão (newest)
- **WHEN** o cliente envia `GET /news/search?q=uva` sem `order`
- **THEN** o sistema retorna os resultados ordenados por `publishedAt` descendente, proveniente do cache

#### Scenario: Ordenação explícita por mais antigo
- **WHEN** o cliente envia `GET /news/search?q=uva&order=oldest`
- **THEN** o sistema retorna os resultados ordenados por `publishedAt` ascendente, proveniente do cache

#### Scenario: Valor de `order` inválido
- **WHEN** o cliente envia `GET /news/search?q=uva&order=random`
- **THEN** o sistema retorna 400 com `error.code: "VALIDATION_ERROR"`

### Requirement: Paginação dos resultados de busca
O sistema SHALL paginar os resultados de busca com os parâmetros `page` (default `1`) e `perPage` (default `10`, máximo `50`). A resposta SHALL incluir o envelope `meta` com `page`, `perPage`, `total` e `totalPages`.

#### Scenario: Resultado paginado
- **WHEN** o cliente envia `GET /news/search?q=uva&page=2&perPage=5`
- **THEN** o sistema retorna 200 com até 5 itens da página 2 e `meta` correto, proveniente do cache

#### Scenario: `perPage` acima do limite
- **WHEN** o cliente envia `GET /news/search?q=uva&perPage=100`
- **THEN** o sistema retorna 400 com `error.code: "VALIDATION_ERROR"`

### Requirement: Formato de resposta de busca
O sistema SHALL retornar resultados no formato `NewsPreviewDTO[]` — o mesmo shape de `GET /news/latest` — envelopado em `ResponsePayload` com `status: 200` e campo `meta`. **O campo `authorName` foi renomeado para `author` para alinhar com a entidade `News`.**

#### Scenario: Shape da resposta bem-sucedida
- **WHEN** uma busca retorna resultados
- **THEN** cada item contém `id`, `title`, `summary`, `coverImageUrl`, `category`, `tags`, `featured`, `readingTime`, `publishedAt`, `author`

### Requirement: Sincronização da documentação de busca
Toda mudança no input (`q`, `order`, `page`, `perPage`) ou no output do endpoint de busca DEVE ser refletida em `_docs/endpoints/news.md` no mesmo PR.

#### Scenario: Atualização de parâmetros de busca
- **WHEN** o schema de validação `newsSearchQuerySchema` é modificado
- **THEN** a seção do endpoint `GET /news/search` em `_docs/endpoints/news.md` é atualizada no mesmo PR
