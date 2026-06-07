import type { News } from "@/types/news/entities";
import type { CreateNewsDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { NewsStatus } from "@/types/news/entities";
import {
  slugify,
  calculateReadingTime,
  getNewsTimelineDate,
} from "@/utils/news-utils";

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

    async findManyByIds(ids: string[]): Promise<News[]> {
      console.log("findManyByIds - NewsInMemoryRepository");
      const all = Array.from(store.values());
      return all.filter((n) => ids.includes(n.id));
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

    async findLatest(params): Promise<{ items: News[]; total: number }> {
      const all = Array.from(store.values());
      const filtered = all.filter((n) => {
        if (params.category && n.category !== params.category) {
          return false;
        }

        if (params.status === NewsStatus.PUBLISHED) {
          return n.status === NewsStatus.PUBLISHED;
        }

        return n.status !== NewsStatus.PUBLISHED;
      });

      filtered.sort((a, b) => {
        return getNewsTimelineDate(b).getTime() - getNewsTimelineDate(a).getTime();
      });

      const total = filtered.length;
      const start = (params.page - 1) * params.perPage;
      const items = filtered.slice(start, start + params.perPage);

      return { items, total };
    },

    async search(params: {
      q: string;
      order: "newest" | "oldest";
      page: number;
      perPage: number;
    }): Promise<{ items: News[]; total: number }> {
      const all = Array.from(store.values());
      const query = params.q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      
      const filtered = all.filter((n) => {
        if (n.status !== NewsStatus.PUBLISHED) return false;
        const t = n.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const s = n.slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return t.includes(query) || s.includes(query);
      });

      filtered.sort((a, b) => {
        const aTime = a.publishedAt?.getTime() ?? 0;
        const bTime = b.publishedAt?.getTime() ?? 0;
        return params.order === "newest" ? bTime - aTime : aTime - bTime;
      });

      const total = filtered.length;
      const start = (params.page - 1) * params.perPage;
      const items = filtered.slice(start, start + params.perPage);

      return { items, total };
    },
  };
}
