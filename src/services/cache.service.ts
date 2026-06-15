import { TTLCache } from "@isaacs/ttlcache";
import type { NewsRepository } from "@/repository/news";
import type { CategoryRepository } from "@/repository/category";
import type { NewsPreviewDTO } from "@/types/news/dtos";
import { NewsStatus } from "@/types/news/entities";
import type { NewsStatusType } from "@/types/news/entities";
import { getNewsTimelineDate } from "@/utils/news-utils";

export type CachedNewsPreview = NewsPreviewDTO & { slug: string; status: NewsStatusType };

export interface CacheService {
  get<T>(namespace: string): T | undefined;
  set<T>(namespace: string, value: T, ttl?: number): void;
  update<T>(namespace: string, updater: (current: T | undefined) => T): void;
  delete(namespace: string): void;
  reset(namespace: string): void;
  warmUpNewsIndex(newsRepo: NewsRepository): Promise<void>;
  warmUpCategories(categoryRepo: CategoryRepository): Promise<void>;
}

export function createCacheService(): CacheService {
  const caches = new Map<string, TTLCache<string, any>>();
  const DEFAULT_TTL = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

  function getCache(namespace: string): TTLCache<string, any> {
    if (!caches.has(namespace)) {
      caches.set(namespace, new TTLCache({ ttl: DEFAULT_TTL }));
    }
    return caches.get(namespace)!;
  }

  return {
    get<T>(namespace: string): T | undefined {
      const cache = getCache(namespace);
      return cache.get("data") as T | undefined;
    },

    set<T>(namespace: string, value: T, ttl?: number): void {
      const cache = getCache(namespace);
      if (ttl !== undefined) {
        cache.set("data", value, { ttl });
      } else {
        cache.set("data", value);
      }
    },

    update<T>(namespace: string, updater: (current: T | undefined) => T): void {
      const cache = getCache(namespace);
      const current = cache.get("data") as T | undefined;
      cache.set("data", updater(current));
    },

    delete(namespace: string): void {
      const cache = getCache(namespace);
      cache.delete("data");
    },

    reset(namespace: string): void {
      caches.delete(namespace);
    },

    async warmUpNewsIndex(newsRepo: NewsRepository): Promise<void> {
      console.log("warmUpNewsIndex - CacheService");
      try {
        const [published, unpublished] = await Promise.all([
          newsRepo.findLatest({
            page: 1,
            perPage: 100000,
            status: "published",
          }),
          newsRepo.findLatest({
            page: 1,
            perPage: 100000,
            status: "unpublished",
          }),
        ]);

        const allItems = [...published.items, ...unpublished.items];
        allItems.sort((a, b) => {
          const dateA = (a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
          const dateB = (b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime();
          return dateB - dateA;
        });

        const entries: CachedNewsPreview[] = allItems.map((news) => ({
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
        }));
        this.set("news-index", entries);
      } catch (error) {
        console.error("warmUpNewsIndex failed - CacheService", error);
      }
    },

    async warmUpCategories(categoryRepo: CategoryRepository): Promise<void> {
      console.log("warmUpCategories - CacheService");
      const categories = await categoryRepo.findAll();
      this.set("categories", categories);
    },
  };
}
