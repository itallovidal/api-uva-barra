import type { UserRepository } from "@/repository/user";
import { API_ERROR_CODES } from "@/shared/types/response";
import { CreateUserDTO } from "@/types/user/dtos";
import { User, UserRole, UserStatus } from "@/types/user/entities";
import { hashPassword, verifyPassword } from "@/utils/password-handler";
import { generateToken } from "@/utils/jwt-handler";
import { v4 as uuidv4 } from "uuid";

export type UserService = ReturnType<typeof UserServiceFactory>;

export function UserServiceFactory(userRepo: UserRepository) {
  return {
    async createUser(input: CreateUserDTO) {
      const existingUser = await userRepo.findByEmail(input.email);
      if (existingUser) {
        throw new Error("User with this email already exists", {
          cause: {
            code: API_ERROR_CODES.User.EmailAlreadyExists,
            message: `Um usuário com email ${input.email} já existe.`,
            status: 409,
          },
        });
      }

      const passwordHash = await hashPassword(input.password);
      const uuid = uuidv4();

      const user: User = {
        id: uuid,
        name: input.name,
        email: input.email,
        password: passwordHash,
        profession: input.profession,
        role: input.role ?? UserRole.COLLABORATOR,
        bio: input.bio ?? null,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await userRepo.create(user);
    },

    async login(email: string, password: string) {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw new Error("Invalid credentials", {
          cause: {
            code: API_ERROR_CODES.User.InvalidCredentials,
            message: "Email ou senha inválidos.",
            status: 401,
          },
        });
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials", {
          cause: {
            code: API_ERROR_CODES.User.InvalidCredentials,
            message: "Email ou senha inválidos.",
            status: 401,
          },
        });
      }

      const accessToken = generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const { password: _, ...userWithoutPassword } = user;

      return { accessToken, user: userWithoutPassword };
    },

    async getUserById(id: string) {
      const user = await userRepo.findById(id);
      if (!user) {
        throw new Error("User not found", {
          cause: {
            code: API_ERROR_CODES.User.NotFound,
            message: "Usuário não encontrado.",
            status: 404,
          },
        });
      }
      return user;
    },

    async getUserByEmail(email: string) {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw new Error("User not found", {
          cause: {
            code: API_ERROR_CODES.User.NotFound,
            message: "Usuário não encontrado.",
            status: 404,
          },
        });
      }
      return user;
    },

    async updateUser(id: string, input: Partial<Omit<User, "id">>) {
      const existing = await userRepo.findById(id);
      if (!existing) {
        throw new Error("User not found", {
          cause: {
            code: API_ERROR_CODES.User.NotFound,
            message: "Usuário não encontrado.",
            status: 404,
          },
        });
      }

      const updated = await userRepo.update(id, {
        ...input,
        updatedAt: new Date(),
      } as User);

      if (!updated) {
        throw new Error("User not found", {
          cause: {
            code: API_ERROR_CODES.User.NotFound,
            message: "Usuário não encontrado.",
            status: 404,
          },
        });
      }

      return updated;
    },

    async deleteUser(id: string) {
      const existing = await userRepo.findById(id);
      if (!existing) {
        throw new Error("User not found", {
          cause: {
            code: API_ERROR_CODES.User.NotFound,
            message: "Usuário não encontrado.",
            status: 404,
          },
        });
      }

      return await userRepo.delete(id);
    },
  };
}
