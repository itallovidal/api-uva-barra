import { z } from "zod";

// Non-deprecated email validation using regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .refine((val) => emailRegex.test(val), {
      message: "Email inválido",
    }),
});

export const createNewsletterSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export const updateNewsletterSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export const newsletterParamsSchema = z.object({
  id: z.string().uuid("ID de newsletter inválido"),
});

export const emailParamsSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .refine((val) => emailRegex.test(val), {
      message: "Email inválido",
    }),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
});
