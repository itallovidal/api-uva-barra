# Healthcheck

**Versão:** 1.0
**Data:** 2026-06-04

## Visão Geral

Endpoint público para verificar se a API está operacional. Retorna o status atual, tempo de atividade (uptime) e timestamp.

## Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|--------------|-----------|
| GET | `/health` | Nenhuma | Verificar saúde da API |

## Detalhamento

### `GET /health`

Verifica se o servidor está rodando.

**Request:** Nenhum parâmetro, body ou query.

**Resposta (200 OK):**

```json
{
  "status": 200,
  "data": {
    "status": "ok",
    "uptime": 1234,
    "timestamp": "2026-06-04T10:00:00.000Z"
  }
}
```

## Validações aplicadas

Nenhuma validação — rota sem parâmetros.

## Arquivos relevantes

- `src/controllers/healthcheck.controller.ts` — handler da rota
- `src/utils/time-handler.ts` — funções `getUptimeInSeconds` e `getISOTimestamp`
