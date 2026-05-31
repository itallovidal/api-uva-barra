import type { User } from "@/types/entities";
import type { RegistrationRequestDTO } from "@/types/dto";

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: RegistrationRequestDTO): Promise<User>;
  update(id: string, input: Partial<RegistrationRequestDTO>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
