import { NewsStatus, type NewsStatusType, type News } from "@/types/news/entities";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateReadingTime(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function normalizeNewsStatus(
  status: NewsStatusType | null | undefined,
): NewsStatusType {
  return status ?? NewsStatus.PUBLISHED;
}

export function getNewsTimelineDate(
  news: Pick<News, "publishedAt" | "updatedAt" | "createdAt">,
): Date {
  return news.publishedAt ?? news.updatedAt ?? news.createdAt;
}
