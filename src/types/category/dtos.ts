export interface CreateCategoryRequestDTO {
  name: string;
  tags?: string[];
}

export interface UpdateCategoryRequestDTO {
  name: string;
  tags: string[];
}
