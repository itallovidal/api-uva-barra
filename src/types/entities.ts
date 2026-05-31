export const UserRole = {
  COLLABORATOR: "collaborator",
  ADMIN: "admin",
} as const;

export const UserProfession = {
  DESIGNER: "designer",
  REDATOR: "redator",
  DESENVOLVEDOR: "desenvolvedor",
  SOCIAL_MEDIA: "social_media",
  EDITOR_CHEFE: "editor_chefe",
  OUTRO: "outro",
} as const;

export const NewsStatus = {
  DRAFT: "draft",
  REVIEW: "review",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

export const RegistrationRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type UserProfessionType = keyof typeof UserProfession;
export type NewsStatusType = (typeof NewsStatus)[keyof typeof NewsStatus];
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
export type RegistrationRequestStatusType =
  (typeof RegistrationRequestStatus)[keyof typeof RegistrationRequestStatus];

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  role: UserRoleType;
  profession: UserProfessionType;
  bio?: string | null;
  status: UserStatusType;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  profession: UserProfessionType;
  bio: string | null;
  status: RegistrationRequestStatusType;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImageUrl?: string | null;
  categoryId: string;
  authorId: string;
  status: NewsStatusType;
  tags: string[];
  featured: boolean;
  readingTime: number | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}
