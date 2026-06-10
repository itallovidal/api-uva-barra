import type { Newsletter } from "@/types/newsletter/entities";
import type { NewsletterRepository } from "@/repository/newsletter";
import { v4 as uuidv4 } from "uuid";

export function createNewsletterInMemoryRepository(): NewsletterRepository {
  const store = new Map<string, Newsletter>();

  return {
    async findAll(): Promise<Newsletter[]> {
      return Array.from(store.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    },

    async findById(id: string): Promise<Newsletter | null> {
      return store.get(id) ?? null;
    },

    async create(input: Newsletter): Promise<Newsletter> {
      const newsletter: Newsletter = {
        id: input.id || uuidv4(),
        content: input.content,
        createdAt: input.createdAt || new Date(),
      };
      store.set(newsletter.id, newsletter);
      return newsletter;
    },

    async update(id: string, input: Partial<Newsletter>): Promise<Newsletter | null> {
      if (!store.has(id)) {
        return null;
      }
      const existing = store.get(id)!;
      const updated: Newsletter = {
        ...existing,
        ...input,
        id: existing.id,
      };
      store.set(id, updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },
  };
}
