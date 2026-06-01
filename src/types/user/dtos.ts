import type {
  UserProfessionType,
  UserRoleType,
} from "./entities";

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
