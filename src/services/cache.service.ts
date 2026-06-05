import { TTLCache } from "@isaacs/ttlcache";
import type { NewsRepository } from "@/repository/news";

export type NewsIndexEntry = {
  id: string;
  slug: string;
  title: string;
};

export interface CacheService {
  get<T>(namespace: string): T | undefined;
  set<T>(namespace: string, value: T, ttl?: number): void;
  update<T>(namespace: string, updater: (current: T | undefined) => T): void;
  delete(namespace: string): void;
  reset(namespace: string): void;
  warmUpNewsIndex(newsRepo: NewsRepository): Promise<void>;
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
      // Fetch all published news, findLatest returns them sorted by newest first
      const { items } = await newsRepo.findLatest({ page: 1, perPage: 100000 });
      const entries: NewsIndexEntry[] = items.map((news) => ({
        id: news.id,
        slug: news.slug,
        title: news.title,
      }));
      this.set("news-index", entries);
    },
  };
}
