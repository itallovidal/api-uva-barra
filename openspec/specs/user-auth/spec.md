### Requirement: Login de usuário com email e senha
O sistema SHALL expor uma rota `POST /user/login` que aceita `email` e `password` no corpo da requisição, valida as credenciais e retorna um access token JWT.

#### Scenario: Login bem-sucedido
- **WHEN** um usuário envia `POST /user/login` com `email` e `password` corretos
- **THEN** o sistema retorna status 200 com um objeto contendo `accessToken` (string JWT) e `user` (dados do usuário sem senha)

#### Scenario: Email inexistente
- **WHEN** um usuário envia `POST /user/login` com um `email` que não existe no sistema
- **THEN** o sistema retorna status 401 com erro `INVALID_CREDENTIALS`

#### Scenario: Senha incorreta
- **WHEN** um usuário envia `POST /user/login` com `email` existente mas `password` incorreta
- **THEN** o sistema retorna status 401 com erro `INVALID_CREDENTIALS`

#### Scenario: Payload inválido
- **WHEN** um usuário envia `POST /user/login` sem `email` ou sem `password`
- **THEN** o sistema retorna status 400 com erro `INVALID_PAYLOAD`

### Requirement: JWT secret configurável via environment
O sistema SHALL ler a chave secreta JWT da variável de ambiente `JWT_SECRET`, validada pelo schema zod de environment.

#### Scenario: JWT_SECRET definido
- **WHEN** a variável `JWT_SECRET` está definida no ambiente
- **THEN** o sistema usa esse valor para assinar e verificar tokens JWT

#### Scenario: JWT_SECRET ausente em produção
- **WHEN** `NODE_ENV` é `production` e `JWT_SECRET` não está definido
- **THEN** o sistema falha ao iniciar com erro de validação de environment

### Requirement: Middleware de autenticação via Bearer token
O sistema SHALL prover um middleware `authMiddleware` que verifica o header `Authorization: Bearer <token>`, decodifica o JWT e disponibiliza os dados do usuário na request.

#### Scenario: Token válido
- **WHEN** uma requisição inclui header `Authorization: Bearer <token>` com um JWT válido
- **THEN** o middleware permite a requisição prosseguir e anexa `request.user` com `{ sub, email, role }`

#### Scenario: Token ausente
- **WHEN** uma requisição não inclui header `Authorization`
- **THEN** o middleware retorna status 401 com erro `UNAUTHORIZED`

#### Scenario: Token inválido
- **WHEN** uma requisição inclui header `Authorization: Bearer <token>` com um JWT malformado ou expirado
- **THEN** o middleware retorna status 401 com erro `UNAUTHORIZED`

#### Scenario: Formato inválido do header
- **WHEN** uma requisição inclui header `Authorization` sem o prefixo `Bearer `
- **THEN** o middleware retorna status 401 com erro `UNAUTHORIZED`

### Requirement: Rotas de usuário protegidas por autenticação
O sistema SHALL aplicar o `authMiddleware` em todas as rotas de usuário que atualmente usam `adminMiddleware`.

#### Scenario: Rota protegida com token válido
- **WHEN** uma requisição autenticada (com token válido) acessa `GET /user/:id`
- **THEN** o sistema processa a requisição normalmente

#### Scenario: Rota protegida sem token
- **WHEN** uma requisição não autenticada acessa `GET /user/:id`
- **THEN** o sistema retorna status 401

### Requirement: Login não exige autenticação
A rota `POST /user/login` SHALL ser pública (sem middleware de autenticação).

#### Scenario: Acesso à rota de login sem token
- **WHEN** qualquer requisição acessa `POST /user/login`
- **THEN** o sistema processa a requisição sem verificar autenticação
