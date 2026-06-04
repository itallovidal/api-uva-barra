import type { News } from "@/types/news/entities";
import type { CreateNewsDTO, NewsPreviewDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { AppErrorClass } from "@/types/api";

export type NewsService = ReturnType<typeof createNewsService>;

export function createNewsService(newsRepo: NewsRepository) {
  return {
    async create(input: CreateNewsDTO): Promise<News> {
      return newsRepo.create(input);
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
    },

    async findLatest(params: {
      page: number;
      perPage: number;
      category?: string;
    }): Promise<{
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
        totalPages: Math.ceil(total / params.perPage),
      };
    },
  };
}
