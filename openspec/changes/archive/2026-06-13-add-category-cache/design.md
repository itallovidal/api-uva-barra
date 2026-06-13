## Context

Hoje o `CacheService` possui apenas o cache de notícias (`warmUpNewsIndex`). O endpoint `GET /categories` é chamado frequentemente e, a cada requisição, consulta o Firebase Firestore via `CategoryRepository.findAll()`. Como o conjunto de categorias é pequeno (dezenas de registros) e muda pouco, é ideal manter um cache em memória para essa lista, eliminando leituras repetidas ao Firestore.

## Goals / Non-Goals

**Goals:**
- Cache em memória armazena o array completo de `Category[]` para todas as categorias
- Aplicação faz warm-up do cache de categorias automaticamente no startup
- `CategoryService.findAll` usa o cache como fonte primária, sem consultar Firebase
- `CategoryService.create`, `update` e `delete` invalidam/atualizam o cache de categorias
- O cache é populado antes do primeiro request (warm-up no startup)

**Non-Goals:**
- Cache distribuído entre instâncias (continua in-memory, TTLCache)
- Cache de categoria individual por ID (listagem é suficiente)
- Mudanças no contrato de API ou nos schemas de validação Zod
- Otimização de busca por ID de categoria (não necessário)

## Decisions

### 1. Cache armazena `Category[]` completo no namespace `categories`
- **Rationale:** O array completo de categorias é pequeno e suficiente para todas as listagens. Usar um namespace separado (`categories`) mantém isolado do cache de notícias.
- **Alternativa considerada:** Cachear apenas IDs e nomes. Rejeitada porque o `Category` completo é pequeno e já contém tudo necessário (incluindo `tags`).

### 2. `warmUpCategories` é chamada no startup (`app.ts`) e executa uma única leitura no Firestore
- **Rationale:** Uma leitura no startup é aceitável e garante que o cache esteja populado antes do primeiro request. O `findAll` do repositório já busca tudo.
- **Alternativa considerada:** Lazy warm-up no primeiro request. Rejeitada porque causaria cold start lento e cache miss no primeiro acesso.

### 3. `findAll` no `CategoryService` passa a consultar o cache primeiro
- **Rationale:** O cache contém `Category[]` com todos os campos necessários para listagem. Se o cache estiver vazio, faz fallback para `categoryRepo.findAll()` e popula o cache.
- **Alternativa considerada:** Manter `findAll` no Firebase e usar cache apenas em outro lugar. Rejeitada porque `findAll` é o endpoint mais acessado e também precisa de cache.

### 4. `create`, `update`, `delete` manipulam o cache via `CacheService.update`
- **Rationale:** Invalidar o cache inteiro em mutações é simples e seguro. Como o volume de categorias é pequeno, re-popular o cache na próxima leitura é rápido. Alternativamente, podemos fazer update parcial do array, mas invalidar é mais simples e evita bugs de consistência.
- **Alternativa considerada:** Atualizar o array em memória (adicionar/remover/atualizar item). Rejeitada porque invalidar é mais simples e seguro; warm-up é rápido.

### 5. `findById` continua buscando no repositório
- **Rationale:** `findById` é menos frequente e não justifica manter um cache separado por ID. O custo de uma leitura no Firestore por ID é baixo.
- **Alternativa considerada:** Buscar no cache de `categories` e filtrar por ID. Rejeitada porque `findById` é pouco usado e preferimos manter simplicidade.

## Risks / Trade-offs

- [Cache stale] Se uma categoria for editada no Firestore diretamente (fora da API), o cache ficará desatualizado até invalidação ou restart. → Mitigação: cache tem TTL de 15 dias; aceitável para esse caso de uso. Além disso, a API invalida o cache em toda mutação.
- [Memória] Cachear todas as categorias é irrelevante em termos de memória (dezenas de registros pequenos).
- [Warm-up lento] Se houver muitas categorias, `warmUpCategories` pode demorar. → Mitigação: `findAll` no Firestore é uma query única; aceitável para o volume atual.

## Migration Plan

1. Adicionar `warmUpCategories` e `getCategories` no `CacheService`
2. Modificar `CategoryService` para usar cache em `findAll` e invalidar em `create`/`update`/`delete`
3. Chamar `warmUpCategories` no `app.ts` no startup
4. Testar endpoints de listagem, criação, edição e deleção de categorias
5. Verificar que o cache é usado corretamente

## Open Questions

- Nenhuma. Decisões claras com base no contexto atual.
