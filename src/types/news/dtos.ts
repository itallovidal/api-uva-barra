import type { NewsStatusType } from "./entities";

export interface NewsRequestDTO {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  coverImageUrl?: string | null;
  status?: NewsStatusType;
  featured?: boolean;
  readingTime?: number | null;
}

export interface NewsPreviewDTO {
  id: string;
  title: string;
  summary: string;
  coverImageUrl: string | null;
  categoryName: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  featured: boolean;
  readingTime: number | null;
  publishedAt: Date | null;
  authorName: string;
}
