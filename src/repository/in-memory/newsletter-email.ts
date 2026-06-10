import type { NewsletterEmail } from "@/types/newsletter/entities";
import type { NewsletterEmailRepository } from "@/repository/newsletter-email";
import { v4 as uuidv4 } from "uuid";

export function createNewsletterEmailInMemoryRepository(): NewsletterEmailRepository {
  const store = new Map<string, NewsletterEmail>();

  return {
    async findAll(
      limit: number,
      offset: number,
    ): Promise<{ data: NewsletterEmail[]; total: number }> {
      const all = Array.from(store.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      const total = all.length;
      const data = all.slice(offset, offset + limit);
      return { data, total };
    },

    async findByEmail(email: string): Promise<NewsletterEmail | null> {
      return (
        Array.from(store.values()).find((item) => item.email === email) ?? null
      );
    },

    async findById(id: string): Promise<NewsletterEmail | null> {
      return store.get(id) ?? null;
    },

    async exists(email: string): Promise<boolean> {
      return Array.from(store.values()).some((item) => item.email === email);
    },

    async create(input: NewsletterEmail): Promise<NewsletterEmail> {
      const email: NewsletterEmail = {
        id: input.id || uuidv4(),
        email: input.email,
        createdAt: input.createdAt || new Date(),
      };
      store.set(email.id, email);
      return email;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },
  };
}
