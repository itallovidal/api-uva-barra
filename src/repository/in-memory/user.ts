import { User } from "@/types/user/entities";
import { UserRepository } from "../user";

export function UserInMemoryRepositoryFactory(): UserRepository {
  const store = new Map<string, User>();

  return {
    async findById(id: string): Promise<User | null> {
      return store.get(id) || null;
    },

    async findAll(): Promise<User[]> {
      return Array.from(store.values());
    },

    async create(input: User): Promise<User> {
      store.set(input.id, input);
      return input;
    },

    async findByEmail(email: string): Promise<User | null> {
      for (const user of store.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    },

    async update(id: string, updated: User): Promise<User | null> {
      store.set(id, updated);
      return updated;
    },

    async delete(id: string): Promise<boolean> {
      return store.delete(id);
    },
  };
}
