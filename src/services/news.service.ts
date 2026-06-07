import type { News } from "@/types/news/entities";
import { NewsStatus } from "@/types/news/entities";
import type { CreateNewsDTO, NewsListQueryDTO, NewsPreviewDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { AppErrorClass } from "@/types/api";
import type { CacheService, NewsIndexEntry } from "@/services/cache.service";

export type NewsService = ReturnType<typeof createNewsService>;

export function createNewsService(
  newsRepo: NewsRepository,
  cacheService: CacheService,
) {
  return {
    async create(input: CreateNewsDTO): Promise<News> {
      const news = await newsRepo.create(input);
      if (news.status === NewsStatus.PUBLISHED) {
        cacheService.update<NewsIndexEntry[]>("news-index", (current = []) => [
          { id: news.id, slug: news.slug, title: news.title },
          ...current,
        ]);
      }
      return news;
    },

    async findById(id: string): Promise<News> {
      const news = await newsRepo.findById(id);
      if (!news) {
        throw new AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404);
      }
      return news;
    },

    async findBySlug(slug: string): Promise<News> {
      const news = await newsRepo.findBySlug(slug);
      if (!news) {
        throw new AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404);
      }
      return news;
    },

    async update(id: string, input: Partial<CreateNewsDTO>): Promise<News> {
      const news = await newsRepo.update(id, input);
      if (!news) {
        throw new AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404);
      }
      return news;
    },

    async delete(id: string): Promise<void> {
      const deleted = await newsRepo.delete(id);
      if (!deleted) {
        throw new AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404);
      }
      cacheService.update<NewsIndexEntry[]>("news-index", (current = []) =>
        current.filter((n) => n.id !== id),
      );
    },

    async search(params: {
      q: string;
      order: "newest" | "oldest";
      page: number;
      perPage: number;
    }): Promise<{
      items: NewsPreviewDTO[];
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    }> {
      let entries = cacheService.get<NewsIndexEntry[]>("news-index");
      if (!entries) {
        console.log("search (cache miss) - NewsService");
        // await cacheService.warmUpNewsIndex(newsRepo);
        entries = cacheService.get<NewsIndexEntry[]>("news-index") || [];
      } else {
        console.log("search (cache hit) - NewsService");
      }

      const query = params.q
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      let filtered = entries.filter((n) => {
        const t = n.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        const s = n.slug
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
        return t.includes(query) || s.includes(query);
      });

      if (params.order === "oldest") {
        // Reverse creates a new sorted array from the originally newest-first entries
        filtered = [...filtered].reverse();
      }

      const total = filtered.length;
      const start = (params.page - 1) * params.perPage;
      const pageEntries = filtered.slice(start, start + params.perPage);
      const ids = pageEntries.map((e) => e.id);

      const items = await newsRepo.findManyByIds(ids);

      const orderedItems = items.sort((a, b) => {
        return ids.indexOf(a.id) - ids.indexOf(b.id);
      });

      return {
        items: orderedItems.map((n) => ({
          id: n.id,
          title: n.title,
          summary: n.summary,
          coverImageUrl: n.coverImageUrl,
          category: n.category,
          tags: n.tags,
          featured: n.featured,
          readingTime: n.readingTime,
          publishedAt: n.publishedAt ?? null,
          authorName: n.author,
        })),
        total,
        page: params.page,
        perPage: params.perPage,
        totalPages: Math.ceil(total / params.perPage) || 1,
      };
    },

    async findLatest(params: NewsListQueryDTO): Promise<{
      items: NewsPreviewDTO[];
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    }> {
      const { items, total } = await newsRepo.findLatest(params);
      return {
        items: items.map((n) => ({
          id: n.id,
          title: n.title,
          summary: n.summary,
          coverImageUrl: n.coverImageUrl,
          category: n.category,
          tags: n.tags,
          featured: n.featured,
          readingTime: n.readingTime,
          publishedAt: n.publishedAt ?? null,
          authorName: n.author,
        })),
        total,
        page: params.page,
        perPage: params.perPage,
        totalPages: Math.ceil(total / params.perPage) || 1,
      };
    },
  };
}
