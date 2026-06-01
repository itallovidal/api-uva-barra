import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO } from "@/types/category/dtos";
import type { CategoryRepository } from "@/repository/category";

export function createCategoryInMemoryRepository(): CategoryRepository {
  const store = new Map<string, Category>();

  return {
    async findAll(): Promise<Category[]> {
      return Array.from(store.values());
    },

    async create(input: CreateCategoryRequestDTO): Promise<Category> {
      const category: Category = {
        id: crypto.randomUUID(),
        name: input.name,
      };
      store.set(category.id, category);
      return category;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },
  };
}
