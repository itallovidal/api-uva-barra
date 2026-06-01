import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO } from "@/types/category/dtos";
import type { CategoryRepository } from "@/repository/category";
import type { AppError } from "@/shared/types";

export type CategoryService = ReturnType<typeof createCategoryService>;

export function createCategoryService(categoryRepo: CategoryRepository) {
  return {
    async create(input: CreateCategoryRequestDTO): Promise<Category> {
      return categoryRepo.create(input);
    },

    async findAll(): Promise<Category[]> {
      return categoryRepo.findAll();
    },

    async delete(id: string): Promise<boolean> {
      const deleted = await categoryRepo.delete(id);
      if (!deleted) {
        const error: AppError = {
          message: "Category not found",
          code: "NOT_FOUND",
        };
        throw error;
      }
      return true;
    },
  };
}
