import type { RegistrationRequestListQuery } from "@/types/dto";
import type { RegistrationRequest } from "@/types/entities";
import type { RegistrationRequestRepository } from "../registration-request";

export function RegistrationRequestInMemoryRepositoryFactory(): RegistrationRequestRepository {
  const store = new Map<string, RegistrationRequest>();

  return {
    async createRequest(
      data: RegistrationRequest,
    ): Promise<RegistrationRequest> {
      store.set(data.id, data);
      return data;
    },

    async findById(id: string): Promise<RegistrationRequest | null> {
      return store.get(id) || null;
    },

    async findByEmail(email: string): Promise<RegistrationRequest | null> {
      for (const request of store.values()) {
        if (request.email === email) {
          return request;
        }
      }
      return null;
    },

    async listRequests(
      query?: RegistrationRequestListQuery,
    ): Promise<RegistrationRequest[]> {
      let requests = Array.from(store.values());

      if (query?.status) {
        requests = requests.filter((r) => r.status === query.status);
      }

      return requests;
    },

    async updateRequest(
      id: string,
      patch: Partial<RegistrationRequest>,
    ): Promise<RegistrationRequest> {
      const existing = store.get(id);
      if (!existing) {
        throw new Error("Registration request not found");
      }

      const updated = { ...existing, ...patch, updatedAt: new Date() };
      store.set(id, updated);
      return updated;
    },
  };
}
