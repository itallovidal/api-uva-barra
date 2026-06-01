import type { RegistrationRequestRepository } from "@/repository/registration-request";
import type { UserRepository } from "@/repository/user";
import { AppErrorClass } from "@/types/api";
import {
  RegistrationRequestDTO,
  RegistrationRequestListQuery,
} from "@/types/registration/dtos";
import {
  RegistrationRequest,
  RegistrationRequestStatus,
} from "@/types/registration/entities";
import {
  User,
  UserRole,
  UserStatus,
} from "@/types/user/entities";
import { hashPassword } from "@/utils/password-handler";
import { v4 as uuidv4 } from "uuid";

export type RegistrationService = ReturnType<typeof RegistrationServiceFactory>;

export function RegistrationServiceFactory(
  registrationRequestRepo: RegistrationRequestRepository,
  userRepo: UserRepository,
) {
  return {
    async createRegistrationRequest(input: RegistrationRequestDTO) {
      const existingUser = await userRepo.findByEmail(input.email);
      if (existingUser) {
        throw new AppErrorClass(
          `Um usuário com email ${input.email} já existe.`,
          "EMAIL_ALREADY_EXISTS",
          409,
        );
      }

      const existingRequest = await registrationRequestRepo.findByEmail(
        input.email,
      );
      if (existingRequest) {
        throw new AppErrorClass(
          `Já existe uma solicitação de registro para o email ${input.email}.`,
          "EMAIL_ALREADY_EXISTS",
          409,
        );
      }

      const passwordHash = await hashPassword(input.password);
      const createdUuid = uuidv4();

      const request: RegistrationRequest = {
        id: createdUuid,
        name: input.name,
        email: input.email,
        passwordHash,
        profession: input.profession,
        bio: input.bio ?? null,
        status: RegistrationRequestStatus.PENDING,
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await registrationRequestRepo.createRequest(request);
    },

    async listRegistrationRequests(query?: RegistrationRequestListQuery) {
      const requests = await registrationRequestRepo.listRequests(query);
      const total = requests.length;
      const page = query?.page ?? 1;
      const perPage = (query?.perPage ?? total) || 10;
      const totalPages = Math.ceil(total / perPage);

      return {
        data: requests,
        meta: { page, perPage, total, totalPages },
      };
    },

    async approveRegistrationRequest(id: string, adminId: string) {
      const request = await registrationRequestRepo.findById(id);
      if (!request) {
        throw new AppErrorClass(
          "Solicitação de registro não encontrada.",
          "NOT_FOUND",
          404,
        );
      }

      if (request.status !== RegistrationRequestStatus.PENDING) {
        throw new AppErrorClass(
          "A solicitação não está pendente e não pode ser aprovada.",
          "INVALID_PAYLOAD",
          422,
        );
      }

      const existingUser = await userRepo.findByEmail(request.email);
      if (existingUser) {
        throw new AppErrorClass(
          `Já existe um usuário com o email ${request.email}.`,
          "EMAIL_ALREADY_EXISTS",
          409,
        );
      }

      const userUuid = uuidv4();
      const user: User = {
        id: userUuid,
        name: request.name,
        email: request.email,
        password: request.passwordHash,
        profession: request.profession,
        role: UserRole.COLLABORATOR,
        bio: request.bio,
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await userRepo.create(user);
      const updatedRequest = await registrationRequestRepo.updateRequest(id, {
        status: RegistrationRequestStatus.APPROVED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
      });

      return { user, request: updatedRequest };
    },

    async rejectRegistrationRequest(
      id: string,
      adminId: string,
      reason?: string,
    ) {
      const request = await registrationRequestRepo.findById(id);
      if (!request) {
        throw new AppErrorClass(
          "Solicitação de registro não encontrada.",
          "NOT_FOUND",
          404,
        );
      }

      if (request.status !== RegistrationRequestStatus.PENDING) {
        throw new AppErrorClass(
          "A solicitação não está pendente e não pode ser rejeitada.",
          "INVALID_PAYLOAD",
          422,
        );
      }

      return await registrationRequestRepo.updateRequest(id, {
        status: RegistrationRequestStatus.REJECTED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        rejectionReason: reason ?? null,
      });
    },
  };
}
