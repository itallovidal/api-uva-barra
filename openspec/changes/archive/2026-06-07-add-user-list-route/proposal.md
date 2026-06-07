## Why

Hoje existe autenticação, criação e consulta individual de usuários, mas não existe uma rota dedicada para listar usuários autenticados. Isso força consumidores da API a depender de múltiplas chamadas individuais e impede o uso direto da API em telas administrativas, listas de colaboradores e integrações que precisam do conjunto de usuários.

## What Changes

- Criar a rota `GET /user/list` no domínio de usuários
- Proteger a rota com `authMiddleware`, seguindo o padrão já usado nas rotas de usuário autenticadas
- Retornar a lista de usuários sem o campo `password`
- Atualizar a documentação das rotas em `_docs/endpoints/user.md`
- Atualizar os exemplos de consumo em `http/user.http`

## Capabilities

### New Capabilities

- `user-listing`: listagem autenticada de usuários via `GET /user/list`, com resposta pública sem senha

### Modified Capabilities

- `user-management`: o domínio de usuário passa a expor uma visão de coleção além das operações individuais já existentes

## Impact

- Alteração em `src/controllers/user.controller.ts` para registrar a nova rota
- Expansão da camada de serviço e repositório para suportar listagem
- Atualização da documentação oficial das rotas e dos exemplos HTTP
- Nenhuma mudança esperada no contrato das demais rotas de usuário
