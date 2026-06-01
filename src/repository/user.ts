import type { User } from "@/types/entities";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: User): Promise<User>;
  update(id: string, input: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
