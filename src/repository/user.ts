import type { User, CreateUserRequest } from "@/types/user";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserRequest): Promise<User>;
  update(id: string, input: Partial<CreateUserRequest>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
