import type { Category } from "@/types/category/entities";
import type { CreateCategoryRequestDTO } from "@/types/category/dtos";

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  create(input: CreateCategoryRequestDTO): Promise<Category>;
  delete(id: string): Promise<boolean>;
}
