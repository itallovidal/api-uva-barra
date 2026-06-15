import type { News } from "@/types/news/entities";
import type { CreateNewsDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { NewsStatus } from "@/types/news/entities";
import {
  slugify,
  calculateReadingTime,
  getNewsTimelineDate,
  normalizeNewsStatus,
} from "@/utils/news-utils";
import type { Firestore, Timestamp } from "firebase-admin/firestore";

const COLLECTION = "news";

function deserializeNews(id: string, data: Record<string, unknown>): News {
  return {
    id,
    title: data.title as string,
    slug: data.slug as string,
    summary: data.summary as string,
    content: data.content as string,
    coverImageUrl: data.coverImageUrl as string,
    category: data.category as string,
    author: data.author as string,
    status: normalizeNewsStatus(data.status as News["status"] | null | undefined),
    tags: data.tags as string[],
    featured: data.featured as boolean,
    readingTime: data.readingTime as number,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
    publishedAt: data.publishedAt
      ? (data.publishedAt as Timestamp).toDate()
      : null,
  };
}

export function NewsFirebaseRepositoryFactory(
  db: Firestore,
): NewsRepository {
  return {
    async findById(id: string): Promise<News | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;
      return deserializeNews(doc.id, doc.data() as Record<string, unknown>);
    },

    async findBySlug(slug: string): Promise<News | null> {
      const snapshot = await db
        .collection(COLLECTION)
        .where("slug", "==", slug)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return deserializeNews(doc.id, doc.data() as Record<string, unknown>);
    },

    async findManyByIds(ids: string[]): Promise<News[]> {
      console.log("findManyByIds - NewsFirebaseRepository");
      if (ids.length === 0) return [];
      const promises = ids.map((id) => this.findById(id));
      const results = await Promise.all(promises);
      return results.filter((n): n is News => n !== null);
    },

    async create(input: CreateNewsDTO): Promise<News> {
      const id = crypto.randomUUID();
      const now = new Date();
      const news: News = {
        id,
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
      await db.collection(COLLECTION).doc(id).set(news);
      return news;
    },

    async update(id: string, input: Partial<CreateNewsDTO>): Promise<News | null> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return null;

      const existing = deserializeNews(doc.id, doc.data() as Record<string, unknown>);
      const now = new Date();
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
        updatedAt: now,
        publishedAt:
          input.publishedAt
            ? new Date(input.publishedAt)
            : input.status === NewsStatus.PUBLISHED && !existing.publishedAt
              ? now
              : existing.publishedAt,
      };
      await db.collection(COLLECTION).doc(id).set(updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const doc = await db.collection(COLLECTION).doc(id).get();
      if (!doc.exists) return false;
      await doc.ref.delete();
      return true;
    },

    async findLatest(params): Promise<{ items: News[]; total: number }> {
      let query = db.collection(COLLECTION) as FirebaseFirestore.Query;

      if (params.category) {
        query = query.where("category", "==", params.category);
      }

      const snapshot = await query.get();
      const items = snapshot.docs.map((doc) =>
        deserializeNews(doc.id, doc.data() as Record<string, unknown>),
      );

      const filtered = items.filter((news) => {
        if (params.status === NewsStatus.PUBLISHED) {
          return news.status === NewsStatus.PUBLISHED;
        }

        return news.status !== NewsStatus.PUBLISHED;
      });

      filtered.sort((a, b) => {
        return getNewsTimelineDate(b).getTime() - getNewsTimelineDate(a).getTime();
      });

      const total = filtered.length;
      const start = (params.page - 1) * params.perPage;
      const pagedItems = filtered.slice(start, start + params.perPage);

      return { items: pagedItems, total };
    },

    async search(params: {
      q: string;
      order: "newest" | "oldest";
      page: number;
      perPage: number;
    }): Promise<{ items: News[]; total: number }> {
      console.log("search - NewsFirebaseRepository");
      const snapshot = await db.collection(COLLECTION).get();
      const all = snapshot.docs.map((doc) =>
        deserializeNews(doc.id, doc.data() as Record<string, unknown>),
      );

      const query = params.q
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const filtered = all.filter((n) => {
        if (n.status !== NewsStatus.PUBLISHED) return false;
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
