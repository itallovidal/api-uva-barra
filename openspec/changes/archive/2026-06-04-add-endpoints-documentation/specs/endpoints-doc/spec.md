## ADDED Requirements

### Requirement: Documentacão de rotas de Healthcheck
O sistema SHALL documentar a rota `GET /health` com método, path, ausência de autenticação, ausência de parâmetros, e formato da resposta de sucesso (`status`, `data.status`, `data.uptime`, `data.timestamp`).

#### Scenario: Leitura da documentacão de healthcheck
- **WHEN** um desenvolvedor acessa `_docs/endpoints/healthcheck.md`
- **THEN** o arquivo contém a rota `GET /health` documentada com request e response

### Requirement: Documentacão de rotas de Category
O sistema SHALL documentar todas as rotas de categoria (`POST /categories`, `GET /categories`, `GET /categories/:id`, `PUT /categories/:id`, `DELETE /categories/:id`) com método, path, schemas de validação, parâmetros, body, e respostas de sucesso e erro.

#### Scenario: Leitura da documentacão de categories
- **WHEN** um desenvolvedor acessa `_docs/endpoints/category.md`
- **THEN** o arquivo contém as 5 rotas de categoria documentadas

### Requirement: Documentacão de rotas de News
O sistema SHALL documentar todas as rotas de news (`POST /news`, `GET /news/:id`, `GET /news/slug/:slug`, `PUT /news/:id`, `DELETE /news/:id`, `GET /news/latest`, `GET /news/latest/:category`) com método, path, autenticação, schemas, parâmetros, body, query, e respostas.

#### Scenario: Leitura da documentacão de news
- **WHEN** um desenvolvedor acessa `_docs/endpoints/news.md`
- **THEN** o arquivo contém as 7 rotas de news documentadas

### Requirement: Documentacão de rotas de Registration
O sistema SHALL documentar todas as rotas de registration (`POST /registration/`, `GET /registration/requests`, `POST /registration/:id/approve`, `POST /registration/:id/reject`) com método, path, autenticação, schemas, parâmetros, body, query, e respostas.

#### Scenario: Leitura da documentacão de registration
- **WHEN** um desenvolvedor acessa `_docs/endpoints/registration.md`
- **THEN** o arquivo contém as 4 rotas de registration documentadas

### Requirement: Documentacão de rotas de User
O sistema SHALL documentar todas as rotas de user (`POST /user/login`, `POST /user/`, `GET /user/:id`, `GET /user/email/:email`, `PUT /user/:id`, `DELETE /user/:id`) com método, path, autenticação, schemas, parâmetros, body, e respostas.

#### Scenario: Leitura da documentacão de user
- **WHEN** um desenvolvedor acessa `_docs/endpoints/user.md`
- **THEN** o arquivo contém as 6 rotas de user documentadas

### Requirement: Consistência de formato
Cada arquivo de documentacão SHALL seguir a mesma estrutura: título, visão geral, tabela resumo de endpoints, seção detalhada por endpoint com request/response em exemplos JSON, tabela de tipos/DTOs, validações aplicadas, e arquivos relevantes.

#### Scenario: Verificação de formato consistente
- **WHEN** um desenvolvedor inspeciona qualquer arquivo em `_docs/endpoints/`
- **THEN** o arquivo segue o mesmo padrão de formatação dos demais

### Requirement: Mapeamento para código-fonte
Cada documento SHALL incluir uma seção "Arquivos relevantes" que lista os caminhos dos controllers, services, types, e validation schemas correspondentes.

#### Scenario: Verificação de referências a código-fonte
- **WHEN** um desenvolvedor le a seção "Arquivos relevantes" em qualquer documento de endpoints
- **THEN** os caminhos listados correspondem a arquivos reais no diretório `src/`

### Requirement: Sincronização obrigatória com mudancas de rota
Sempre que uma rota for criada, alterada (input ou output) ou removida, a documentacão correspondente em `_docs/endpoints/` DEVE ser atualizada no mesmo pull request/changeset. Nenhuma mudanca de rota pode ser considerada completa sem a atualizacão da documentacão de endpoint.

#### Scenario: Nova rota adicionada
- **WHEN** uma nova rota é adicionada em qualquer controller
- **THEN** o arquivo correspondente em `_docs/endpoints/` deve ser atualizado ou criado no mesmo PR

#### Scenario: Rota existente alterada
- **WHEN** o schema de input (body/params/query) ou o shape de output de uma rota existente é modificado
- **THEN** a documentacão dessa rota em `_docs/endpoints/` deve ser atualizada no mesmo PR

#### Scenario: Rota removida
- **WHEN** uma rota documentada é removida
- **THEN** a entrada correspondente em `_docs/endpoints/` deve ser removida ou marcada como obsoleta no mesmo PR
