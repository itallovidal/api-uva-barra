## 1. Domínio de usuários

- [x] 1.1 Adicionar suporte de listagem no repositório e no service de usuários
- [x] 1.2 Implementar a sanitização dos usuários retornados para remover `password`

## 2. Rota autenticada

- [x] 2.1 Criar o handler de `GET /user/list` em `src/controllers/user.controller.ts`
- [x] 2.2 Registrar a rota com `authMiddleware`

## 3. Documentação

- [x] 3.1 Atualizar `_docs/endpoints/user.md` com a nova rota e o formato de resposta sem senha
- [x] 3.2 Atualizar `http/user.http` com um exemplo de consumo autenticado

## 4. Validação

- [x] 4.1 Verificar que a resposta da nova rota contém apenas campos públicos do usuário
- [x] 4.2 Confirmar que a documentação menciona autenticação obrigatória e ausência de `password`
