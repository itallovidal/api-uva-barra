## 1. Configuração de Ambiente

- [x] 1.1 Adicionar `JWT_SECRET` ao schema de validação em `src/validation/env.ts` com valor padrão `"dev-secret"` para desenvolvimento e sem default para produção

## 2. Login no Service Layer

- [x] 2.1 Adicionar método `login(email, password)` em `src/services/user.service.ts` que busca o usuário por email, verifica a senha com `verifyPassword`, gera um JWT com `jsonwebtoken` e retorna `{ accessToken, user }` (sem a senha)

## 3. Middleware de Autenticação

- [x] 3.1 Criar `src/shared/middlewares/AuthMiddleware.ts` — função `preHandler` que extrai o Bearer token do header `Authorization`, verifica com `jwt.verify()`, e anexa os dados decodificados em `request.user`
- [x] 3.2 Estender a tipagem do FastifyRequest para incluir a propriedade `user` com `{ sub, email, role }`

## 4. Controller e Rotas

- [x] 4.1 Adicionar handler `POST /user/login` em `src/controllers/user.controller.ts` que valida o body com zod, chama `userService.login()` e retorna o token + user
- [x] 4.2 Substituir `adminMiddleware` por `AuthMiddleware` nas rotas protegidas do `user.controller.ts`
- [x] 4.3 Remover import e uso de `adminMiddleware` do controller

## 5. Limpeza

- [x] 5.1 Remover `src/shared/middlewares/index.ts` (adminMiddleware antigo)

## 6. Verificação

- [x] 6.1 Executar `npm run typecheck` e `npm run lint` para garantir que tudo compila sem erros
