package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	ollamaURL  = "http://localhost:11434/api/generate"
	backupDir  = "./backups"
	artigosDir = "./artigos"
	logFile    = "./log.txt"
	timeout    = 150 * time.Second

	// Ponto de retomada: altere estas constantes para continuar de onde parou.
	// startPage    = número do backup-page-N a começar (0 = desde o início)
	// startArticle = índice do artigo dentro desse arquivo (1 = primeiro artigo)
	startPage    = 104 // last backup-page-103.json foi processado, então começamos do 104
	startArticle = 9
)

// contextTokens é o contexto pré-computado que priming o modelo com instruções de sanitização.
var contextTokens = []int{
	248045, 846, 198, 66940, 3825, 4297, 19207, 87472, 401, 9032, 13, 345, 72687, 25, 58261, 634, 4297, 9032, 1363,
	1481, 11, 8377, 3443, 2055, 5724, 1418, 61959, 2887, 459, 44460, 14805, 635, 19202, 11, 378, 84574, 277, 45107,
	4297, 9032, 4419, 5200, 11, 65995, 378, 93728, 13, 232670, 25, 3975, 630, 277, 296, 178940, 60427, 378, 264,
	180499, 5067, 164236, 2906, 176267, 11, 215393, 8426, 46540, 63075, 3871, 35855, 11, 50264, 19812, 35076, 11,
	6632, 11, 13746, 378, 227806, 401, 6238, 13, 3083, 12418, 66991, 42571, 46236, 25, 220, 16, 13, 2831, 12176,
	6378, 11466, 296, 25356, 945, 202481, 14699, 4619, 14681, 441, 25, 361, 3689, 850, 1095, 76, 27267, 6073, 25573,
	3689, 29, 220, 17, 13, 78503, 45107, 9212, 9032, 65995, 378, 221163, 14415, 178940, 11, 28735, 2905, 201038, 25,
	361, 79, 7813, 361, 71, 16, 7813, 361, 71, 17, 7813, 361, 71, 18, 7813, 361, 71, 19, 7813, 361, 71, 20, 7813,
	361, 71, 21, 7813, 361, 64, 7813, 361, 1827, 7813, 361, 17251, 7813, 361, 76494, 7813, 361, 47143, 7813, 361,
	355, 7813, 361, 335, 7813, 361, 719, 7813, 361, 4371, 7813, 361, 334, 7813, 361, 1277, 7813, 361, 22483, 29,
	220, 18, 13, 4767, 12297, 9212, 378, 46540, 63075, 3871, 35855, 5724, 791, 31176, 428, 11, 183391, 25, 361, 2208,
	7813, 361, 3412, 7813, 78149, 35855, 11, 30809, 11, 75419, 3945, 37579, 428, 5067, 13711, 5067, 164236, 3822, 11,
	46540, 635, 19202, 11, 174872, 9032, 378, 55861, 4619, 1649, 12038, 5735, 4144, 3239, 296, 178940, 12078, 13,
	220, 19, 13, 4767, 12297, 15063, 2556, 50264, 19812, 63075, 3871, 35855, 11, 183391, 25, 523, 11, 850, 11, 1647,
	11, 795, 12, 11961, 6908, 12, 11961, 8019, 11, 45543, 11, 2212, 723, 11, 11930, 11, 69038, 378, 222895, 50264,
	19812, 401, 188848, 1195, 17016, 5724, 186067, 13, 220, 20, 13, 78503, 45107, 2556, 50264, 19812, 28545, 181253,
	221163, 25, 945, 361, 64, 25961, 1738, 11, 945, 361, 1827, 25961, 2212, 11, 4644, 11, 2297, 11, 2521, 11, 945,
	361, 22483, 25961, 2212, 11, 2297, 11, 2521, 11, 2192, 11, 2070, 11, 2070, 50684, 11, 945, 361, 3689, 25961,
	20480, 202481, 850, 1095, 76, 27267, 4282, 220, 21, 13, 55715, 11263, 68, 11, 311, 287, 811, 6378, 11, 577,
	13029, 11, 190988, 4219, 5724, 163489, 5405, 296, 30970, 13, 49252, 59935, 296, 178940, 60427, 3889, 13, 6943,
	64, 45107, 177876, 9032, 3239, 57252, 7230, 2694, 28735, 92240, 3239, 73639, 62910, 11, 4018, 76851, 25, 594,
	1085, 26, 1411, 50206, 43055, 23, 17, 16, 16, 26, 1411, 216120, 594, 5496, 26, 1411, 95453, 4472, 13, 1577,
	39744, 85729, 10784, 173756, 8599, 277, 430, 39744, 65995, 7230, 2694, 28735, 201674, 334, 18943, 8485, 50264,
	19812, 9032, 13, 220, 22, 13, 55715, 958, 57252, 85729, 5379, 4176, 193935, 13, 5272, 430, 39744, 65995, 11552,
	50264, 19812, 9032, 13, 220, 23, 13, 55715, 17860, 4144, 1649, 68367, 401, 46085, 11, 12038, 958, 1088, 77, 11,
	12038, 958, 1088, 81, 11, 12038, 958, 5474, 87389, 13, 357, 193935, 34949, 1372, 10293, 85135, 46085, 216975,
	4144, 13, 220, 24, 13, 1297, 195794, 4297, 39279, 5067, 164236, 3822, 176267, 33964, 401, 4297, 12876, 63075,
	3871, 19171, 11, 1254, 12297, 296, 12876, 378, 25063, 59935, 45107, 296, 178940, 176267, 13, 220, 16, 15, 13,
	1297, 225480, 4297, 361, 17251, 29, 459, 361, 1827, 29, 378, 361, 76494, 7813, 20480, 52793, 180499, 13, 220,
	16, 16, 13, 1297, 225480, 46800, 401, 209478, 13824, 2499, 184779, 14415, 178940, 11, 20480, 45107, 296, 361,
	22483, 29, 4419, 5200, 11, 215393, 8426, 18910, 378, 23107, 212973, 13, 220, 16, 17, 13, 10082, 16413, 177056,
	296, 9032, 1534, 13, 55715, 183551, 11, 12038, 459, 6603, 11, 12038, 958, 48794, 11, 12038, 958, 13805, 981,
	401, 42600, 13, 32104, 159691, 401, 4711, 8802, 25, 232058, 296, 30970, 3889, 3825, 264, 4711, 8802, 178141,
	11, 232058, 264, 180499, 5067, 164236, 2906, 176267, 3825, 4711, 8802, 178390, 11, 232058, 181981, 2030, 70509,
	5724, 50264, 19812, 401, 6238, 3825, 264, 9578, 192146, 13, 1158, 395, 10101, 212569, 25, 41149, 25, 9032, 1418,
	61959, 2887, 318, 89021, 11, 6632, 11, 13746, 11, 8949, 11, 795, 7944, 11, 177876, 11, 4831, 8, 193935, 25,
	10293, 85135, 886, 9032, 19207, 49489, 11, 33964, 401, 361, 3689, 850, 1095, 76, 27267, 6073, 11, 5067, 9212,
	35076, 11, 5067, 6632, 11, 5067, 13746, 35076, 11, 5067, 1088, 77, 11, 945, 10293, 85135, 46085, 13, 248046,
	198, 248045, 74455, 198, 248068, 271, 248069, 271, 87739, 850, 1095, 76, 27267, 17858, 79, 29, 41570, 3825, 4297,
	76851, 401, 30970, 401, 72125, 3239, 88653, 264, 19207, 45797, 635, 9032, 13, 496, 178940, 3889, 21012, 157898,
	2055, 11, 8970, 15063, 2556, 50264, 19812, 63075, 3871, 35855, 11, 6632, 11, 13746, 378, 205527, 52704, 215393,
	12962, 3786, 79, 1721, 79, 29, 2575, 298, 1298, 221123, 401, 76851, 3239, 175364, 1649, 264, 1304, 164808,
	193246, 2821, 6138, 158544, 8709, 3786, 79, 1721, 64, 1738, 1095, 2349, 1074, 325, 29225, 877, 6073, 3806, 401,
	76851, 510, 64, 1721, 1827, 2212, 1095, 2349, 1074, 325, 29225, 877, 69577, 14240, 4665, 6, 4644, 1095, 1378,
	14240, 401, 76851, 6, 2297, 1095, 23, 15, 15, 6, 2521, 1095, 21, 15, 15, 17858, 47143, 24814, 173220, 401,
	76851, 1649, 34949, 1372, 157898, 2499, 3786, 47143, 1721, 355, 1721, 719, 29, 1192, 2899, 13719, 220, 16, 510,
	719, 1721, 719, 29, 1192, 2899, 13719, 220, 17, 510, 719, 1419, 355, 1721, 22483, 2212, 1095, 2349, 1074, 325,
	29225, 877, 39938, 6, 2297, 1095, 20, 21, 15, 6, 2521, 1095, 18, 16, 20, 6, 2192, 1095, 243148, 91248, 13824,
	2055, 6, 2070, 1095, 42436, 261, 19786, 26, 55392, 26, 44497, 59970, 26, 23680, 39899, 26, 27685, 86688, 26,
	6588, 3309, 76913, 6, 2070, 50684, 1419, 22483, 1419, 3689, 29,
}

