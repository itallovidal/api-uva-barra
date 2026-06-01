## Context

Atualmente a API não possui autenticação real — as rotas de usuário são protegidas por um `adminMiddleware` que lê o header `admin-id` sem qualquer verificação criptográfica. Isso é inseguro e não scale. O `jsonwebtoken` já está no `package.json`.

## Goals / Non-Goals

**Goals:**

- Rota `POST /user/login` que aceita `email` + `password` e retorna um JWT access token
- Validação de `JWT_SECRET` no schema de environment variables
- Middleware reutilizável `AuthMiddleware` que decodifica o Bearer token e injeta os dados do usuário na request
- Substituir `adminMiddleware` pelo `AuthMiddleware` em todas as rotas protegidas de usuário
- Remover o `adminMiddleware` antigo

**Non-Goals:**

- Refresh tokens / token rotation (postergado)
- Roles/permissions granulares via JWT claims (postergado — o middleware valida apenas autenticação, não autorização)
- Endpoint de registro público (já existe via `POST /user/` com middleware admin)

## Decisions

1. **JWT no service layer, não no controller** — O `UserService` ganha um método `login(email, password)` que valida credenciais e retorna o token. O controller apenas chama o service e monta a resposta. Isso mantém a lógica de negócio testável sem depender do Fastify.

2. **Payload do JWT**: `{ sub: userId, email, role, iat, exp }` — `sub` para identificar o usuário, `email` e `role` para uso em middleware sem precisar consultar o banco.

3. **AuthMiddleware como função standalone** — Segue o padrão Fastify de `preHandler`. Decodifica o token, valida, e anexa `request.user` com os dados. Se inválido, retorna 401 com `ResponsePayload` padronizado.

4. **`JWT_SECRET` via env** — Adicionado ao schema zod de `env.ts` com fallbar para desenvolvimento (`"dev-secret"`).

5. **Remoção total do `adminMiddleware`** — O arquivo `src/shared/middlewares/index.ts` é removido. `AuthMiddleware` fica em `src/shared/middlewares/auth-middleware.ts`.

## Risks / Trade-offs

- [Risco] **Secret exposto em dev** → Mitigação: o env schema tem default apenas para dev; produção exige `JWT_SECRET` explícito.
- [Risco] **Token sem refresh** → Trade-off assumido: simplifica a implementação inicial. O token pode ter expiração longa (24h) para compensar.
- [Risco] **Mudança quebra chamadores externos** → As rotas continuam protegidas, apenas o mecanismo muda. Clientes existentes que usavam `admin-id` precisarão migrar para Bearer token.
