# Backup de Posts WordPress via WP REST API (Go)

**Tags:** `#go #wordpress #backup #rest-api #script`

***

## Resumo

Script em Go que faz backup incremental de posts de um WordPress (agenciauvabarra.com) usando a WP REST API. Ele busca pagina por pagina, salva cada página como um arquivo JSON separado na pasta `backups/`, e respeita um delay de 1 segundo entre requests para não sobrecarregar o servidor.

***

## Como o Script Funciona

### Configurações Principais

| Constante | Valor | Propósito |
|-----------|-------|-----------|
| `BaseURL` | `https://agenciauvabarra.com/wp-json/wp/v2/posts` | Endpoint da WP REST API para posts |
| `PerPage` | `10` | Quantidade de posts por página |
| `BackupsDir` | `"backups"` | Diretório onde os arquivos JSON serão salvos |
| `RequestDelay` | `1s` | Delay entre requests para rate limiting |

### Fluxo de Execução

1. **Cria o diretório de backups** (`backups/`) se não existir [código:1]
2. **Começa na página 149** (configuração hard-coded para continuar de onde parou) [código:1]
3. **Loop infinito** até:
   - Página vazia (fim dos posts)
   - Erro de network/HTTP
   - JSON inválido
4. **Para cada página:**
   - Faz GET na API com parâmetros `per_page` e `page`
   - Valida status code 200
   - Decodifica JSON como `[]json.RawMessage` (lazy parsing)
   - Serializa com indentação e salva em `backup-page-{N}.json`
   - Aguarda 1 segundo antes da próxima página

### Pontos Técnicos Importantes

| Aspecto | Implementação |
|---------|---------------|
| **Timeout HTTP** | `30s` por request via `http.Client{Timeout: ...}` [código:1] |
| **Rate limiting** | `time.Ticker` de 1s com `select` para evitar busy-wait [código:1] |
| **Error handling** | Logs com `log.Printf` + `break` para parar no primeiro erro |
| **JSON parsing** | Usa `json.RawMessage` para evitar deserialização completa desnecessária [código:1] |
| **Contexto** | `context.Background()` (não faz cancellation externo, mas tem estrutura pronta) [código:1] |

***

## Como Rodar

```bash
# Na pasta do script (ex: ~/projects/wp-backup)
go run main.go
```

Ou compile e execute:

```bash
go build -o wp-backup main.go
./wp-backup
```

**Saída esperada:**
```
2026/06/03 01:00:00 fetching page 149
2026/06/03 01:00:01 salvo backups/backup-page-149.json (10 posts)
2026/06/03 01:00:02 fetching page 150
...
2026/06/03 01:15:00 fim: página 203 vazia; backup concluído
2026/06/03 01:15:00 backup concluído: arquivos salvos em backups
```

***

## Estrutura de Arquivos Gerados

```
./
├── main.go
└── backups/
    ├── backup-page-149.json
    ├── backup-page-150.json
    ├── backup-page-151.json
    └── ...
```

OBS.: Eu peguei e coloquei em @backups/wordpress-jsons

Cada arquivo contém um array JSON com os posts daquela página:

```json
[
  {
    "id": 1234,
    "date": "2025-12-01T10:00:00",
    "title": { "rendered": "Título do Post" },
    "content": { "rendered": "<p>Conteúdo...</p>" },
    ...
  },
  ...
]
```

***

