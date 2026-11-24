//go:build ignore

// Execute com: go run convert-to-news.go
package main

import (
	"encoding/json"
	"fmt"
	"html"
	"log"
	"math"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// ==================== Tipos de entrada (WordPress REST API) ====================

type wpRendered struct {
	Rendered  string `json:"rendered"`
	Protected bool   `json:"protected"`
}

type wpPost struct {
	ID                      int        `json:"id"`
	Title                   wpRendered `json:"title"`
	Slug                    string     `json:"slug"`
	Excerpt                 wpRendered `json:"excerpt"`
	Content                 wpRendered `json:"content"`
	JetpackFeaturedMediaURL string     `json:"jetpack_featured_media_url"`
	Categories              []int      `json:"categories"`
	ClassList               []string   `json:"class_list"`
	Sticky                  bool       `json:"sticky"`
	Date                    string     `json:"date"`
	Modified                string     `json:"modified"`
	Status                  string     `json:"status"`
}

// ==================== Tipos de saída (News) ====================

type NewsStatusType string

const (
	NewsStatusPublished NewsStatusType = "published"
	NewsStatusDraft     NewsStatusType = "draft"
)

type News struct {
	ID            string         `json:"id"`
	Title         string         `json:"title"`
	Slug          string         `json:"slug"`
	Summary       string         `json:"summary"`
	Content       string         `json:"content"`
	CoverImageURL string         `json:"coverImageUrl"`
	Category      string         `json:"category"`
	Author        string         `json:"author"`
	Status        NewsStatusType `json:"status"`
	Tags          []string       `json:"tags"`
	Featured      bool           `json:"featured"`
	ReadingTime   int            `json:"readingTime"`
	CreatedAt     time.Time      `json:"createdAt"`
	UpdatedAt     time.Time      `json:"updatedAt"`
	PublishedAt   *time.Time     `json:"publishedAt"`
}

// ==================== Mapas de categoria ====================

var CategoryIDMap = map[int]string{
	591294689: "#ProjetoDiversidade",
	2431:      "Artes",
	62091:     "Ballet",
	2860759:   "Bienal do Livro",
	3213:      "Ciência",
	597:       "Cinema",
	1484722:   "Coletiva",
	35004455:  "Comportamento",
	1899315:   "Coronavírus",
	2213927:   "Cosmético",
	2367:      "Cultura",
	81389:     "Direito",
	187874:    "Direitos Humanos",
	602466:    "Disney On Ice",
	632602:    "Diversidade",
	11716206:  "Economia",
	5557381:   "Economia Criativa",
	17964:     "Educação",
	401170:    "Educação Física",
	228738:    "Eleições",
	7442:      "Empreendedorismo",
	43377791:  "Encontro com Profissionais",
	72063:     "Enfermagem",
	54927:     "Engenharia",
	23208:     "Entretenimento",
	10889:     "Esporte",
	2366:      "Eventos",
	858951:    "Eventos Internos",
	748476089: "ExpoNoivas 2022",
	407146:    "Exposição",
	1704:      "Gastronomia",
	257:       "Geek",
	3503:      "História",
	18330:     "Institucional",
	670411728: "Institucional UVA",
	22:        "internet",
	14603:     "Jornalismo",
	13072696:  "LGBTQIA+",
	3719:      "Literatura",
	175:       "Marketing",
	28454:     "Marvel",
	774:       "Música",
	15243:     "Meio Ambiente",
	74499:     "mercado de trabalho",
	8086:      "Moda",
	4461207:   "Mundo Pet",
	6955:      "Nutrição",
	713047979: "Podséries",
	798:       "Política",
	10567:     "Psicologia",
	39479:     "Publicidade",
	4753134:   "Quarentena",
	701438832: "Rádio UVA Barra",
	72064:     "Saúde",
	866752:    "saúde mental",
	9838342:   "Série Documental",
	6669656:   "SeCom",
	21243:     "segurança",
	2239:      "Shows",
	7114:      "Sociedade",
	268277:    "Solidariedade",
	254332:    "Sustentabilidade",
	2432:      "Teatro",
	758:       "Tecnologia",
	703299214: "Teoria e Técnica da Notícia",
	703297615: "Teoria e Técnica da Notícia",
	14591:     "Trabalho",
	2368:      "Transporte",
	10207:     "Turismo",
	405710:    "Veganismo",
	33026:     "Violência",
}

var CategoryGroupMap = map[string]string{
	"Artes":                       "Cultura & Artes",
	"Ballet":                      "Cultura & Artes",
	"Cinema":                      "Cultura & Artes",
	"Cultura":                     "Cultura & Artes",
	"Exposição":                   "Cultura & Artes",
	"Teatro":                      "Cultura & Artes",
	"Música":                      "Cultura & Artes",
	"Shows":                       "Cultura & Artes",
	"Literatura":                  "Cultura & Artes",
	"Bienal do Livro":             "Cultura & Artes",
	"Geek":                        "Cultura & Artes",
	"Marvel":                      "Cultura & Artes",
	"Disney On Ice":               "Cultura & Artes",
	"Podséries":                   "Cultura & Artes",
	"Série Documental":            "Cultura & Artes",
	"História":                    "Cultura & Artes",
	"Ciência":                     "Ciência & Tecnologia",
	"Tecnologia":                  "Ciência & Tecnologia",
	"internet":                    "Ciência & Tecnologia",
	"Engenharia":                  "Ciência & Tecnologia",
	"Educação Física":             "Educação & Profissão",
	"Comportamento":               "Sociedade & Comportamento",
	"Sociedade":                   "Sociedade & Comportamento",
	"Diversidade":                 "Sociedade & Comportamento",
	"LGBTQIA+":                    "Sociedade & Comportamento",
	"Direitos Humanos":            "Sociedade & Comportamento",
	"Solidariedade":               "Sociedade & Comportamento",
	"#ProjetoDiversidade":         "Sociedade & Comportamento",
	"Saúde":                       "Saúde & Bem-estar",
	"saúde mental":                "Saúde & Bem-estar",
	"Enfermagem":                  "Saúde & Bem-estar",
	"Nutrição":                    "Saúde & Bem-estar",
	"Cosmético":                   "Saúde & Bem-estar",
	"Veganismo":                   "Saúde & Bem-estar",
	"Quarentena":                  "Saúde & Bem-estar",
	"Coronavírus":                 "Saúde & Bem-estar",
	"Psicologia":                  "Saúde & Bem-estar",
	"Educação":                    "Educação & Profissão",
	"Encontro com Profissionais":  "Educação & Profissão",
	"Jornalismo":                  "Educação & Profissão",
	"Teoria e Técnica da Notícia": "Educação & Profissão",
	"Marketing":                   "Educação & Profissão",
	"Publicidade":                 "Educação & Profissão",
	"mercado de trabalho":         "Educação & Profissão",
	"Trabalho":                    "Educação & Profissão",
	"Empreendedorismo":            "Educação & Profissão",
	"Economia Criativa":           "Educação & Profissão",
	"Política":                    "Política & Economia",
	"Eleições":                    "Política & Economia",
	"Economia":                    "Política & Economia",
	"Direito":                     "Política & Economia",
	"Violência":                   "Política & Economia",
	"segurança":                   "Política & Economia",
	"Esporte":                     "Esporte & Lazer",
	"Entretenimento":              "Esporte & Lazer",
	"Mundo Pet":                   "Esporte & Lazer",
	"Turismo":                     "Esporte & Lazer",
	"Transporte":                  "Esporte & Lazer",
	"Gastronomia":                 "Gastronomia & Moda",
	"Moda":                        "Gastronomia & Moda",
	"Meio Ambiente":               "Ambiente & Sustentabilidade",
	"Sustentabilidade":            "Ambiente & Sustentabilidade",
	"Institucional":               "Institucional & Eventos",
	"Institucional UVA":           "Institucional & Eventos",
	"Eventos":                     "Institucional & Eventos",
	"Eventos Internos":            "Institucional & Eventos",
	"SeCom":                       "Institucional & Eventos",
	"Rádio UVA Barra":             "Rádio UVA Barra",
	"Coletiva":                    "Institucional & Eventos",
	"ExpoNoivas 2022":             "Institucional & Eventos",
}

// ==================== Funções auxiliares ====================

var htmlTagRegex = regexp.MustCompile(`<[^>]+>`)

func stripHTMLTags(s string) string {
	s = htmlTagRegex.ReplaceAllString(s, " ")
	s = html.UnescapeString(s)
	// Colapsa espaços múltiplos em um único espaço
	s = strings.Join(strings.Fields(s), " ")
	return strings.TrimSpace(s)
}

func calculateReadingTime(htmlContent string) int {
	text := stripHTMLTags(htmlContent)
	wordCount := len(strings.Fields(text))
	minutes := int(math.Ceil(float64(wordCount) / 200.0))
	if minutes < 1 {
		return 1
	}
	return minutes
}

func extractTags(classList []string) []string {
	tags := make([]string, 0)
	for _, item := range classList {
		if strings.HasPrefix(item, "tag-") {
			tag := strings.TrimPrefix(item, "tag-")
			tag = strings.ReplaceAll(tag, "-", " ")
			tags = append(tags, tag)
		}
	}
	return tags
}

func mapCategory(categories []int) (string, string) {
	if len(categories) == 0 {
		return "Sem Categoria", "lista de categorias vazia"
	}
	catID := categories[0]
	catName, ok := CategoryIDMap[catID]
	if !ok {
		return "Sem Categoria", fmt.Sprintf("ID de categoria %d não encontrado no CategoryIDMap", catID)
	}
	group, ok := CategoryGroupMap[catName]
	if !ok {
		return "Sem Categoria", fmt.Sprintf("nome de categoria %q não encontrado no CategoryGroupMap", catName)
	}
	return group, ""
}

func parseDate(dateStr string) (time.Time, error) {
	if t, err := time.Parse(time.RFC3339, dateStr); err == nil {
		return t, nil
	}
	if t, err := time.Parse("2006-01-02T15:04:05", dateStr); err == nil {
		return t.UTC(), nil
	}
	return time.Time{}, fmt.Errorf("formato não reconhecido: %q", dateStr)
}

// ==================== Validação ====================

type validationWarning struct {
	Field string
	Issue string
}

func validatePost(post wpPost) []validationWarning {
	var warns []validationWarning

	if post.ID == 0 {
		warns = append(warns, validationWarning{"id", "valor zero ou ausente"})
	}
	if strings.TrimSpace(post.Title.Rendered) == "" {
		warns = append(warns, validationWarning{"title.rendered", "vazio"})
	}
	if strings.TrimSpace(post.Slug) == "" {
		warns = append(warns, validationWarning{"slug", "vazio"})
	}
	if strings.TrimSpace(post.Excerpt.Rendered) == "" {
		warns = append(warns, validationWarning{"excerpt.rendered", "vazio"})
	}
	if strings.TrimSpace(post.Content.Rendered) == "" {
		warns = append(warns, validationWarning{"content.rendered", "vazio"})
	}
	if strings.TrimSpace(post.JetpackFeaturedMediaURL) == "" {
		warns = append(warns, validationWarning{"jetpack_featured_media_url", "vazio"})
	}
	if _, catWarn := mapCategory(post.Categories); catWarn != "" {
		warns = append(warns, validationWarning{"categories", catWarn})
	}
	if len(post.ClassList) == 0 {
		warns = append(warns, validationWarning{"class_list", "lista vazia"})
	} else {
		hasTags := false
		for _, c := range post.ClassList {
			if strings.HasPrefix(c, "tag-") {
				hasTags = true
				break
			}
		}
		if !hasTags {
			warns = append(warns, validationWarning{"class_list", "nenhuma entrada com prefixo 'tag-' encontrada"})
		}
	}
	if strings.TrimSpace(post.Date) == "" {
		warns = append(warns, validationWarning{"date", "vazio"})
	} else if _, err := parseDate(post.Date); err != nil {
		warns = append(warns, validationWarning{"date", err.Error()})
	}
	if strings.TrimSpace(post.Modified) == "" {
		warns = append(warns, validationWarning{"modified", "vazio"})
	} else if _, err := parseDate(post.Modified); err != nil {
		warns = append(warns, validationWarning{"modified", err.Error()})
	}
	if strings.TrimSpace(post.Status) == "" {
		warns = append(warns, validationWarning{"status", "vazio"})
	}
	return warns
}

// ==================== Conversão ====================

func convertPost(post wpPost) News {
	news := News{}

	news.ID = strconv.Itoa(post.ID)
	news.Title = stripHTMLTags(post.Title.Rendered)
	news.Slug = post.Slug
	news.Summary = stripHTMLTags(post.Excerpt.Rendered)
	news.Content = post.Content.Rendered
	news.CoverImageURL = post.JetpackFeaturedMediaURL
	news.Author = "Agência UVA - Barra"
	news.Featured = post.Sticky
	news.Tags = extractTags(post.ClassList)
	news.Category, _ = mapCategory(post.Categories)
	news.ReadingTime = calculateReadingTime(post.Content.Rendered)

	if post.Status == "publish" {
		news.Status = NewsStatusPublished
	} else {
		news.Status = NewsStatusDraft
	}

	createdAt, _ := parseDate(post.Date)
	updatedAt, _ := parseDate(post.Modified)
	news.CreatedAt = createdAt
	news.UpdatedAt = updatedAt

	if post.Status == "publish" {
		t := createdAt
		news.PublishedAt = &t
	}

	return news
}

// ==================== Main ====================

func main() {
	const artigosDir = "./backups/sanitazed-wordpress-jsons"
	const newsDir = "./news"
	const logFilePath = "./log-news.txt"

	if err := os.MkdirAll(newsDir, 0755); err != nil {
		log.Fatalf("Erro ao criar diretório news: %v", err)
	}

	lf, err := os.Create(logFilePath)
	if err != nil {
		log.Fatalf("Erro ao criar log-news.txt: %v", err)
	}
	defer lf.Close()

	logf := func(format string, args ...any) {
		msg := fmt.Sprintf(format, args...)
		fmt.Print(msg)
		fmt.Fprint(lf, msg)
	}

	entries, err := os.ReadDir(artigosDir)
	if err != nil {
		log.Fatalf("Erro ao ler diretório artigos: %v", err)
	}

	total, success, withWarnings, failed := 0, 0, 0, 0

	logf("=== Conversão de Artigos WordPress → News ===\n")
	logf("Início: %s\n\n", time.Now().Format(time.RFC3339))

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}
		total++
		filename := entry.Name()
		inputPath := filepath.Join(artigosDir, filename)
		outputPath := filepath.Join(newsDir, filename)

		logf("[%s]\n", filename)

		data, err := os.ReadFile(inputPath)
		if err != nil {
			logf("  ERRO: falha ao ler arquivo: %v\n\n", err)
			failed++
			continue
		}

		var post wpPost
		if err := json.Unmarshal(data, &post); err != nil {
			logf("  ERRO: JSON inválido: %v\n\n", err)
			failed++
			continue
		}

		warnings := validatePost(post)
		if len(warnings) > 0 {
			logf("  AVISOS (%d):\n", len(warnings))
			for _, w := range warnings {
				logf("    ! campo '%s': %s\n", w.Field, w.Issue)
			}
		}

		news := convertPost(post)

		outFile, err := os.Create(outputPath)
		if err != nil {
			logf("  ERRO: falha ao criar arquivo de saída: %v\n\n", err)
			failed++
			continue
		}
		enc := json.NewEncoder(outFile)
		enc.SetIndent("", "  ")
		enc.SetEscapeHTML(false)
		if err := enc.Encode(news); err != nil {
			outFile.Close()
			logf("  ERRO: falha ao serializar: %v\n\n", err)
			failed++
			continue
		}
		outFile.Close()

		if len(warnings) == 0 {
			logf("  OK\n\n")
			success++
		} else {
			logf("  CONVERTIDO COM AVISOS → %s\n\n", outputPath)
			withWarnings++
			success++
		}
	}

	logf("=== Resumo ===\n")
	logf("Total processado : %d\n", total)
	logf("Sucesso (sem avisos)  : %d\n", success-withWarnings)
	logf("Sucesso (com avisos)  : %d\n", withWarnings)
	logf("Falha            : %d\n", failed)
	logf("Fim: %s\n", time.Now().Format(time.RFC3339))
}
