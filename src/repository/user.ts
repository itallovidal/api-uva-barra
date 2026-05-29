import type { User } from "@/types/entities";
import type { UserRequestDTO } from "@/types/dto";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: UserRequestDTO): Promise<User>;
  update(id: string, input: Partial<UserRequestDTO>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
