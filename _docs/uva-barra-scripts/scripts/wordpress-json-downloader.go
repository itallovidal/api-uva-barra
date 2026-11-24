//go:build ignore

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

const (
	BaseURL    = "https://agenciauvabarra.com/wp-json/wp/v2/posts"
	PerPage    = 10
	BackupsDir = "backups"

	RequestDelay = 1 * time.Second
)

func main() {
	if err := os.MkdirAll(BackupsDir, 0755); err != nil {
		log.Fatalf("erro ao criar diretório %s: %v", BackupsDir, err)
	}

	page := 149
	ticker := time.NewTicker(RequestDelay)
	defer ticker.Stop()

	client := &http.Client{Timeout: 30 * time.Second}

	for {
		url := fmt.Sprintf("%s?per_page=%d&page=%d", BaseURL, PerPage, page)
		log.Printf("fetching page %d", page)

		req, err := http.NewRequestWithContext(context.Background(), "GET", url, nil)
		if err != nil {
			log.Printf("erro ao criar request: %v", err)
			break
		}

		resp, err := client.Do(req)
		if err != nil {
			log.Printf("erro ao fazer GET %s: %v", url, err)
			break
		}

		if resp.StatusCode != http.StatusOK {
			log.Printf("erro %d em page %d: %s", resp.StatusCode, page, url)
			resp.Body.Close()
			break
		}

		var rawPosts []json.RawMessage
		if err := json.NewDecoder(resp.Body).Decode(&rawPosts); err != nil {
			log.Printf("erro ao decodificar JSON da page %d: %v", page, err)
			resp.Body.Close()
			break
		}
		resp.Body.Close()

		if len(rawPosts) == 0 {
			log.Printf("fim: página %d vazia; backup concluído", page)
			break
		}

		// Serializar os posts desta página como um array JSON e salvar em arquivo separado
		filename := fmt.Sprintf("%s/backup-page-%d.json", BackupsDir, page)
		data, err := json.MarshalIndent(rawPosts, "", "  ")
		if err != nil {
			log.Printf("erro ao serializar posts da página %d: %v", page, err)
			break
		}
		if err := os.WriteFile(filename, data, 0644); err != nil {
			log.Printf("erro ao escrever %s: %v", filename, err)
			break
		}
		log.Printf("salvo %s (%d posts)", filename, len(rawPosts))

		select {
		case <-ticker.C:
		case <-context.Background().Done():
			log.Printf("contexto cancelado")
			return
		}

		page++
	}

	log.Printf("backup concluído: arquivos salvos em %s", BackupsDir)
}
