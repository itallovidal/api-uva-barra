import type {
  NewsStatusType,
  UserProfessionType,
  RegistrationRequestStatusType,
  UserRoleType,
} from "./entities";

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

export interface RegistrationRequestDTO {
  name: string;
  email: string;
  password: string;
  profession: UserProfessionType;
  bio?: string | null;
}

export interface RegistrationRequestResponse {
  id: string;
  name: string;
  email: string;
  profession: UserProfessionType;
  bio: string | null;
  status: RegistrationRequestStatusType;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationRequestListQuery {
  status?: RegistrationRequestStatusType;
  page?: number;
  perPage?: number;
}

export interface ApproveRegistrationDTO {
  adminId: string;
}

export interface RejectRegistrationDTO {
  adminId: string;
  reason?: string;
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

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  profession: UserProfessionType;
  bio?: string | null;
  role?: UserRoleType;
}

export interface UserProfileDTO {
  id: string;
  name: string;
  avatarUrl: string | null;
  profession: UserProfessionType;
  bio: string | null;
}
