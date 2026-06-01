export const NewsStatus = {
  DRAFT: "draft",
  REVIEW: "review",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type NewsStatusType = (typeof NewsStatus)[keyof typeof NewsStatus];

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  category: string;
  author: string;
  status: NewsStatusType;
  tags: string[];
  featured: boolean;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}
