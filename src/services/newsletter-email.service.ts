import type { NewsletterEmail } from "@/types/newsletter/entities";
import type { NewsletterEmailRepository } from "@/repository/newsletter-email";
import { AppErrorClass } from "@/types/api";
import { v4 as uuidv4 } from "uuid";

export type NewsletterEmailService = ReturnType<typeof createNewsletterEmailService>;

export function createNewsletterEmailService(
  newsletterEmailRepo: NewsletterEmailRepository,
) {
  return {
    async registerEmail(email: string): Promise<NewsletterEmail> {
      const exists = await newsletterEmailRepo.exists(email);
      if (exists) {
        throw new AppErrorClass(
          "Este email já está cadastrado na newsletter.",
          "CONFLICT",
          409,
        );
      }

      const id = uuidv4();
      const newsletterEmail: NewsletterEmail = {
        id,
        email,
        createdAt: new Date(),
      };

      return await newsletterEmailRepo.create(newsletterEmail);
    },

    async findAll(
      page: number,
      perPage: number,
    ): Promise<{ data: NewsletterEmail[]; total: number; totalPages: number }> {
      const offset = (page - 1) * perPage;
      const result = await newsletterEmailRepo.findAll(perPage, offset);
      const totalPages = Math.ceil(result.total / perPage);

      return {
        data: result.data,
        total: result.total,
        totalPages,
      };
    },

    async findByEmail(email: string): Promise<NewsletterEmail> {
      const newsletterEmail = await newsletterEmailRepo.findByEmail(email);
      if (!newsletterEmail) {
        throw new AppErrorClass(
          "Email não encontrado na newsletter.",
          "NOT_FOUND",
          404,
        );
      }
      return newsletterEmail;
    },
  };
}