type ollamaRequest struct {
	Model   string                 `json:"model"`
	Prompt  string                 `json:"prompt"`
	Think   bool                   `json:"think"`
	Stream  bool                   `json:"stream"`
	Options map[string]interface{} `json:"options"`
	Context []int                  `json:"context"`
}

type ollamaResponse struct {
	Response string `json:"response"`
	Done     bool   `json:"done"`
}

func main() {
	if err := os.MkdirAll(artigosDir, 0755); err != nil {
		log.Fatalf("erro ao criar diretório %s: %v", artigosDir, err)
	}

	lf, err := os.OpenFile(logFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("erro ao abrir log: %v", err)
	}
	defer lf.Close()
	logger := log.New(lf, "", log.LstdFlags)

	entries, err := os.ReadDir(backupDir)
	if err != nil {
		log.Fatalf("erro ao ler diretório %s: %v", backupDir, err)
	}

	var backupFiles []string
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".json") {
			backupFiles = append(backupFiles, e.Name())
		}
	}
	sort.Slice(backupFiles, func(i, j int) bool {
		return pageNum(backupFiles[i]) < pageNum(backupFiles[j])
	})

	client := &http.Client{Timeout: timeout}

	for _, fname := range backupFiles {
		if pageNum(fname) < startPage {
			fmt.Printf("=== Pulando %s (antes do ponto de retomada) ===\n", fname)
			continue
		}
		fpath := filepath.Join(backupDir, fname)
		data, err := os.ReadFile(fpath)
		if err != nil {
			msg := fmt.Sprintf("erro ao ler arquivo %s: %v", fname, err)
			fmt.Println(msg)
			logger.Println(msg)
			continue
		}

		var articles []map[string]interface{}
		if err := json.Unmarshal(data, &articles); err != nil {
			msg := fmt.Sprintf("erro ao parsear %s: %v", fname, err)
			fmt.Println(msg)
			logger.Println(msg)
			continue
		}

		fmt.Printf("=== Processando %s (%d artigos) ===\n", fname, len(articles))

		for i, article := range articles {
			if pageNum(fname) == startPage && i+1 < startArticle {
				fmt.Printf("  -> artigo %d pulado (antes do ponto de retomada)\n", i+1)
				continue
			}
			slug, _ := article["slug"].(string)
			if slug == "" {
				msg := fmt.Sprintf("artigo sem slug em %s", fname)
				fmt.Println(msg)
				logger.Println(msg)
				continue
			}

			contentObj, ok := article["content"].(map[string]interface{})
			if !ok {
				msg := fmt.Sprintf("ERRO [%s] campo content ausente ou inválido", slug)
				fmt.Println(msg)
				logger.Println(msg)
				continue
			}

			rendered, _ := contentObj["rendered"].(string)

			fmt.Printf("  -> %s ... ", slug)

			start := time.Now()
			sanitized, err := callOllama(client, rendered)
			if err != nil {
				msg := fmt.Sprintf("ERRO [%s] arquivo=%s: %v", slug, fname, err)
				fmt.Println("FALHOU")
				logger.Println(msg)
				continue
			}

			contentObj["rendered"] = sanitized
			article["content"] = contentObj

			outPath := filepath.Join(artigosDir, slug+".json")
			f, err := os.Create(outPath)
			if err != nil {
				msg := fmt.Sprintf("ERRO [%s] criar arquivo: %v", slug, err)
				fmt.Println(msg)
				logger.Println(msg)
				continue
			}
			enc := json.NewEncoder(f)
			enc.SetEscapeHTML(false)
			enc.SetIndent("", "  ")
			encErr := enc.Encode(article)
			f.Close()
			if encErr != nil {
				msg := fmt.Sprintf("ERRO [%s] marshal: %v", slug, encErr)
				fmt.Println(msg)
				logger.Println(msg)
				continue
			}

			elapsed := time.Since(start).Round(time.Millisecond)
			fmt.Printf("OK (%s)\n", elapsed)
			logger.Printf("OK slug=%s tempo=%s", slug, elapsed)
		}
	}

	fmt.Println("\nProcessamento concluído.")
}

func callOllama(client *http.Client, content string) (string, error) {
	payload := ollamaRequest{
		Model:  "qwen3.5:9b",
		Prompt: content,
		Think:  false,
		Stream: false,
		Options: map[string]interface{}{
			"temperature": 0.1,
			"num_ctx":     12000,
		},
		Context: contextTokens,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("marshal payload: %w", err)
	}

	resp, err := client.Post(ollamaURL, "application/json", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("requisição http: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("status inesperado: %d", resp.StatusCode)
	}

	var result ollamaResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("decodificar resposta: %w", err)
	}

	return result.Response, nil
}

func pageNum(name string) int {
	name = strings.TrimSuffix(name, ".json")
	parts := strings.Split(name, "-")
	if len(parts) == 0 {
		return 0
	}
	n, _ := strconv.Atoi(parts[len(parts)-1])
	return n
}
