import { NewsStatus } from "@/types/news/entities";
import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().default(""),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum([
    NewsStatus.DRAFT,
    NewsStatus.REVIEW,
    NewsStatus.PUBLISHED,
    NewsStatus.ARCHIVED,
  ]),
  slug: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
});

export const updateNewsSchema = z.object({
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  coverImageUrl: z.string().default(""),
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
  slug: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
});

export const newsParamsSchema = z.object({
  id: z.string().uuid("Invalid news ID"),
});

export const newsSlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const latestNewsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(50).optional().default(10),
});

export const newsSearchQuerySchema = z.object({
  q: z.string().min(1, "Search term is required"),
  order: z.enum(["newest", "oldest"]).optional().default("newest"),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(50).optional().default(10),
});
