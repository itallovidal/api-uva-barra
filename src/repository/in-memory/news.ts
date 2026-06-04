import type { News } from "@/types/news/entities";
import type { CreateNewsDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { NewsStatus } from "@/types/news/entities";
import { slugify, calculateReadingTime } from "@/utils/news-utils";

export function createNewsInMemoryRepository(): NewsRepository {
  const store = new Map<string, News>();

  return {
    async findById(id: string): Promise<News | null> {
      return store.get(id) ?? null;
    },

    async findBySlug(slug: string): Promise<News | null> {
      const all = Array.from(store.values());
      return all.find((n) => n.slug === slug) ?? null;
    },

    async create(input: CreateNewsDTO): Promise<News> {
      const now = new Date();
      const news: News = {
        id: crypto.randomUUID(),
        title: input.title,
        slug: input.slug ?? slugify(input.title),
        summary: input.summary,
        content: input.content,
        coverImageUrl: input.coverImageUrl,
        category: input.category,
        author: input.author ?? "",
        status: input.status,
        tags: input.tags,
        featured: input.featured,
        readingTime: calculateReadingTime(input.content),
        createdAt: now,
        updatedAt: now,
        publishedAt: input.status === NewsStatus.PUBLISHED ? now : null,
      };
      store.set(news.id, news);
      return news;
    },

    async update(id: string, input: Partial<CreateNewsDTO>): Promise<News | null> {
      const existing = store.get(id);
      if (!existing) return null;

      const updated: News = {
        ...existing,
        title: input.title ?? existing.title,
        slug: input.slug ?? (input.title ? slugify(input.title) : existing.slug),
        summary: input.summary ?? existing.summary,
        content: input.content ?? existing.content,
        coverImageUrl: input.coverImageUrl ?? existing.coverImageUrl,
        category: input.category ?? existing.category,
        author: input.author ?? existing.author,
        tags: input.tags ?? existing.tags,
        featured: input.featured ?? existing.featured,
        status: input.status ?? existing.status,
        readingTime: input.content
          ? calculateReadingTime(input.content)
          : existing.readingTime,
        updatedAt: new Date(),
        publishedAt:
          input.status === NewsStatus.PUBLISHED && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
      };
      store.set(id, updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },

    async findLatest(params: {
      page: number;
      perPage: number;
      category?: string;
    }): Promise<{ items: News[]; total: number }> {
      const all = Array.from(store.values());
      const published = all.filter(
        (n) =>
          n.status === NewsStatus.PUBLISHED &&
          (!params.category || n.category === params.category),
      );
      published.sort(
        (a, b) =>
          (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
      );

      const total = published.length;
      const start = (params.page - 1) * params.perPage;
      const items = published.slice(start, start + params.perPage);

      return { items, total };
    },
  };
}
