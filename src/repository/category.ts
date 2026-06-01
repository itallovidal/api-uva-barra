import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO, UpdateCategoryRequestDTO } from "@/types/category/dtos";

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(input: CreateCategoryRequestDTO): Promise<Category>;
  update(id: string, input: UpdateCategoryRequestDTO): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}
