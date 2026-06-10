import type { Newsletter } from "@/types/newsletter/entities";
import type { NewsletterRepository } from "@/repository/newsletter";
import { AppErrorClass } from "@/types/api";
import { v4 as uuidv4 } from "uuid";

export type NewsletterService = ReturnType<typeof createNewsletterService>;

export function createNewsletterService(
  newsletterRepo: NewsletterRepository,
) {
  return {
    async create(content: string): Promise<Newsletter> {
      const id = uuidv4();
      const newsletter: Newsletter = {
        id,
        content,
        createdAt: new Date(),
      };

      return await newsletterRepo.create(newsletter);
    },

    async findAll(): Promise<Newsletter[]> {
      return await newsletterRepo.findAll();
    },

    async findById(id: string): Promise<Newsletter> {
      const newsletter = await newsletterRepo.findById(id);
      if (!newsletter) {
        throw new AppErrorClass(
          "Newsletter não encontrada.",
          "NOT_FOUND",
          404,
        );
      }
      return newsletter;
    },

    async update(id: string, content: string): Promise<Newsletter> {
      const existing = await newsletterRepo.findById(id);
      if (!existing) {
        throw new AppErrorClass(
          "Newsletter não encontrada.",
          "NOT_FOUND",
          404,
        );
      }

      const updated = await newsletterRepo.update(id, { content });
      if (!updated) {
        throw new AppErrorClass(
          "Newsletter não encontrada.",
          "NOT_FOUND",
          404,
        );
      }
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const existing = await newsletterRepo.findById(id);
      if (!existing) {
        throw new AppErrorClass(
          "Newsletter não encontrada.",
          "NOT_FOUND",
          404,
        );
      }

      return await newsletterRepo.delete(id);
    },
  };
}
