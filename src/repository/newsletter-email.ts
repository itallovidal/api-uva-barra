import type { NewsletterEmail } from "@/types/newsletter/entities";

export interface NewsletterEmailRepository {
  findAll(limit: number, offset: number): Promise<{ data: NewsletterEmail[]; total: number }>;
  findByEmail(email: string): Promise<NewsletterEmail | null>;
  findById(id: string): Promise<NewsletterEmail | null>;
  exists(email: string): Promise<boolean>;
  create(input: NewsletterEmail): Promise<NewsletterEmail>;
  delete(id: string): Promise<boolean>;
}
