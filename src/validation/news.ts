import { NewsStatus } from "@/types/news/entities";
import { z } from "zod";

export const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters").trim(),
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be at most 500 characters").trim(),
  content: z.string().min(1, "Content is required").trim(),
  coverImageUrl: z.union([z.literal(""), z.string().url("Invalid URL")]).default(""),
  category: z.string().min(1, "Category is required").trim(),
  tags: z.array(z.string().min(1, "Tag cannot be empty").trim()).max(10, "At most 10 tags allowed").default([]),
  featured: z.boolean().default(false),
  status: z.enum([
    NewsStatus.DRAFT,
    NewsStatus.REVIEW,
    NewsStatus.PUBLISHED,
    NewsStatus.ARCHIVED,
  ]),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphenated").optional(),
  author: z.string().min(1).trim().optional(),
});

export const updateNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters").trim().optional(),
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be at most 500 characters").trim().optional(),
  content: z.string().min(1, "Content is required").trim().optional(),
  coverImageUrl: z.union([z.literal(""), z.string().url("Invalid URL")]).optional(),
  category: z.string().min(1, "Category is required").trim().optional(),
  tags: z.array(z.string().min(1, "Tag cannot be empty").trim()).max(10, "At most 10 tags allowed").optional(),
  featured: z.boolean().optional(),
  status: z
    .enum([
      NewsStatus.DRAFT,
      NewsStatus.REVIEW,
      NewsStatus.PUBLISHED,
      NewsStatus.ARCHIVED,
    ])
    .optional(),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphenated").optional(),
  author: z.string().min(1).trim().optional(),
  publishedAt: z.nullable(z.iso.datetime()).optional(),
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

export const newsListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(50).optional().default(10),
  status: z.enum([NewsStatus.PUBLISHED, NewsStatus.UNPUBLISHED]).optional().default(NewsStatus.PUBLISHED),
});

export const newsListingQuerySchema = newsListQuerySchema;

export const newsSearchQuerySchema = z.object({
  q: z.string().min(1, "Search term is required"),
  order: z.enum(["newest", "oldest"]).optional().default("newest"),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(50).optional().default(10),
});
