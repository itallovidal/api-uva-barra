# Categorias (Categories)

**Versão:** 1.0
**Data:** 2026-06-04

## Visão Geral

Endpoints para gerenciamento de categorias. Operações de CRUD completas. Atualmente todas as rotas são públicas (sem autenticação).

> **Cache:** A listagem de categorias (`GET /categories`) utiliza cache em memória com warm-up no startup do servidor. Mutações (criação, atualização, deleção) invalidam o cache automaticamente, garantindo que a próxima listagem reflita os dados atualizados.

## Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| POST | `/categories` | Nenhuma | Criar nova categoria |
| GET | `/categories` | Nenhuma | Listar todas as categorias |
| GET | `/categories/:id` | Nenhuma | Buscar categoria por ID |
| PUT | `/categories/:id` | Nenhuma | Atualizar categoria |
| DELETE | `/categories/:id` | Nenhuma | Remover categoria |

## Detalhamento

### `POST /categories`

Cria uma nova categoria.

**Request body:**

```json
{
  "name": "Tecnologia",
  "tags": ["tech", "inovacao"]
}
```

**Campos:**
- `name` (string, obrigatório) — Nome da categoria
- `tags` (string[], opcional) — Lista de tags associadas

**Validação:** `src/validation/category.ts` — `createCategorySchema`

**Resposta (201 Created):**

```json
{
  "status": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tecnologia",
    "tags": ["tech", "inovacao"]
  }
}
```

**Resposta (400 Bad Request — dados inválidos):**

```json
{
  "status": 400,
  "data": null,
  "error": {
    "message": "Dados inválidos",
    "code": "VALIDATION_ERROR"
  }
}
```

### `GET /categories`

Lista todas as categorias cadastradas.

**Request:** Nenhum parâmetro, body ou query.

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Tecnologia",
      "tags": ["tech", "inovacao"]
    }
  ]
}
```

### `GET /categories/:id`

Busca uma categoria pelo ID.

**Parâmetros:**
- `id` (string, uuid) — ID da categoria

**Validação:** `src/validation/category.ts` — `categoryParamsSchema` (deve ser UUID válido)

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tecnologia",
    "tags": ["tech", "inovacao"]
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Categoria não encontrada",
    "code": "NOT_FOUND"
  }
}
```

### `PUT /categories/:id`

Atualiza uma categoria existente.

**Parâmetros:**
- `id` (string, uuid) — ID da categoria

**Request body:**

```json
{
  "name": "Tecnologia Atualizada",
  "tags": ["tech", "inovacao", "digital"]
}
```

**Campos:**
- `name` (string, obrigatório) — Nome atualizado
- `tags` (string[], obrigatório) — Lista de tags (substitui a anterior)

**Validação:** `src/validation/category.ts` — `categoryParamsSchema` + `updateCategorySchema`

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tecnologia Atualizada",
    "tags": ["tech", "inovacao", "digital"]
  }
}
```

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Categoria não encontrada",
    "code": "NOT_FOUND"
  }
}
```

### `DELETE /categories/:id`

Remove uma categoria.

**Parâmetros:**
- `id` (string, uuid) — ID da categoria

**Validação:** `src/validation/category.ts` — `categoryParamsSchema`

**Resposta (204 No Content):**

```json
{
  "status": 204
}
```

**Resposta (404 Not Found):**

```json
{
  "status": 404,
  "data": null,
  "error": {
    "message": "Categoria não encontrada",
    "code": "NOT_FOUND"
  }
}
```

## Validações aplicadas

| Schema | Arquivo | Campos |
|--------|---------|--------|
| `createCategorySchema` | `src/validation/category.ts` | `name`: string obrigatória; `tags`: array opcional de strings |
| `updateCategorySchema` | `src/validation/category.ts` | `name`: string obrigatória; `tags`: array obrigatório de strings |
| `categoryParamsSchema` | `src/validation/category.ts` | `id`: string UUID |

## Tipos e DTOs

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| `Category` | `src/types/category/entities.ts` | Entidade com `id`, `name`, `tags` |
| `CreateCategoryRequestDTO` | `src/types/category/dtos.ts` | DTO de criação: `name`, `tags?` |
| `UpdateCategoryRequestDTO` | `src/types/category/dtos.ts` | DTO de atualização: `name`, `tags` |

## Arquivos relevantes

- `src/controllers/category.controller.ts` — handlers de rota
- `src/services/category.service.ts` — lógica de negócio
- `src/repository/category.ts` — interface do repositório
- `src/types/category/entities.ts` — definição de `Category`
- `src/types/category/dtos.ts` — DTOs de criação e atualização
- `src/validation/category.ts` — schemas Zod
