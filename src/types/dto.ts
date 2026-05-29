import type { NewsStatusType, UserProfessionType, UserRoleType } from './entities';

export interface CreateCategoryRequestDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequestDTO {
  name?: string;
  description?: string;
}

export interface NewsRequestDTO {
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  coverImageUrl?: string | null;
  status?: NewsStatusType;
  featured?: boolean;
  readingTime?: number | null;
}

export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
  profession: UserProfessionType;
  role?: UserRoleType;
  bio?: string | null;
}

export interface NewsPreviewDTO {
  id: string;
  title: string;
  summary: string;
  coverImageUrl: string | null;
  categoryName: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  featured: boolean;
  readingTime: number | null;
  publishedAt: Date | null;
  authorName: string;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  avatarUrl: string | null;
  profession: UserProfessionType;
  bio: string | null;
}
