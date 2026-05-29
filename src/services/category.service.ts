import type { Category } from "@/types/entities";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/dto";
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

    async findById(id: string): Promise<Category> {
      const category = await categoryRepo.findById(id);
      if (!category) {
        const error: AppError = {
          message: "Category not found",
          code: "NOT_FOUND",
        };
        throw error;
      }
      return category;
    },

    async update(id: string, input: UpdateCategoryRequestDTO): Promise<Category> {
      const category = await categoryRepo.update(id, input);
      if (!category) {
        const error: AppError = {
          message: "Category not found",
          code: "NOT_FOUND",
        };
        throw error;
      }
      return category;
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
