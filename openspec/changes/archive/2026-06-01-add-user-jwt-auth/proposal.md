## Why

A API de usuários não possui autenticação — qualquer rota protegida usa um header `admin-id` inseguro. É necessário implementar login com JWT para que usuários autenticados possam acessar rotas protegidas de forma segura.

## What Changes

- Adicionar rota `POST /user/login` que recebe `email` e `password`, valida as credenciais e retorna um access token JWT
- Adicionar `JWT_SECRET` à validação de environment (env.ts)
- Criar `AuthMiddleware` que valida o Bearer token JWT e decodifica o payload
- Substituir o `adminMiddleware` existente pelo novo `AuthMiddleware` nas rotas protegidas
- Remover o `adminMiddleware` antigo (baseado em header `admin-id`)

## Capabilities

### New Capabilities
- `user-auth`: Login de usuário com email/senha + geração de JWT + middleware de autenticação via Bearer token

### Modified Capabilities

(Nenhuma capability existente sofre alteração de requisitos — apenas o mecanismo de autenticação muda internamente.)

## Impact

- `src/validation/env.ts`: adicionar `JWT_SECRET` ao schema
- `src/controllers/user.controller.ts`: adicionar handler `POST /user/login`
- `src/services/user.service.ts`: adicionar método `login(email, password)` que valida credenciais e retorna token
- `src/shared/middlewares/`: criar `AuthMiddleware.ts`, remover `index.ts` (adminMiddleware)
- Rotas que usam `adminMiddleware` passam a usar `AuthMiddleware`
- Nenhuma dependência nova — `jsonwebtoken` e `@types/jsonwebtoken` já estão no `package.json`
