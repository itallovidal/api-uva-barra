## Why

O projeto usa atualmente um repositório em memória (`UserInMemoryRepositoryFactory`) para usuários, que perde todos os dados ao reiniciar o servidor. Isso impede o uso da API em ambientes de homologação/produção com persistência real. Firebase Firestore oferece uma solução serverless de baixa latência, escalável e sem necessidade de gerenciar banco de dados, ideal para o porte atual do projeto.

## What Changes

- Instalar o SDK `firebase-admin` como dependência do projeto
- Configurar Firebase Admin SDK com credenciais via variáveis de ambiente
- Implementar `UserFirebaseRepository` em `src/repository/firebase/user.ts` seguindo a interface `UserRepository` existente
- Substituir `UserInMemoryRepositoryFactory()` por `UserFirebaseRepositoryFactory()` no composition root (`app.ts`)
- Adicionar validação de variáveis de ambiente do Firebase (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- Criar um módulo de inicialização do Firebase (`src/lib/firebase.ts`) compartilhável

## Capabilities

### New Capabilities
- `firebase-config`: Configuração e inicialização do Firebase Admin SDK no projeto, incluindo validação de credenciais via variáveis de ambiente e módulo compartilhado de inicialização

### Modified Capabilities
<!-- Nenhuma spec existente tem requisitos alterados — a interface UserRepository permanece a mesma, apenas a implementação muda -->

## Impact

- **Dependências novas**: `firebase-admin` no `package.json`
- **Nova variável de ambiente**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — documentar em `.env.example`
- **Novo arquivo**: `src/lib/firebase.ts` — módulo de inicialização do Firebase
- **Novo diretório**: `src/repository/firebase/` — implementações Firebase dos repositórios
- **Arquivo alterado**: `src/app.ts` — trocar factory do repositório de usuário
- **Arquivo alterado**: `src/validation/env.ts` — adicionar validação das novas variáveis
