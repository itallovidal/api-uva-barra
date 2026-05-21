import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(input: CreateCategoryRequest): Promise<Category>;
  update(id: string, input: UpdateCategoryRequest): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}
