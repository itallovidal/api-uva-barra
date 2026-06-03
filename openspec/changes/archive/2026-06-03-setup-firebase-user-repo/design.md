## Context

O repositório de usuários atualmente usa `UserInMemoryRepositoryFactory` (`src/repository/in-memory/user.ts`), que armazena dados em um `Map<string, User>` sem persistência. Isso funciona para testes e desenvolvimento inicial, mas impossibilita uso em produção.

A interface `UserRepository` (`src/repository/user.ts`) já define os métodos necessários: `findById`, `findByEmail`, `create`, `update`, `delete`. A nova implementação Firebase deve respeitar exatamente essa interface.

O projeto usa Fastify com injeção manual de dependência no `app.ts` (composition root). Serviços recebem repositórios via factory params.

## Goals / Non-Goals

**Goals:**
- Instalar e configurar Firebase Admin SDK no projeto
- Criar módulo compartilhado de inicialização do Firebase (`src/lib/firebase.ts`)
- Implementar `UserFirebaseRepositoryFactory` em `src/repository/firebase/user.ts`
- Trocar o repositório usado em `app.ts` de in-memory para Firebase
- Validar as novas variáveis de ambiente do Firebase no schema Zod existente

**Non-Goals:**
- Implementar Firebase Storage (será tratado em change futuro)
- Migrar outros repositórios (categoria, news, registration-request) para Firebase
- Criar testes automatizados para o novo repositório
- Implementar migrations ou seed de dados
- Suporte a múltiplas contas de serviço ou ambientes separados

## Decisions

| Decisão | Opção Escolhida | Alternativa Considerada | Rationale |
|---|---|---|---|
| SDK Firebase | `firebase-admin` (server-side) | Firebase Web SDK + `firebase/compat` | `firebase-admin` é o SDK oficial para Node.js server-side, com suporte nativo a contas de serviço (sem precisar de auth de usuário). Escrito em TypeScript-first. |
| Inicialização | Módulo singleton em `src/lib/firebase.ts` | Inicializar dentro do repositório | Separar a inicialização do Firebase da lógica de negócio permite reuso futuramente (outros repositórios Firebase, Storage, etc) e facilita testes injetando instância mockada. |
| Factory pattern | `UserFirebaseRepositoryFactory(db: Firestore)` | Classe instanciada com `new` | Consistência com o padrão existente no projeto (factories em vez de classes). A factory recebe `db` como parâmetro para permitir injeção. |
| Autenticação | Conta de serviço via variáveis de ambiente (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) | Arquivo de credenciais JSON | Variáveis de ambiente são mais seguras (não commitar acidentalmente), seguem a prática atual do projeto (env vars via `@fastify/env`), e funcionam bem em ambientes cloud (Render, Railway, Fly.io). |
| ID dos documentos | Usar o UUID gerado pelo serviço como `id` do documento no Firestore | Usar ID automático do Firestore | A camada de serviço gera UUIDs via `uuid` e os usa em todo o fluxo. Manter o UUID como ID do documento evita mudanças nas services e mantém consistência com o repositório atual. |
| Campo `updatedAt` | Atualizar no repositório (`updatedAt: new Date()`) | Receber via parâmetro do service | A service já passa `updatedAt` no `update`, então o repositório deve aceitar o valor vindo de cima. Mas `createdAt` e `updatedAt` precisam ser serializados/deserializados corretamente (Date → Timestamp → Date). |
| Tratamento do `\n` na private key | `.replace(/\\n/g, '\n')` ao montar o objeto de credencial | Exigir que o usuário coloque newlines reais no `.env` | O `.env` não suporta newlines multi-linha de forma confiável. A service account key sempre vem com `\n` literais. O replace é a abordagem padrão da comunidade Firebase/Node.js. O `firebase-admin` SDK aceita o objeto `cert()` com a chave já parseada. |

## Risks / Trade-offs

- **[Custo]**: Firestore pode gerar custos se houver muitas operações de leitura/escrita sem Firestore caching. → Monitorar uso no console GCP.
- **[Latência]**: Primeira operação pode ser mais lenta (cold start do Firebase Admin). → A inicialização é feita uma vez na subida do servidor.
- **[Credenciais]**: `FIREBASE_PRIVATE_KEY` contém `\n` literais que precisam de tratamento especial em arquivos `.env`. → O código deve aplicar `.replace(/\\n/g, '\n')` ao montar o objeto de credencial. Documentar no `.env.example` com exemplo explícito. Adicionar requirement na spec e comentário no código.
- **[Rollback]**: Se o Firebase falhar, não há fallback automático para in-memory. → O servidor não deve subir se as credenciais forem inválidas (validação no startup).
