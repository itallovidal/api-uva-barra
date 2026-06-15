import type { News } from "@/types/news/entities";
import { NewsStatus } from "@/types/news/entities";
import type { CreateNewsDTO, NewsListQueryDTO, NewsPreviewDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { AppErrorClass } from "@/types/api";
import type { CacheService, CachedNewsPreview } from "@/services/cache.service";

export type NewsService = ReturnType<typeof createNewsService>;

export function createNewsService(
  newsRepo: NewsRepository,
  cacheService: CacheService,
) {
  return {
    async create(input: CreateNewsDTO): Promise<News> {
      const news = await newsRepo.create(input);
      const preview: CachedNewsPreview = {
        id: news.id,
        slug: news.slug,
        title: news.title,
        summary: news.summary,
        coverImageUrl: news.coverImageUrl,
        category: news.category,
        tags: news.tags,
        featured: news.featured,
        readingTime: news.readingTime,
        publishedAt: news.publishedAt ?? null,
        author: news.author,
        status: news.status,
      };
      cacheService.update<CachedNewsPreview[]>("news-index", (current = []) => [
        preview,
        ...current,
      ]);
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
      const definedInput = Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== undefined),
      );
      const news = await newsRepo.update(id, definedInput);
      if (!news) {
        throw new AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404);
      }
      const preview: CachedNewsPreview = {
        id: news.id,
        slug: news.slug,
        title: news.title,
        summary: news.summary,
        coverImageUrl: news.coverImageUrl,
        category: news.category,
        tags: news.tags,
        featured: news.featured,
        readingTime: news.readingTime,
        publishedAt: news.publishedAt ?? null,
        author: news.author,
        status: news.status,
      };
      cacheService.update<CachedNewsPreview[]>("news-index", (current = []) => {
        const filtered = current.filter((n) => n.id !== id);
        return [preview, ...filtered];
      });
      return news;
    },

    async delete(id: string): Promise<void> {
      const deleted = await newsRepo.delete(id);
      if (!deleted) {
        throw new AppErrorClass("Notícia não encontrada", "NOT_FOUND", 404);
      }
      cacheService.update<CachedNewsPreview[]>("news-index", (current = []) =>
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
      const entries = cacheService.get<CachedNewsPreview[]>("news-index");
      if (entries) {
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
          filtered = [...filtered].reverse();
        }

        const total = filtered.length;
        const start = (params.page - 1) * params.perPage;
        const pageEntries = filtered.slice(start, start + params.perPage);

        return {
          items: pageEntries,
          total,
          page: params.page,
          perPage: params.perPage,
          totalPages: Math.ceil(total / params.perPage) || 1,
        };
      }

      console.log("search (cache miss) - NewsService");
      const { items, total } = await newsRepo.search(params);
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
          author: n.author,
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
      const entries = cacheService.get<CachedNewsPreview[]>("news-index");
      if (entries) {
        let filtered = [...entries];

        if (params.category) {
          filtered = filtered.filter((n) => n.category === params.category);
        }

        if (params.status === NewsStatus.PUBLISHED) {
          filtered = filtered.filter((n) => n.status === NewsStatus.PUBLISHED);
        } else {
          filtered = filtered.filter((n) => n.status !== NewsStatus.PUBLISHED);
        }

        const total = filtered.length;
        const start = (params.page - 1) * params.perPage;
        const pageItems = filtered.slice(start, start + params.perPage);

        return {
          items: pageItems,
          total,
          page: params.page,
          perPage: params.perPage,
          totalPages: Math.ceil(total / params.perPage) || 1,
        };
      }

      console.log("findLatest (cache miss) - NewsService");
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
          author: n.author,
        })),
        total,
        page: params.page,
        perPage: params.perPage,
        totalPages: Math.ceil(total / params.perPage) || 1,
      };
    },
  };
}
