*Implementar convert-to-news.go completo* 

Tudo funcionando. Resultado da execução:

- **1464 artigos** processados
- **947** convertidos sem avisos
- **517** convertidos com avisos (campo faltando, como imagem ou tags ausentes)
- **0 falhas**

O script convert-to-news.go faz o seguinte:

**Para rodar:** `go run convert-to-news.go`

**Mapeamentos implementados:**
- `ID` → `strconv.Itoa(post.ID)`
- `Title` / `Summary` → strip de tags HTML + `html.UnescapeString`
- `Content` → HTML bruto preservado (sem escape de `<` / `>` no JSON)
- `Category` → duas etapas: `CategoryIDMap` → `CategoryGroupMap`, fallback `"Sem Categoria"`
- `Tags` → itens `class_list` com prefixo `tag-`, removido e `-` substituído por espaço
- `ReadingTime` → palavras do conteúdo (sem HTML) ÷ 200, mínimo 1
- `Status` → `"publish"` → `published`, outros → `draft`
- `PublishedAt` → data de criação se publicado, `null` caso contrário

**log-news.txt** registra para cada arquivo: avisos por campo (vazio, ID de categoria não mapeado, sem tags, data inválida etc.) ou `OK`, mais um resumo final.

