import type { News } from "@/types/news/entities";
import type { CreateNewsDTO } from "@/types/news/dtos";

export interface NewsRepository {
  findById(id: string): Promise<News | null>;
  create(input: CreateNewsDTO): Promise<News>;
  update(id: string, input: Partial<CreateNewsDTO>): Promise<News | null>;
  delete(id: string): Promise<boolean>;
  findLatest(params: {
    page: number;
    perPage: number;
    category?: string;
  }): Promise<{ items: News[]; total: number }>;
}
