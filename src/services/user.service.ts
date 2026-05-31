import type { UserRepository } from "@/repository/user";
import { API_ERROR_CODES } from "@/shared/types/response";
import { UserRequestDTO } from "@/types/dto";
import { User, UserRole, UserStatus } from "@/types/entities";
import { hashPassword } from "@/utils/password-handler";
import { v4 as uuidv4 } from "uuid";

export type UserService = ReturnType<typeof UserServiceFactory>;

export function UserServiceFactory(userRepo: UserRepository) {
  return {
    async registerRequest(input: UserRequestDTO) {
      const userAlreadyExists = await userRepo.findByEmail(input.email);

      if (userAlreadyExists) {
        throw new Error("User with this email already exists", {
          cause: {
            code: API_ERROR_CODES.User.EmailAlreadyExists,
            message: `Um usuário com email ${input.email} já existe.`,
            status: 409,
          },
        });
      }

      const passwordHashed = await hashPassword(input.password);
      const createdUuid = uuidv4();

      const user: User = {
        id: createdUuid,
        name: input.name,
        email: input.email,
        password: passwordHashed,
        profession: input.profession,
        role: UserRole.COLLABORATOR,
        bio: input.bio ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: UserStatus.PENDING,
      };

      return await userRepo.create(user);
    },

    getUserById(id: string) {
      return userRepo.findById(id);
    },

    getUserByEmail(email: string) {
      return userRepo.findByEmail(email);
    },

    updateUser(id: string, input: Partial<Omit<User, "id">>) {
      return userRepo.update(id, input as User);
    },

    deleteUser(id: string) {
      return userRepo.delete(id);
    },
  };
}
