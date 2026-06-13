import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/category/dtos";
import type { CategoryRepository } from "@/repository/category";
import type { CacheService } from "@/services/cache.service";
import { AppErrorClass } from "@/types/api";

export type CategoryService = ReturnType<typeof createCategoryService>;

function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((t) => t.trim()).filter((t) => t.length > 0))];
}

export function createCategoryService(categoryRepo: CategoryRepository, cacheService: CacheService) {
  return {
    async create(input: CreateCategoryRequestDTO): Promise<Category> {
      const normalized = input.tags ? normalizeTags(input.tags) : [];
      const category = await categoryRepo.create({ ...input, tags: normalized });
      cacheService.delete("categories");
      return category;
    },

    async findAll(): Promise<Category[]> {
      const cached = cacheService.get<Category[]>("categories");
      if (cached) {
        return cached;
      }
      const categories = await categoryRepo.findAll();
      cacheService.set("categories", categories);
      return categories;
    },

    async findById(id: string): Promise<Category> {
      const category = await categoryRepo.findById(id);
      if (!category) {
        throw new AppErrorClass("Category not found", "NOT_FOUND", 404);
      }
      return category;
    },

    async update(id: string, input: UpdateCategoryRequestDTO): Promise<Category> {
      const normalized = normalizeTags(input.tags);
      const updated = await categoryRepo.update(id, { ...input, tags: normalized });
      if (!updated) {
        throw new AppErrorClass("Category not found", "NOT_FOUND", 404);
      }
      cacheService.delete("categories");
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      const deleted = await categoryRepo.delete(id);
      if (!deleted) {
        throw new AppErrorClass("Category not found", "NOT_FOUND", 404);
      }
      cacheService.delete("categories");
      return true;
    },
  };
}
