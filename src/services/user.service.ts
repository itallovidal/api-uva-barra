// TODO: Implement user service methods
// import type { User, CreateUserRequest } from "@/types/user";
import type { UserRepository } from "@/repository/user";

export type UserService = ReturnType<typeof createUserService>;

export function createUserService(userRepo: UserRepository) {
  return {
    //  TODO: Implement user service methods
  };
}
