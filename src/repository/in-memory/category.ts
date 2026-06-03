import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/category/dtos";
import type { CategoryRepository } from "@/repository/category";

export function createCategoryInMemoryRepository(): CategoryRepository {
  const store = new Map<string, Category>();

  return {
    async findAll(): Promise<Category[]> {
      return Array.from(store.values());
    },

    async findById(id: string): Promise<Category | null> {
      return store.get(id) ?? null;
    },

    async create(input: CreateCategoryRequestDTO): Promise<Category> {
      const category: Category = {
        id: crypto.randomUUID(),
        name: input.name,
        tags: input.tags ?? [],
      };
      store.set(category.id, category);
      return category;
    },

    async update(id: string, input: UpdateCategoryRequestDTO): Promise<Category | null> {
      if (!store.has(id)) {
        return null;
      }
      const category: Category = {
        id,
        name: input.name,
        tags: input.tags,
      };
      store.set(id, category);
      return category;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },
  };
}
