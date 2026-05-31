import type { RegistrationRequestListQuery } from "@/types/dto";
import type { RegistrationRequest } from "@/types/entities";

export interface RegistrationRequestRepository {
  createRequest(data: RegistrationRequest): Promise<RegistrationRequest>;
  findById(id: string): Promise<RegistrationRequest | null>;
  findByEmail(email: string): Promise<RegistrationRequest | null>;
  listRequests(
    query?: RegistrationRequestListQuery,
  ): Promise<RegistrationRequest[]>;
  updateRequest(
    id: string,
    patch: Partial<RegistrationRequest>,
  ): Promise<RegistrationRequest>;
}
