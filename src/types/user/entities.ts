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

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
export type UserProfessionType = keyof typeof UserProfession;
export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

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
