import type { News } from "@/types/news/entities";
import type { CreateNewsDTO } from "@/types/news/dtos";
import type { NewsRepository } from "@/repository/news";
import { NewsStatus } from "@/types/news/entities";
import { slugify, calculateReadingTime } from "@/utils/news-utils";
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
    status: data.status as News["status"],
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
          input.status === NewsStatus.PUBLISHED && !existing.publishedAt
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

    async findLatest(params: {
      page: number;
      perPage: number;
      category?: string;
    }): Promise<{ items: News[]; total: number }> {
      let query = db
        .collection(COLLECTION)
        .where("status", "==", NewsStatus.PUBLISHED)
        .orderBy("publishedAt", "desc") as FirebaseFirestore.Query;

      if (params.category) {
        query = query.where("category", "==", params.category);
      }

      const countSnapshot = await query.count().get();
      const total = countSnapshot.data().count;

      const snapshot = await query
        .offset((params.page - 1) * params.perPage)
        .limit(params.perPage)
        .get();

      const items = snapshot.docs.map((doc) =>
        deserializeNews(doc.id, doc.data() as Record<string, unknown>),
      );

      return { items, total };
    },
  };
}
