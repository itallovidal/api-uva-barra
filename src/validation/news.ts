import { NewsStatus } from "@/types/news/entities";
import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url("Invalid cover image URL"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum([
    NewsStatus.DRAFT,
    NewsStatus.REVIEW,
    NewsStatus.PUBLISHED,
    NewsStatus.ARCHIVED,
  ]),
});

export const updateNewsSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImageUrl: z.string().url("Invalid cover image URL").optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z
    .enum([
      NewsStatus.DRAFT,
      NewsStatus.REVIEW,
      NewsStatus.PUBLISHED,
      NewsStatus.ARCHIVED,
    ])
    .optional(),
});

export const newsParamsSchema = z.object({
  id: z.string().uuid("Invalid news ID"),
});

export const latestNewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(50).optional().default(10),
});
