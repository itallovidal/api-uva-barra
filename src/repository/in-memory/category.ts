import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/category/dtos";
import type { CategoryRepository } from "@/repository/category";

export function createCategoryInMemoryRepository(): CategoryRepository {
  const store = new Map<string, Category>();

  return {
    async findById(id: string): Promise<Category | null> {
      return store.get(id) ?? null;
    },

    async findAll(): Promise<Category[]> {
      return Array.from(store.values());
    },

    async create(input: CreateCategoryRequestDTO): Promise<Category> {
      const now = new Date();
      const category: Category = {
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description ?? null,
        createdAt: now,
        updatedAt: now,
      };
      store.set(category.id, category);
      return category;
    },

    async update(id: string, input: UpdateCategoryRequestDTO): Promise<Category | null> {
      const existing = store.get(id);
      if (!existing) return null;

      const updated: Category = {
        ...existing,
        name: input.name ?? existing.name,
        description: input.description !== undefined ? input.description : existing.description,
        updatedAt: new Date(),
      };
      store.set(id, updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },
  };
}
