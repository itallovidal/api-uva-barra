import { NewsStatusType } from "./entities";

export interface NewsPreviewDTO {
  id: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingTime: number;
  publishedAt: Date | null;
  authorName: string;
}

export interface CreateNewsDTO {
  title: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: NewsStatusType;
}
