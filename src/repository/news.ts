import type { News } from "@/types/news/entities";
import type { CreateNewsDTO } from "@/types/news/dtos";

export interface NewsRepository {
  findById(id: string): Promise<News | null>;
  findBySlug(slug: string): Promise<News | null>;
  findManyByIds(ids: string[]): Promise<News[]>;
  create(input: CreateNewsDTO): Promise<News>;
  update(id: string, input: Partial<CreateNewsDTO>): Promise<News | null>;
  delete(id: string): Promise<boolean>;
  findLatest(params: {
    page: number;
    perPage: number;
    category?: string;
  }): Promise<{ items: News[]; total: number }>;
  search(params: {
    q: string;
    order: "newest" | "oldest";
    page: number;
    perPage: number;
  }): Promise<{ items: News[]; total: number }>;
}
