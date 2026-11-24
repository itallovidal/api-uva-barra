//go:build ignore

package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/go-resty/resty/v2"
)

const (
	baseURL     = "http://localhost:3000"
	endpoint    = "/news"
	bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMmU3Y2NkZS0yY2E0LTQzNzktOGM1NC02MTZmNTc4YmM5NzIiLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4MTc1MzE1NywiZXhwIjoxNzgxODM5NTU3fQ.09trW4ISm8VVtyu1IYBhuVvBcD9bPaSsptJOJjbv8gk"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("uso: dump <caminho-da-pasta>")
	}

	folderPath := os.Args[1]

	logFile, err := os.OpenFile("logs/dump.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		log.Fatalf("erro ao abrir arquivo de log: %v", err)
	}
	defer logFile.Close()

	logger := log.New(logFile, "", log.LstdFlags)

	entries, err := os.ReadDir(folderPath)
	if err != nil {
		log.Fatalf("erro ao ler pasta: %v", err)
	}

	client := resty.New()
	client.SetBaseURL(baseURL)
	client.SetAuthToken(bearerToken)

	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".json" {
			continue
		}

		filePath := filepath.Join(folderPath, entry.Name())

		content, err := os.ReadFile(filePath)
		if err != nil {
			msg := fmt.Sprintf("ERRO ao ler arquivo | %s", entry.Name())
			fmt.Println(msg)
			logger.Println(msg)
			continue
		}

		resp, err := client.R().
			SetHeader("Content-Type", "application/json").
			SetBody(content).
			Post(endpoint)

		if err != nil {
			msg := fmt.Sprintf("ERRO na requisição | %s | %v", entry.Name(), err)
			fmt.Println(msg)
			logger.Println(msg)
		} else {
			msg := fmt.Sprintf("%d | %s", resp.StatusCode(), entry.Name())
			fmt.Println(msg)
			logger.Println(msg)
		}

		time.Sleep(800 * time.Millisecond)
	}

	fmt.Println("Concluído.")
}
