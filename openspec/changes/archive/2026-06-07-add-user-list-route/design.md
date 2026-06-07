## Context

O domínio de usuário já possui autenticação JWT e handlers autenticados para criação, consulta, atualização e remoção. A nova rota precisa seguir o mesmo padrão de proteção, mas expor uma coleção de usuários em formato seguro, sem `password`.

## Goals / Non-Goals

**Goals:**

- Expor `GET /user/list` como rota autenticada
- Reaproveitar o `authMiddleware` já existente
- Retornar somente campos públicos do usuário
- Manter a documentação em sincronia com o código

**Non-Goals:**

- Alterar o fluxo de login
- Mudar o contrato das rotas existentes de usuário individual
- Introduzir paginação ou filtros nesta etapa

## Decisions

- **Ponto de entrada:** registrar `GET /user/list` em `src/controllers/user.controller.ts` junto das demais rotas de usuário
- **Autenticação:** usar o mesmo `preHandler: [authMiddleware]` já aplicado nas demais rotas protegidas
- **Camada de domínio:** adicionar uma operação de listagem no repositório e no service para evitar que o controller acesse persistência diretamente
- **Formato da resposta:** devolver um array de usuários públicos, removendo `password` antes de serializar a resposta
- **Contrato de resposta:** manter o mesmo envelope `ResponsePayload` usado nas demais rotas
- **Documentação:** atualizar `_docs/endpoints/user.md` e `http/user.http` no mesmo change para evitar divergência entre código e exemplos

## Data Flow

1. A requisição chega em `GET /user/list`
2. O `authMiddleware` valida o token JWT
3. O controller chama o service de usuário
4. O service consulta o repositório e transforma os registros em usuários públicos
5. O controller devolve a coleção no `ResponsePayload`

## Risks / Trade-offs

- **Acoplamento com o modelo atual:** o objeto `User` ainda contém `password` no armazenamento, então a sanitização precisa acontecer antes da resposta HTTP
- **Sem paginação:** a primeira versão retorna todos os usuários; isso é simples, mas pode exigir evolução futura se o volume crescer
- **Duplicação de sanitização:** se outras rotas públicas de usuário começarem a retornar coleção, pode valer extrair um helper compartilhado posteriormente
