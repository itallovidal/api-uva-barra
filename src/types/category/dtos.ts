export interface CreateCategoryRequestDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequestDTO {
  name?: string;
  description?: string;
}
