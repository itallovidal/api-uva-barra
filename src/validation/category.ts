import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  tags: z.array(z.string()).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  tags: z.array(z.string()),
});

export const categoryParamsSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});
